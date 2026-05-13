# DV Workshop Landing Page

A responsive glassmorphism landing page for the DV Analytics workshop.

## Run locally

1. Open this folder in a terminal.
2. Start the app with:

```bash
npm start
```

3. Open `http://localhost:3000`.

## Zoom handoff

Create a `.env` file and set the following environment variables before starting the server to enable the Zoom Meeting SDK join flow:

```bash
ZOOM_SDK_KEY="your_meeting_sdk_key"
ZOOM_SDK_SECRET="your_meeting_sdk_secret"
ZOOM_MEETING_ID="9886300529"
ZOOM_MEETING_PASSWORD="563730"
```

After registration, the site opens `meeting.html`, generates a Meeting SDK signature on the server, and joins Zoom with the name entered in the form.

The server stores each registration in `data/registrations.json` for future access.

## Deploy on Vercel

This project is Vercel-compatible after moving the backend endpoints to serverless functions in `api/`.

1. Push the repository to GitHub.
2. In Vercel, import the GitHub repo.
3. Set these environment variables in the Vercel project settings:

```bash
ZOOM_SDK_KEY
ZOOM_SDK_SECRET
ZOOM_MEETING_ID
ZOOM_MEETING_PASSWORD
```

4. Deploy with the default settings.

Registrations are not persisted on Vercel unless you connect external storage. The registration form still works for the live Zoom handoff.

## Store registrations in Google Sheets

The `/api/register` endpoint can append each submission into a Google Sheet.

1. Create a Google Sheet and add a tab named `Registrations` (or set a custom tab name via env var).
2. Create a Google Cloud project and enable the **Google Sheets API**.
3. Create a **Service Account** and generate a JSON key.
4. Share your Google Sheet with the service account email (Editor access).
5. Set these Vercel environment variables:

```bash
GOOGLE_SHEET_ID=your_spreadsheet_id
GOOGLE_SHEET_TAB=Registrations
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Stored columns (in order): `createdAt`, `id`, `fullName`, `email`, `phone`, `workshopStartsAt`, `ip`, `userAgent`.