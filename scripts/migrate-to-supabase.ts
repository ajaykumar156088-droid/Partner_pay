import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function main() {
    try {
        const envContent = await fs.readFile(path.join(process.cwd(), '.env.local'), 'utf-8');
        console.log('Raw .env.local content length:', envContent.length);
        console.log('Raw lines:', envContent.split('\n').map(l => l.split('=')[0]));
    } catch (e) {
        console.log('Could not read .env.local');
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log('Env keys:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));
    console.log('URL Value Length:', process.env.NEXT_PUBLIC_SUPABASE_URL?.length);
    console.log('Key Value Length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length);

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase credentials');
        console.error('URL:', supabaseUrl);
        console.error('Key:', !!supabaseKey);
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const DATA_DIR = path.join(process.cwd(), 'data');

    await migrate(supabase, DATA_DIR);
}

async function readJson(filename: string, DATA_DIR: string) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        console.warn(`Could not read ${filename}:`, error);
        return null;
    }
}

async function migrate(supabase: any, DATA_DIR: string) {
    console.log('Starting migration...');

    // 1. Migrate Users (Required for Foreign Keys)
    const usersData = await readJson('users.json', DATA_DIR);
    if (usersData && usersData.users) {
        console.log(`Migrating ${usersData.users.length} users...`);
        for (const user of usersData.users) {
            // We only need ID and Email for FKs. Password can be dummy or omitted if nullable (it's not nullable in schema, so use dummy).
            // Actually, schema says password text not null.
            // We will use the existing hash or a placeholder since auth is local.
            const { error } = await supabase.from('users').upsert({
                id: user.id,
                email: user.email,
                password: user.password || 'local_auth_placeholder',
                role: user.role,
                balance: user.balance,
                authentication_status: user.authenticationStatus,
                authenticated_at: user.authenticatedAt
            }, { onConflict: 'id' });

            if (error) console.error(`Error migrating user ${user.email}:`, error.message);
        }
    }

    // 2. Migrate Transactions
    const transactionsData = await readJson('transactions.json', DATA_DIR);
    if (transactionsData && transactionsData.transactions) {
        console.log(`Migrating ${transactionsData.transactions.length} transactions...`);
        for (const tx of transactionsData.transactions) {
            const { error } = await supabase.from('transactions').upsert({
                id: tx.id,
                user_id: tx.userId,
                amount: tx.amount,
                type: tx.type,
                details: tx.details,
                timestamp: tx.timestamp
            }, { onConflict: 'id' });

            if (error) console.error(`Error migrating transaction ${tx.id}:`, error.message);
        }
    }

    // 3. Migrate Vouchers
    const vouchersData = await readJson('vouchers.json', DATA_DIR);
    if (vouchersData && vouchersData.vouchers) {
        console.log(`Migrating ${vouchersData.vouchers.length} vouchers...`);
        for (const v of vouchersData.vouchers) {
            const { error } = await supabase.from('vouchers').upsert({
                id: v.id,
                user_id: v.userId,
                amount: v.amount,
                reason: v.reason,
                code: v.code,
                status: v.status,
                scratched_at: v.scratchedAt,
                redeemed_at: v.redeemedAt,
                created_at: v.createdAt,
                created_by: v.createdBy
            }, { onConflict: 'id' });

            if (error) console.error(`Error migrating voucher ${v.id}:`, error.message);
        }
    }

    // 4. Migrate Settings
    const settingsData = await readJson('settings.json', DATA_DIR);
    if (settingsData) {
        console.log('Migrating settings...');
        // settings.json structure might be key-value or array.
        // Based on lib/db.ts: getSetting reads from 'app_settings' table.
        // Let's assume settings.json is a simple object.
        for (const [key, value] of Object.entries(settingsData)) {
            const { error } = await supabase.from('app_settings').upsert({
                key,
                value
            }, { onConflict: 'key' });
            if (error) console.error(`Error migrating setting ${key}:`, error.message);
        }
    }

    console.log('Migration complete.');
}

main();
