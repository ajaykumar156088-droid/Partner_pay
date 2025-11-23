# Partner Pay Supabase Migration Guide

This guide details the steps required to migrate the Partner Pay application from using local JSON files for user storage to using Supabase as the single source of truth.

## Prerequisites

1.  **Supabase Project**: You must have a Supabase project set up.
2.  **Database Schema**: Ensure your Supabase database has the required tables (`users`, `transactions`, `vouchers`, etc.).

## Step 1: Configure Environment Variables

The application and migration script require Supabase credentials.

1.  Open or create `.env.local` in the root directory.
2.  Add your Supabase URL and Anonymous Key:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note**: You can find these credentials in your Supabase Dashboard under Project Settings -> API.

## Step 2: Run Data Migration

We have created a script to migrate existing users from `data/users.json` to Supabase.

1.  Open your terminal in the project root.
2.  Run the migration script:

```bash
node scripts/migrate-users.js
```

3.  **Verify Output**: The script will log each migrated user. Ensure it completes without errors.

## Step 3: Verify Application

Once the migration is complete and the code is updated (which we have done), the application will read/write directly to Supabase.

1.  **Restart Server**: If your development server is running, restart it (`npm run dev`).
2.  **Login**: Try logging in with an existing user account.
3.  **Check Data**: Verify that your balance and transaction history are correct.

## Troubleshooting

- **Missing Credentials**: If the script fails with "Missing Supabase environment variables", ensure `.env.local` is correctly formatted and saved.
- **Connection Error**: If the script hangs or fails to connect, check your internet connection and ensure the Supabase URL is correct.
