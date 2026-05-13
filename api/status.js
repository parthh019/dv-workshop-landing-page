const { getWorkshopStatus, sendJson } = require('./_shared');

module.exports = function statusHandler(req, res) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  sendJson(res, 200, getWorkshopStatus());
};