# Deploying to Vercel via Website UI

## Quick Deployment Steps

### 1. Push Your Code to GitHub/GitLab/Bitbucket
Make sure your code is committed and pushed to your repository.

### 2. Go to Vercel Dashboard
1. Visit [vercel.com](https://vercel.com)
2. Sign in (or create an account)
3. Click **"Add New Project"** or **"New Project"**

### 3. Import Your Repository
1. Connect your Git provider (GitHub/GitLab/Bitbucket) if not already connected
2. Find and select your repository
3. Click **"Import"**

### 4. Configure Project Settings

Vercel should auto-detect your Vite project, but verify these settings:

- **Framework Preset**: `Vite` (should auto-detect)
- **Root Directory**: 
  - If your project is in the root: leave empty or set to `./`
  - If your project is in `Sarilaya` folder: set to `Sarilaya`
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### 5. Add Environment Variables

**IMPORTANT:** Add all these before deploying!

Click **"Environment Variables"** and add:

#### Firebase Variables:
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

#### EmailJS Variables:
```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

**For each variable:**
- Add it for **Production**, **Preview**, and **Development** environments
- Click **"Add"** after each one

### 6. Deploy!

1. Click **"Deploy"** button
2. Wait for the build to complete (usually 1-3 minutes)
3. Your site will be live at `your-project.vercel.app`

### 7. Post-Deployment Setup

#### Update Firebase Authorized Domains:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your Vercel domain: `your-project.vercel.app`
5. If you add a custom domain later, add that too

### 8. Test Your Deployment

Check these:
- ✅ Homepage loads
- ✅ Firebase authentication works (login/register)
- ✅ Contact form submits
- ✅ Images load correctly
- ✅ Admin panel accessible
- ✅ All pages route correctly

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Make sure `package.json` has correct scripts

### Environment Variables Not Working
- Variables must start with `VITE_` prefix
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

### Routing Issues (404 on refresh)
- The `vercel.json` file handles this automatically
- All routes redirect to `index.html` for SPA routing

### Firebase Errors
- Verify Firebase config variables are correct
- Check authorized domains include your Vercel domain
- Ensure Firebase security rules allow necessary access

## Custom Domain (Optional)

1. In Vercel dashboard → Your Project → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Update Firebase authorized domains with your custom domain

## That's It! 🎉

Your site should now be live on Vercel!

