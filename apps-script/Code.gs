/**
 * Apps Script backend for the RSVP flow (website-spec.md §9.3, §11).
 *
 * Setup (client does this per checklist.md §6):
 *   1. Open the Google Sheet with tabs named exactly "Invitados" and "Respuestas".
 *   2. Extensions → Apps Script, paste this file in as Code.gs.
 *   3. Deploy → New deployment → Web app.
 *      Execute as: Me
 *      Who has access: Anyone
 *      (Anything else returns a login redirect instead of JSON — surfaces
 *      as an opaque CORS error on the site, not an auth error.)
 *   4. Copy the deployed /exec URL into RSVP_ENDPOINT_URL in both
 *      script.js (invitation page) and index.html (bare-domain gate page).
 *   5. After any edit to this file: Deploy → Manage deployments → edit
 *      pencil icon → New version. Apps Script serves the last *deployed*
 *      version, not the last saved one. Creating a fresh deployment
 *      instead of a new version issues a new URL and orphans the old one.
 *
 * Invitados columns:  Nombre | Teléfono | Invitados | Idioma
 * Respuestas columns: Marca de tiempo | Teléfono | Nombre | Asistirá |
 *                      Adultos | Niños | Lugares solicitados | Motivo |
 *                      Teléfono alt | Mensaje | Idioma
 */

var SHEET_INVITADOS = 'Invitados';
var SHEET_RESPUESTAS = 'Respuestas';
var MESSAGE_MAX_LEN = 500;

function doGet(e) {
  var phone = normalizePhone_(e.parameter.phone || '');
  if (!phone) return jsonResponse_({ found: false });

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_INVITADOS);
  var rows = sheet.getDataRange().getValues();

  for (var i = 1; i < rows.length; i++) {
    var name = String(rows[i][0] || '').trim();
    var rowPhone = normalizePhone_(String(rows[i][1] || ''));
    var allotment = Number(rows[i][2] || 0);
    var lang = normalizeLang_(rows[i][3]);

    if (!rowPhone) continue; // blank rows in a hand-entered list — ignore
    if (rowPhone === phone) {
      return jsonResponse_({ found: true, name: name, allotment: allotment, lang: lang });
    }
  }
  return jsonResponse_({ found: false });
}

function doPost(e) {
  var p = e.parameter;

  // Honeypot — real guests never fill this field. Silently discard bots.
  if (p.honeypot) return jsonResponse_({ ok: true });

  var phone = normalizePhone_(p.phone || '');
  var attending = p.attending === 'si' ? 'si' : 'no';
  var adults = clampInt_(p.adults, 0, 50);
  var kids = clampInt_(p.kids, 0, 50);
  var extra = clampInt_(p.extraRequested, 0, 2);
  var name = clampLen_(p.name, 200);
  var reason = clampLen_(p.reason, MESSAGE_MAX_LEN);
  var altPhone = normalizePhone_(p.altPhone || '');
  var message = clampLen_(p.message, MESSAGE_MAX_LEN);
  var lang = normalizeLang_(p.lang);

  // Re-check the allotment server-side — the client's cap is a UI
  // courtesy, never enforcement (§11). Reduce adults first, then kids
  // for whatever excess remains — reducing only adults isn't enough on
  // its own: a request with adults=0 and a large kids count would sail
  // straight past the cap untouched.
  if (attending === 'si') {
    var allotment = findAllotment_(phone);
    if (allotment !== null) {
      var over = (adults + kids) - allotment;
      if (over > 0) {
        var reduceAdults = Math.min(adults, over);
        adults -= reduceAdults;
        over -= reduceAdults;
        kids = Math.max(0, kids - over);
      }
    }
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_RESPUESTAS);
  sheet.appendRow([
    new Date(),
    phone,
    name,
    attending,
    adults,
    kids,
    extra,
    reason,
    altPhone,
    message,
    lang
  ]);

  return jsonResponse_({ ok: true });
}

function findAllotment_(phone) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_INVITADOS);
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    var rowPhone = normalizePhone_(String(rows[i][1] || ''));
    if (rowPhone && rowPhone === phone) return Number(rows[i][2] || 0);
  }
  return null;
}

function normalizePhone_(raw) {
  var digits = String(raw).replace(/\D/g, '');
  if (digits.length === 11 && digits.charAt(0) === '1') digits = digits.slice(1);
  return digits;
}

function normalizeLang_(raw) {
  var v = String(raw || '').trim().toLowerCase();
  return (v === 'es' || v === 'en') ? v : 'es';
}

function clampInt_(raw, min, max) {
  var n = parseInt(raw, 10);
  if (isNaN(n)) n = 0;
  return Math.max(min, Math.min(max, n));
}

function clampLen_(raw, max) {
  return String(raw || '').slice(0, max);
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
