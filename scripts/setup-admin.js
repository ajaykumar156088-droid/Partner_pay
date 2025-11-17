const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Default admin credentials
const adminEmail = 'admin@partnerpay.com';
const adminPassword = 'admin123'; // Change this to your desired password

// Generate password hash
const passwordHash = bcrypt.hashSync(adminPassword, 10);

// Read existing users.json
const dataDir = path.join(__dirname, '..', 'data');
const usersFile = path.join(dataDir, 'users.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let usersData = { users: [] };

if (fs.existsSync(usersFile)) {
  const existingData = fs.readFileSync(usersFile, 'utf-8');
  usersData = JSON.parse(existingData);
}

// Check if admin already exists
const adminExists = usersData.users.find(u => u.email === adminEmail);

if (adminExists) {
  // Update existing admin password
  adminExists.password = passwordHash;
  console.log('Updated admin password');
} else {
  // Create new admin user
  usersData.users.push({
    id: 'admin-001',
    email: adminEmail,
    password: passwordHash,
    role: 'admin',
    balance: 0,
  });
  console.log('Created admin user');
}

// Write back to file
fs.writeFileSync(usersFile, JSON.stringify(usersData, null, 2), 'utf-8');

console.log('\n✅ Admin user setup complete!');
console.log(`Email: ${adminEmail}`);
console.log(`Password: ${adminPassword}`);
console.log('\n⚠️  Please change the default password after first login!');







