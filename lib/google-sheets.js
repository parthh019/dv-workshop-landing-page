const { google } = require('googleapis');

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }
  return value;
}

function getServiceAccountKey() {
  const raw = requireEnv('GOOGLE_PRIVATE_KEY');
  // Vercel env vars often store newlines escaped.
  return raw.replace(/\\n/g, '\n');
}

function getSheetsConfig() {
  return {
    spreadsheetId: requireEnv('GOOGLE_SHEET_ID'),
    tabName: process.env.GOOGLE_SHEET_TAB || 'Registrations'
  };
}

async function appendRegistrationRow(rowValues) {
  const clientEmail = requireEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL');
  const privateKey = getServiceAccountKey();
  const { spreadsheetId, tabName } = getSheetsConfig();

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${tabName}!A:Z`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [rowValues]
    }
  });
}

function isSheetsConfigured() {
  return Boolean(
    process.env.GOOGLE_SHEET_ID &&
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY
  );
}

module.exports = {
  appendRegistrationRow,
  isSheetsConfigured
};
