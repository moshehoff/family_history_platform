# Deployment to GitHub Pages

This guide shows you how to deploy your family history site to GitHub Pages for free hosting.

## Prerequisites

- Your family repository on GitHub
- GitHub Actions enabled
- Public repository (required for free GitHub Pages)

## Step 1: Copy the Workflow File

Copy the example workflow to your repository:

```bash
# From your family repository root
mkdir -p .github/workflows
cp platform/examples/.github/workflows/deploy.yml .github/workflows/
```

## Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings**
3. Click **Pages** (in the left sidebar)
4. Under **Source**, select **GitHub Actions**

## Step 3: Push to Trigger Deployment

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Pages deployment"
git push origin main
```

GitHub Actions will automatically:
- Generate profiles from your GEDCOM
- Build the Quartz site
- Deploy to GitHub Pages

## Step 4: Access Your Site

Your site will be available at:

```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

For example:
- Repository: `smithfamily/history`
- URL: `https://smithfamily.github.io/history/`

## Monitoring Deployment

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. You'll see your deployment workflow running
4. Click on it to see detailed logs

## Updating Your Site

Every time you push changes to your repository, GitHub Actions will automatically rebuild and redeploy your site.

```bash
# Make changes to data, bios, or content
git add .
git commit -m "Update family data"
git push origin main

# Site will automatically rebuild and deploy!
```

## Custom Domain (Optional)

If you want to use a custom domain (e.g., `smithfamily.com`):

1. Purchase a domain from a registrar (e.g., Namecheap, Google Domains)
2. Add a `CNAME` file to your repository root:
```bash
echo "smithfamily.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push
```
3. Configure DNS at your registrar:
   - Add a CNAME record pointing to `YOUR-USERNAME.github.io`
4. In GitHub Settings → Pages, enter your custom domain

## Troubleshooting

### Deployment Failed

Check the Actions tab for error messages. Common issues:

- **Python dependencies**: Make sure `gedcom` package is installed
- **Node version**: Ensure Node.js 22+ is used
- **Submodule**: Make sure platform submodule is properly initialized

### Site Not Updating

- Clear your browser cache (Ctrl+F5)
- Check that GitHub Actions completed successfully
- Verify GitHub Pages is enabled

### 404 Errors on Links

Make sure your `baseUrl` in `config/family-config.json` matches your actual GitHub Pages URL.

## Performance

GitHub Pages is fast and uses a global CDN. Your site will load quickly worldwide.

### Limitations

- 1GB repository size limit
- 100GB bandwidth/month (soft limit)
- Public repositories only for free tier

These limits are more than sufficient for most family history sites.

