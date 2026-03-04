# Leadership Board - Voting App

A simple voting app for the Advent International Portfolio Support Group. Each team member votes for their top 3 colleagues (ranked 1st, 2nd, 3rd). Only the admin can see results.

## Architecture

```
Voter Browser  --POST-->  Google Apps Script  -->  Google Sheet
Admin Browser  --GET--->  Google Apps Script  <--  Google Sheet
```

- **Frontend**: Static HTML files hosted on GitHub Pages
- **Backend**: Google Apps Script (free serverless functions)
- **Database**: Google Sheets

## Setup Instructions

### 1. Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it "Leadership Board Votes"
3. Rename the first sheet tab to **Votes**
4. Add these headers in row 1: `Voter | 1st Choice | 2nd Choice | 3rd Choice | Timestamp`

### 2. Set Up Google Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code in `Code.gs`
3. Copy the contents of `google-apps-script/Code.gs` and paste it in
4. Set the admin secret:
   - In the Apps Script editor, click **Project Settings** (gear icon)
   - Scroll to **Script Properties** and click **Add script property**
   - Set Property: `ADMIN_SECRET`, Value: a secret key of your choice (e.g., `mySecretKey123`)
   - Click **Save**
5. Deploy:
   - Click **Deploy > New deployment**
   - Click the gear icon next to "Select type" and choose **Web app**
   - Set "Execute as" to **Me**
   - Set "Who has access" to **Anyone**
   - Click **Deploy**
   - Authorize the app when prompted
   - **Copy the Web App URL** - you'll need it next

### 3. Update the API URL

Open both `index.html` and `admin.html` and find this line near the top of the `<script>` section:

```javascript
var API_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL';
```

Replace `YOUR_APPS_SCRIPT_WEB_APP_URL` with the URL you copied from step 2.

### 4. Deploy to GitHub Pages

1. Create a new GitHub repository
2. Push all files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/leadership-board.git
   git push -u origin main
   ```
3. Go to **Settings > Pages** in your GitHub repo
4. Set Source to **Deploy from a branch**, select **main** branch, root folder
5. Click **Save**
6. Your site will be live at `https://YOUR_USERNAME.github.io/leadership-board/`

### 5. Share the Links

- **Voting page**: `https://YOUR_USERNAME.github.io/leadership-board/`
- **Admin dashboard**: `https://YOUR_USERNAME.github.io/leadership-board/admin.html`

## How It Works

### Voting (index.html)
1. Voter selects their name from the grid
2. Picks 3 colleagues in ranked order (1st, 2nd, 3rd)
3. Reviews and submits
4. If they vote again, their previous vote is overwritten

### Admin Dashboard (admin.html)
- Protected by a secret key (entered via prompt, stored in sessionStorage)
- Shows voting progress (who has/hasn't voted)
- Displays leaderboard ranked by points (1st = 3pts, 2nd = 2pts, 3rd = 1pt)
- Shows individual vote details with timestamps
- Refresh button to reload latest data

## Scoring

| Rank | Points |
|------|--------|
| 1st  | 3      |
| 2nd  | 2      |
| 3rd  | 1      |

Tiebreaker: most 1st-place votes, then most 2nd-place votes.
