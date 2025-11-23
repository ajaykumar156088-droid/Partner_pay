const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please check .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Default admin credentials
const adminEmail = 'admin@partnerpay.com';
const adminPassword = 'admin123'; // Change this to your desired password

async function setupAdmin() {
  try {
    // Generate password hash
    const passwordHash = bcrypt.hashSync(adminPassword, 10);

    // Upsert admin user
    const { error } = await supabase.from('users').upsert({
      id: 'admin-001',
      email: adminEmail,
      password: passwordHash,
      role: 'admin',
      balance: 0,
      authentication_status: 'authenticated',
      authenticated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    if (error) {
      console.error('Error creating/updating admin user:', error.message);
      return;
    }

    console.log('\n✅ Admin user setup complete!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('\n⚠️  Please change the default password after first login!');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

setupAdmin();







