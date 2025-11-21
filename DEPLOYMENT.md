# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub/GitLab/Bitbucket Account**: Your code should be in a Git repository
3. **Firebase Project**: Already set up
4. **EmailJS Account**: Already set up

## Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure your code is committed and pushed to your Git repository (GitHub, GitLab, or Bitbucket).

### 2. Environment Variables

You need to add all environment variables in Vercel:

#### In Vercel Dashboard:
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add the following variables:

**Firebase Variables:**
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID` (optional)

**EmailJS Variables:**
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

**Important:** 
- Make sure to add these for **Production**, **Preview**, and **Development** environments
- After adding variables, you'll need to redeploy

### 3. Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your Git repository
4. Vercel will auto-detect it's a Vite project
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `Sarilaya` (if your project is in a subfolder)
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `dist` (should auto-detect)
6. Add all environment variables (see step 2)
7. Click **"Deploy"**

#### Option B: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to your project
cd Sarilaya

# Deploy
vercel

# For production
vercel --prod
```

### 4. Firebase Configuration

Make sure your Firebase project allows your Vercel domain:

1. Go to Firebase Console → Authentication → Settings → Authorized domains
2. Add your Vercel domain (e.g., `your-project.vercel.app`)
3. If you have a custom domain, add that too

### 5. Post-Deployment Checklist

- [ ] Test the deployed site
- [ ] Verify Firebase authentication works
- [ ] Test contact form submission
- [ ] Check that images load correctly
- [ ] Verify admin panel access
- [ ] Test on mobile devices

### 6. Custom Domain (Optional)

1. In Vercel dashboard, go to your project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Firebase authorized domains with your custom domain

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify `package.json` has correct build script
- Check Vercel build logs for specific errors

### Environment Variables Not Working
- Make sure variables start with `VITE_` prefix
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

### Firebase Errors
- Verify Firebase config variables are correct
- Check Firebase authorized domains include Vercel domain
- Ensure Firebase rules allow public read access where needed

### Routing Issues
- The `vercel.json` includes rewrites for SPA routing
- All routes should redirect to `index.html`

## Project Structure

```
Sarilaya/
├── dist/              # Build output (generated)
├── public/            # Static assets
├── src/               # Source code
├── index.html         # Entry point
├── package.json       # Dependencies
├── vite.config.js     # Vite configuration
└── vercel.json        # Vercel configuration
```

## Build Configuration

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: Vercel auto-detects (or specify in `package.json`)

## Support

If you encounter issues:
1. Check Vercel build logs
2. Verify all environment variables
3. Test locally with `npm run build && npm run preview`
4. Check Firebase console for errors

