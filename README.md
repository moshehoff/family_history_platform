# Family History Platform

A complete, open-source platform for building beautiful family history websites from GEDCOM files. Generate a modern, searchable website with biographies, photo galleries, and interactive family trees.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Node 22+](https://img.shields.io/badge/node-22+-green.svg)](https://nodejs.org/)

## ✨ Features

- 📊 **GEDCOM Parser** - Convert standard GEDCOM files to a beautiful website
- 👥 **Profile Pages** - Auto-generated profile for every family member
- 🖼️ **Photo Galleries** - Organize family photos by person
- 📖 **Biography Chapters** - Multi-chapter biographies with internal navigation
- 🔍 **Full-Text Search** - Search across all profiles and content
- 🌳 **Family Diagrams** - Interactive Mermaid diagrams (immediate family, ancestors, nuclear family)
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🚀 **GitHub Pages Ready** - Deploy for free to GitHub Pages
- 🎨 **Customizable** - Configure colors, fonts, and layout
- 🔒 **Privacy Support** - Mark individuals as private
- 🌐 **Multi-language** - Built-in RTL support for Hebrew and other languages

## 🚀 Quick Start

### Prerequisites

- Python 3.11 or higher
- Node.js 22 or higher
- Git
- A GEDCOM file from your genealogy software

### Installation

1. **Create a new repository for your family**:
```bash
mkdir my-family-history
cd my-family-history
git init
```

2. **Add this platform as a submodule**:
```bash
git submodule add https://github.com/moshehoff/family_history_platform.git platform
```

3. **Create your data structure**:
```bash
mkdir -p data bios documents content config
```

4. **Add your GEDCOM file**:
```bash
cp /path/to/your/family.ged data/tree.ged
```

5. **Configure your site** (create `config/family-config.json`):
```json
{
  "familyName": "Your Family Name",
  "baseUrl": "yourusername.github.io/your-repo",
  "locale": "en-US",
  "theme": {
    "colors": {
      "secondary": "#284b63",
      "tertiary": "#84a59d"
    }
  }
}
```

6. **Build your site**:
```bash
# Generate profiles
python platform/scripts/doit.py data/tree.ged

# Install Node dependencies
cd platform/site
npm install

# Build site
npx quartz build
```

7. **Preview locally**:
```bash
npx quartz serve
# Open http://localhost:8080
```

## 🎯 Project Structure

```
your-family-history/              # Your private repository
├── platform/                     # This platform (submodule)
├── data/
│   └── tree.ged                  # Your GEDCOM file
├── bios/                         # Biography chapters (optional)
│   └── I12345/                   # Organized by person ID
│       ├── 01-early-life.md
│       └── 02-career.md
├── documents/                    # Photos and documents (optional)
│   └── I12345/
│       ├── photo1.jpg
│       └── photo1.md             # Caption
├── content/                      # Static pages (optional)
│   ├── index.md                  # Home page
│   └── pages/
│       ├── about.md
│       └── preface.md
└── config/
    └── family-config.json        # Your configuration
```

## 📖 Documentation

- [Getting Started Guide](docs/getting-started.md)
- [Configuration Options](docs/configuration.md)
- [Adding Biographies](docs/adding-biographies.md)
- [Deployment to GitHub Pages](docs/deployment.md)

## 🚢 Deployment

### GitHub Pages (Free)

See the [example workflow](examples/.github/workflows/deploy.yml) for automated deployment.

1. Copy the workflow to your repository
2. Enable GitHub Pages in Settings → Pages → Source: GitHub Actions
3. Push to trigger deployment

Your site will be live at `https://yourusername.github.io/your-repo/`

## 🔄 Updating the Platform

To get the latest features and bug fixes:

```bash
cd platform
git pull origin main
cd ..
git add platform
git commit -m "Update platform to latest version"
git push
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

This means you can:
- ✅ Use it for any family (commercial or personal)
- ✅ Modify it to your needs
- ✅ Distribute it
- ✅ Keep your family data private

## 🆘 Support

- [Issues](https://github.com/moshehoff/family_history_platform/issues) - Report bugs or request features
- [Discussions](https://github.com/moshehoff/family_history_platform/discussions) - Ask questions or share ideas

## 📊 Technical Details

**Built with:**
- Python 3.11+ (GEDCOM processing)
- Quartz 4.x (Static site generator)
- TypeScript/React (UI components)
- Mermaid (Family diagrams)
- GitHub Actions (CI/CD)

**Generated output:**
- Static HTML/CSS/JS
- No server required
- Fast, secure, and free to host

---

Made with ❤️ for families preserving their history

