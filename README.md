# Partner Pay Platform

A complete web application for managing partner payments with admin and user dashboards, built with Next.js, TypeScript, and TailwindCSS.

## Features

### Authentication
- Login-only authentication (no signup page)
````markdown
# Partner Pay Platform

A complete web application for managing partner payments with admin and user dashboards, built with Next.js, TypeScript, and TailwindCSS.

## Features

### Authentication
- Login-only authentication (no signup page)
- Only admins can create new users
- Multi-device login support (sessions don't destroy each other)
- JWT-based session management

### Admin Features
- **Dashboard**: View system statistics (total balance, users, admins, regular users)
- **User Management**: 
  - Create new users
  - View all users
  - Edit user information (email, password)
  - Delete users
  - Add/deduct balance from any user
  - View individual user transaction history
- **Transactions**: View all system transactions
- **Balance Management**: Add or deduct balance from any user account

### User Features
- **Dashboard**: View wallet balance and transaction history
- **Withdraw Funds**:
  - **UPI Withdrawal**: 
    - Minimum limit: ₹2,500
    - Always shows "Account related issue found. Please contact administration for further assistance."
  - **USDT Withdrawal**:
    - Minimum limit: ₹500
    - Always shows "Invalid USDT address."

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Authentication**: JWT (using `jose` library for Edge compatibility)
- **Password Hashing**: bcryptjs
- **Database**: JSON files in `/data` folder
- **Validation**: Zod

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── admin/         # Admin-only endpoints
│   │   └── user/          # User endpoints
│   ├── admin/             # Admin pages
│   │   ├── dashboard/
│   │   ├── users/
│   │   └── transactions/
│   ├── dashboard/         # User dashboard
│   ├── withdraw/          # Withdraw page
│   └── login/             # Login page
├── data/                  # JSON database files
│   ├── users.json
│   └── transactions.json
├── lib/                   # Utility functions
│   ├── auth.ts            # Authentication utilities
│   └── db.ts              # Database utilities
└── middleware.ts          # Route protection
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Create .env.local file
touch .env.local
```

Add the following content to `.env.local`:

```
JWT_SECRET=your-secret-key-change-this-in-production
```

**Important**: 
- Use a strong, random secret in production!
- Generate a secure random string (e.g., using `openssl rand -base64 32`)
- Never commit `.env.local` to version control (it's already in `.gitignore`)

### 3. Initialize Default Admin User

Run the setup script to create/update the default admin user:

```bash
npm run setup
```

This will create an admin user with:
- **Email**: `admin@partnerpay.com`
- **Password**: `admin123`

**Important**: Change the default password after first login!

To customize the admin credentials, edit `scripts/setup-admin.js` before running the setup script.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

## Default Admin Credentials

**Note**: The default password hash in `data/users.json` is a placeholder. You need to:

1. Generate a proper bcrypt hash for your desired password
2. Replace the password field in `data/users.json`

Or use the application to create a new admin user after logging in with the first admin.

## Database Structure

### users.json
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "password": "bcrypt-hash",
      "role": "admin" | "user",
      "balance": 0
    }
  ]
}
```

### transactions.json
```json
{
  "transactions": [
    {
      "id": "uuid",
      "userId": "uuid",
      "amount": 100,
      "type": "admin_add" | "admin_deduct" | "withdraw_attempt",
      "details": "string",
      "timestamp": "ISO-8601"
    }
  ]
}
```

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Add environment variable:
   - `JWT_SECRET`: Your secret key
4. Deploy

### Important Notes for Vercel

- The JSON database files in `/data` are stored in the repository
- File-based database works on Vercel, but note that:
  - Changes persist only during the deployment lifecycle
  - For production, consider using a proper database (PostgreSQL, MongoDB, etc.)
  - The current implementation is suitable for development and small-scale deployments

## Deployment to Render (Docker)

If you want to deploy to Render using Docker (recommended for keeping file-based data accessible in the container during runtime), follow these steps:

1. Push your repository to GitHub.

2. In the Render dashboard, create a new Web Service and connect your GitHub repo.

3. Choose "Docker" as the environment and set the branch to `main` (or your preferred branch).

4. Use the provided `Dockerfile` (already included at the project root). Render will run the buildCommand and use the Dockerfile to build the image.

5. Set environment variables in Render service settings:
   - `JWT_SECRET` — required by the app
   - Any other secrets your app needs (leave `NODE_ENV=production`)

6. Start the service. Render will expose your service on a public URL and set the container `PORT` environment variable — the start script in `package.json` respects `$PORT`.

Notes and caveats:
- This project uses a simple file-based JSON database kept in `/data`. In containerized deployments, any runtime writes will persist only for the lifetime of that container. For durable storage, use an external DB.
- The Dockerfile uses the Next.js `standalone` output for a smaller runtime image.

## Quick checklist before deploying

- [ ] Commit and push all changes to GitHub.
- [ ] Add `JWT_SECRET` to Vercel or Render environment variables.
- [ ] For Render: review `render.yaml` template and update the `repo` field if you want to use it for automated service creation.

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Admin (requires admin role)
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create new user
- `GET /api/admin/users/[id]` - Get user details
- `PATCH /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user
- `POST /api/admin/balance` - Add/deduct balance
- `GET /api/admin/transactions` - Get all transactions
- `GET /api/admin/stats` - Get system statistics

### User
- `GET /api/user/transactions` - Get user's transactions
- `POST /api/user/withdraw` - Attempt withdrawal (always returns error as per requirements)

## Security Notes

1. **JWT Secret**: Always use a strong, random secret in production
2. **Password Hashing**: Passwords are hashed using bcrypt with 10 rounds
3. **Session Management**: Sessions are stored in HTTP-only cookies
4. **Route Protection**: Middleware protects all routes except `/login`
5. **Role-Based Access**: Admin routes are protected by role checking

## Development

### File-Based Database

The application uses a simple file-based JSON database with:
- Automatic backups before writes
- Simple file locking to prevent write collisions
- Located in `/data` directory

### Multi-Device Login

The application supports multiple devices logged in simultaneously. Each device maintains its own session cookie, and sessions don't invalidate each other.

## License

This project is provided as-is for development and educational purposes.

## Support

For issues or questions, please check the code comments or create an issue in the repository.

## Deploying to Render.com

Quick steps to deploy this repo to Render using GitHub:

1. Push the repo to GitHub (if not already):

  - Create a repository on GitHub and push the current branch.

2. Create a new Web Service on Render:

  - Connect your GitHub account and select this repository.
  - For Environment, choose: Node
  - Build Command: `npm install && npm run build`
  - Start Command: `npm start`
  - Set the Environment Variable `JWT_SECRET` in Render's dashboard (or let `render.yaml` generate one).

3. Recommended service settings:

  - Node version: 18 (this repo includes `.nvmrc` and `engines` in `package.json`)
  - Automatic deploys from the `main` branch
  - Persistent filesystem is NOT available: any changes to files in `/data` during runtime will not persist across deploys. For production use a proper DB.

4. After the first deploy, verify the site and test login flow. Use the `npm run setup` script locally to initialize the admin user if needed.

Note: I added `render.yaml`, `.nvmrc`, and `.dockerignore` to help Render and container-based deployments. Do not change application logic or UI in this change.

