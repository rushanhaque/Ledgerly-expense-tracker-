# 🚀 Deployment Guide - Ledgerly

## Deploy to Vercel (Recommended)

### Method 1: Using Vercel CLI

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Production Deployment**
```bash
vercel --prod
```

### Method 2: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository: `https://github.com/rushanhaque/Ledgerly-expense-tracker-.git`
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click "Deploy"

### Method 3: GitHub Integration (Auto-Deploy)

1. Connect your GitHub account to Vercel
2. Import the repository
3. Every push to `main` branch will auto-deploy

---

## Environment Setup

### No Environment Variables Required
This app runs entirely client-side with no backend dependencies.

---

## Build Optimization

### Already Configured:
- ✅ Vite production build optimization
- ✅ Code splitting
- ✅ Asset minification
- ✅ Tree shaking
- ✅ Lazy loading for modals

### Build Command
```bash
npm run build
```

Output will be in `/dist` directory.

---

## Custom Domain (Optional)

### In Vercel Dashboard:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate auto-configured

---

## Post-Deployment Checklist

- [ ] Test all features (add expense, budgets, goals)
- [ ] Verify receipt scanning works
- [ ] Check theme toggle (light/dark)
- [ ] Test data export (PDF, Excel, Text)
- [ ] Verify localStorage persistence
- [ ] Test on mobile devices
- [ ] Check all navigation tabs
- [ ] Verify footer links work

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Routes Not Working
- Ensure `vercel.json` has proper rewrites configuration
- Already configured in project ✅

### Slow Performance
- Images are optimized ✅
- Code splitting enabled ✅
- Lazy loading implemented ✅

---

## Monitoring

### Vercel Analytics (Free)
Add to `vercel.json`:
```json
{
  "analytics": {
    "enabled": true
  }
}
```

---

## Support

For issues, contact:
- Email: rushanulhaque@gmail.com
- GitHub: https://github.com/rushanhaque

---

**Deployment Time**: ~2 minutes  
**Build Time**: ~30 seconds  
**Zero Configuration Required** ✅
