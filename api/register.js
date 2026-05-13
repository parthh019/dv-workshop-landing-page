const {
  ZOOM_MEETING_ID,
  ZOOM_MEETING_PASSWORD,
  ZOOM_SDK_KEY,
  ZOOM_SDK_SECRET,
  getWorkshopStatus,
  readJsonBody,
  sendJson
} = require('../lib/vercel-api');

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

    sendJson(res, 200, {
      ok: true,
      stored: false,
      status,
      registration: entry,
      meetingNumber: ZOOM_MEETING_ID,
      meetingPassword: ZOOM_MEETING_PASSWORD,
      sdkReady: Boolean(ZOOM_SDK_KEY && ZOOM_SDK_SECRET),
      storageNote: 'Vercel serverless functions are stateless, so registrations are not persisted without external storage.'
    });
  } catch (error) {
    sendJson(res, 400, { error: error.message || 'Unable to process registration.' });
  }
};