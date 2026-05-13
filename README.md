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