const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Loading env from:', path.resolve(process.cwd(), '.env.local'));
console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Missing');
console.log('Supabase Key:', supabaseKey ? 'Found' : 'Missing');

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

async function migrateUsers() {
    try {
        if (!fs.existsSync(USERS_FILE)) {
            console.log('No users.json file found. Skipping migration.');
            return;
        }

        const fileContent = fs.readFileSync(USERS_FILE, 'utf-8');
        const data = JSON.parse(fileContent);
        const users = data.users || [];

        console.log(`Found ${users.length} users to migrate...`);

        for (const user of users) {
            const { error } = await supabase.from('users').upsert({
                id: user.id,
                email: user.email,
                password: user.password,
                role: user.role,
                balance: user.balance,
                authentication_status: user.authenticationStatus,
                authenticated_at: user.authenticatedAt,
            }, { onConflict: 'id' });

            if (error) {
                console.error(`Failed to migrate user ${user.email}:`, error.message);
            } else {
                console.log(`Migrated user ${user.email}`);
            }
        }

        console.log('Migration complete.');
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

migrateUsers();
