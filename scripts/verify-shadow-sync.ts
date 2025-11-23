import { createUser, updateUser, deleteUser, User } from '../lib/db.ts';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyShadowSync() {
    console.log('--- Starting Shadow Sync Verification ---');

    const testId = uuidv4();
    const testEmail = `shadow-test-${Date.now()}@example.com`;

    try {
        // 1. Create User
        console.log('\n1. Creating user locally...');
        const newUser: User = {
            id: testId,
            email: testEmail,
            password: 'hash',
            role: 'user',
            balance: 100,
            authenticationStatus: 'pending'
        };
        await createUser(newUser);
        console.log('User created locally.');

        // Verify in Supabase
        console.log('Verifying in Supabase...');
        const { data: user1, error: err1 } = await supabase.from('users').select('*').eq('id', testId).single();
        if (err1 || !user1) {
            console.error('❌ User NOT found in Supabase:', err1);
        } else {
            console.log('✅ User found in Supabase:', user1.email);
        }

        // 2. Update User
        console.log('\n2. Updating user locally...');
        const updatedUser = { ...newUser, balance: 500 };
        await updateUser(updatedUser);
        console.log('User updated locally.');

        // Verify in Supabase
        console.log('Verifying update in Supabase...');
        const { data: user2, error: err2 } = await supabase.from('users').select('*').eq('id', testId).single();
        if (err2 || !user2) {
            console.error('❌ User NOT found in Supabase after update:', err2);
        } else if (user2.balance === 500) {
            console.log('✅ User balance updated in Supabase:', user2.balance);
        } else {
            console.error('❌ User balance mismatch in Supabase:', user2.balance);
        }

        // 3. Delete User
        console.log('\n3. Deleting user locally...');
        await deleteUser(testId);
        console.log('User deleted locally.');

        // Verify in Supabase
        console.log('Verifying delete in Supabase...');
        const { data: user3, error: err3 } = await supabase.from('users').select('*').eq('id', testId).single();
        if (!user3) {
            console.log('✅ User deleted from Supabase.');
        } else {
            console.error('❌ User STILL found in Supabase:', user3);
        }

    } catch (error) {
        console.error('❌ Test failed with error:', error);
    } finally {
        // Cleanup if needed (if delete failed)
        await supabase.from('users').delete().eq('id', testId);
    }

    console.log('\n--- Verification Complete ---');
}

verifyShadowSync();
