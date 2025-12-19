# Getting Started

This guide will help you set up your family history website using this platform.

## Prerequisites

- Python 3.11 or higher
- Node.js 22 or higher
- Git
- A GEDCOM file exported from your genealogy software (e.g., MyHeritage, Ancestry, Family Tree Maker)

## Step 1: Create Your Family Repository

```bash
# Create a new directory for your family
mkdir my-family-history
cd my-family-history

# Initialize git
git init
```

## Step 2: Add Platform as Submodule

```bash
git submodule add https://github.com/moshehoff/family_history_platform.git platform
```

## Step 3: Create Data Structure

```bash
# Create required directories
mkdir -p data bios documents content config
```

## Step 4: Add Your GEDCOM File

Export your GEDCOM file from your genealogy software and place it in the `data/` directory:

```bash
cp /path/to/your/family.ged data/tree.ged
```

## Step 5: Configure Your Site

Create `config/family-config.json`:

```json
{
  "familyName": "Smith Family History",
  "pageTitleSuffix": " | Family",
  "baseUrl": "yourusername.github.io/your-repo",
  "locale": "en-US",
  "analytics": {
    "provider": "plausible"
  },
  "theme": {
    "colors": {
      "secondary": "#284b63",
      "tertiary": "#84a59d"
    },
    "typography": {
      "header": "Schibsted Grotesk",
      "body": "Source Sans Pro",
      "code": "Roboto Mono"
    }
  },
  "place_mappings": {
    "New York, USA": "New_York_City",
    "London, England": "London"
  }
}
```

## Step 6: Generate Your Site

```bash
# Install Python dependencies
pip install gedcom

# Generate profiles from GEDCOM
python platform/scripts/doit.py data/tree.ged

# Install Node dependencies
cd platform/site
npm install

# Build the site
npx quartz build
```

## Step 7: Preview Locally

```bash
npx quartz serve
```

Open http://localhost:8080 in your browser to see your site!

## Step 8: Deploy to GitHub Pages

See [Deployment Guide](deployment.md) for instructions on deploying to GitHub Pages.

## Optional: Add Biographies

You can add extended biographies for family members. See [Adding Biographies](adding-biographies.md) for details.

## Optional: Add Photos and Documents

You can add photos and documents for family members. See [Photo Management](photo-management.md) for details.

## Next Steps

- [Configuration Options](configuration.md) - Customize your site
- [Adding Biographies](adding-biographies.md) - Write extended biographies
- [Deployment](deployment.md) - Deploy to GitHub Pages
- [Customization](customization.md) - Advanced customization

