
## Deployment

### GitHub
1. Initialize a git repository if you haven't already:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   \`\`\`
2. Create a new repository on GitHub.
3. Link your local repository to GitHub:
   \`\`\`bash
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
   git branch -M main
   git push -u origin main
   \`\`\`

### Render
1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Render will automatically detect the `render.yaml` file (if you choose "Blueprints") or you can manually configure:
   - **Runtime**: Docker
   - **Build Command**: `npm ci --legacy-peer-deps && npm run build`
   - **Start Command**: `npm run start`
4. Add the following Environment Variables in the Render dashboard:
   - `JWT_SECRET`: A secure random string.
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
   - `NODE_ENV`: `production`

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory.
3. Follow the prompts to deploy.
4. Alternatively, import your GitHub repository directly in the Vercel dashboard.
5. Add the following environment variables in the Vercel project settings:
   - `JWT_SECRET`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
