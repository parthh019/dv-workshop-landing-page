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

Registrations are stored in Vercel Postgres when `DATABASE_URL` is configured in your Vercel project. If no database is configured, the serverless function keeps registrations in-memory (ephemeral) for short-term access.

## Store registrations in Vercel Postgres

1. In the Vercel dashboard, add a Vercel Postgres database and note the `DATABASE_URL`.
2. Set the `DATABASE_URL` environment variable in your Vercel project settings.
3. Run the following SQL once (via psql or Vercel SQL editor) to create the table:

```sql
CREATE TABLE registrations (
	id TEXT PRIMARY KEY,
	full_name TEXT,
	email TEXT,
	phone TEXT,
	created_at TIMESTAMP WITH TIME ZONE,
	workshop_starts_at TIMESTAMP WITH TIME ZONE,
	ip TEXT,
	user_agent TEXT
);
```

4. After deployment, form submissions will be appended to the `registrations` table.

To export data as CSV from Postgres, use a SQL client or the Vercel Postgres UI to run:

```sql
COPY (SELECT * FROM registrations ORDER BY created_at DESC) TO STDOUT WITH CSV HEADER;
```

Stored columns (in order): `id`, `full_name`, `email`, `phone`, `created_at`, `workshop_starts_at`, `ip`, `user_agent`.