const {
  ZOOM_MEETING_ID,
  ZOOM_MEETING_PASSWORD,
  ZOOM_SDK_KEY,
  ZOOM_SDK_SECRET,
  getWorkshopStatus,
  readJsonBody,
  sendJson
} = require('../lib/vercel-api');

const { insertRegistration, isDbConfigured } = require('../lib/db');

module.exports = async function registerHandler(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const fullName = String(body.fullName || '').trim();
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();

    if (!fullName || !email || !phone) {
      sendJson(res, 400, { error: 'Full name, email, and phone number are required.' });
      return;
    }

    const status = getWorkshopStatus();
    const entry = {
      id: `reg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      fullName,
      email,
      phone,
      createdAt: new Date().toISOString(),
      workshopStartsAt: status.startsAt
    };

    const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    const userAgent = String(req.headers['user-agent'] || '').trim();

    let stored = false;
    let storageNote = 'Registrations are not persisted unless a database is configured.';

    if (isDbConfigured()) {
      await insertRegistration(entry, ip, userAgent);
      stored = true;
      storageNote = 'Stored in Vercel Postgres.';
    } else if (process.env.VERCEL) {
      // keep in-memory fallback on Vercel for short-term access
      const arr = global.__DV_REGISTRATIONS || [];
      arr.push(entry);
      global.__DV_REGISTRATIONS = arr;
      storageNote = 'Stored in-memory (ephemeral). Configure DATABASE_URL for persistent storage.';
    }

    sendJson(res, 200, {
      ok: true,
      stored,
      status,
      registration: entry,
      meetingNumber: ZOOM_MEETING_ID,
      meetingPassword: ZOOM_MEETING_PASSWORD,
      sdkReady: Boolean(ZOOM_SDK_KEY && ZOOM_SDK_SECRET),
      storageNote
    });
  } catch (error) {
    sendJson(res, 400, { error: error.message || 'Unable to process registration.' });
  }
};