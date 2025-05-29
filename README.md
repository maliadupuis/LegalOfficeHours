# Legal Office Hours Website

A professional website showcasing legal support provided during hack days, with automatic updates from Google Sheets.

## 🚀 Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Auto-Updates**: Automatically syncs with Google Sheets when new projects are added
- **Professional Layout**: Clean, modern design with hover effects
- **Real Project Data**: Showcases actual legal consultations and advice

## 🔄 Auto-Update System

The website automatically updates when new projects are added to the Google Sheet:

### How It Works:
1. **Google Sheets Integration**: Pulls data from your published CSV
2. **GitHub Actions**: Runs every hour to check for updates
3. **Automatic Deployment**: Updates the website and deploys to GitHub Pages

### Setup Instructions:

1. **Enable GitHub Actions** (if not already enabled):
   - Go to your repository settings
   - Navigate to "Actions" → "General"
   - Ensure "Allow all actions and reusable workflows" is selected

2. **The system is ready!** It will:
   - Check for updates every hour
   - Automatically commit changes when new projects are detected
   - Deploy to GitHub Pages within minutes

### Manual Update:
You can also trigger an update manually:
- Go to "Actions" tab in your GitHub repository
- Click "Update Projects from Google Sheets"
- Click "Run workflow"

## 📊 Google Sheets Format

Your spreadsheet should have these columns:
- **Column A**: Hacker Name
- **Column B**: Hack Days Project Link
- **Column C**: Legal Advice Provided / Notes  
- **Column D**: Lawyer who provided Advice

## 🛠️ Local Development

To test the update script locally:

```bash
# Install dependencies
npm install

# Run the update script
npm run update
```

## 📁 File Structure

```
├── index.html              # Main website file
├── styles.css              # Website styling
├── update-projects.js      # Auto-update script
├── package.json           # Node.js dependencies
├── .github/workflows/     # GitHub Actions automation
└── README.md             # This file
```

## 🎨 Customization

To modify the design:
- Edit `styles.css` for styling changes
- Edit `index.html` for content changes
- The projects section is auto-generated - don't edit it manually

## 📈 Adding New Projects

Simply add a new row to your Google Sheet with:
1. Hacker name
2. Project link (or "n/a" if none)
3. Legal advice description
4. Lawyer name(s)

The website will automatically update within an hour!

## 🔧 Troubleshooting

If auto-updates aren't working:
1. Check the "Actions" tab for error logs
2. Ensure your Google Sheet is published to web as CSV
3. Verify the CSV URL in `update-projects.js` is correct

---

**Legal Office Hours** - Professional legal support for modern businesses. 