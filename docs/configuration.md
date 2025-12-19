# Configuration

The platform uses a `config/family-config.json` file to configure your site.

## Configuration File Location

Place your configuration file at: `config/family-config.json`

When the platform runs as a submodule, it will automatically load this file from `../../config/family-config.json`.

## Configuration Options

### Basic Settings

```json
{
  "familyName": "Your Family Name",
  "pageTitleSuffix": " | Family History",
  "baseUrl": "yourusername.github.io/your-repo",
  "locale": "en-US"
}
```

- **familyName**: The title displayed on your site
- **pageTitleSuffix**: Suffix added to page titles
- **baseUrl**: Your site's URL (required for GitHub Pages)
- **locale**: Language/locale code (e.g., "en-US", "he-IL")

### Theme Configuration

```json
{
  "theme": {
    "colors": {
      "secondary": "#284b63",
      "tertiary": "#84a59d",
      "light": "#faf8f8",
      "lightgray": "#e5e5e5",
      "gray": "#b8b8b8",
      "darkgray": "#4e4e4e",
      "dark": "#2b2b2b"
    },
    "typography": {
      "header": "Schibsted Grotesk",
      "body": "Source Sans Pro",
      "code": "Roboto Mono"
    }
  }
}
```

### Analytics

```json
{
  "analytics": {
    "provider": "plausible"
  }
}
```

Supported providers:
- `plausible`
- `google` (Google Analytics)
- `umami`
- `goatcounter`

### Place Mappings

Map place names from your GEDCOM to Wikipedia articles:

```json
{
  "place_mappings": {
    "New York, USA": "New_York_City",
    "London, England": "London",
    "Perth, Australia": "Perth,_Western_Australia"
  }
}
```

## Complete Example

```json
{
  "familyName": "Smith Family History",
  "pageTitleSuffix": " | Family",
  "baseUrl": "smithfamily.github.io/history",
  "locale": "en-US",
  "analytics": {
    "provider": "plausible"
  },
  "theme": {
    "colors": {
      "secondary": "#2c5f2d",
      "tertiary": "#97bc62"
    },
    "typography": {
      "header": "Inter",
      "body": "Inter",
      "code": "Fira Code"
    }
  },
  "place_mappings": {
    "Boston, MA, USA": "Boston",
    "Dublin, Ireland": "Dublin"
  }
}
```

## Environment Variables

You can also use environment variables to override configuration:

- `FAMILY_NAME`: Override family name
- `BASE_URL`: Override base URL (useful for CI/CD)

Example:
```bash
export BASE_URL="mysite.com"
python platform/scripts/doit.py data/tree.ged
```

## Default Values

If no configuration file is found, the platform uses these defaults:

- Family Name: "Family History"
- Page Title Suffix: " | Family"
- Locale: "en-US"
- Theme: Blue/teal color scheme
- Fonts: Schibsted Grotesk, Source Sans Pro, Roboto Mono

