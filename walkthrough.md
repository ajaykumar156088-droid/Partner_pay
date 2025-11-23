# Supabase Migration Walkthrough

I have successfully modified your project to use Supabase as the database backend, replacing the local JSON file storage.

## Changes Made
1.  **Dependencies**: Installed `@supabase/supabase-js`, `dotenv`, and `ts-node`.
2.  **Database Layer**: Refactored `lib/db.ts` to use Supabase client for all data operations.
3.  **API Routes**: Updated all API routes to use the new database functions.
4.  **Schema**: Created `supabase_schema.sql` in the project root.
5.  **Migration Script**: Created `scripts/migrate-to-supabase.ts` to help you move your existing data.

## Action Required

### 1. Setup Database Tables
1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Open the **SQL Editor**.
3.  Copy the contents of [supabase_schema.sql](file:///Users/ajay/Desktop/Partner_Pay_V_2/supabase_schema.sql).
4.  Paste it into the SQL Editor and click **Run**.

### 2. Configure Environment Variables
1.  Open `.env.local`.
2.  Add your Supabase credentials (you can find these in Project Settings > API):
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    ```

### 3. Migrate Existing Data (Optional)
If you want to keep your current users and transactions:
1.  Run the migration script:
    ```bash
    npx ts-node scripts/migrate-to-supabase.ts
    ```

### 4. Start the App
```bash
npm run dev
```

## Verification
- **Login**: Try logging in with an existing user (after migration) or a new user.
- **Admin Panel**: Check if users and transactions are visible in the admin panel.
- **Transactions**: Try performing a transaction (e.g., scratch a voucher).
