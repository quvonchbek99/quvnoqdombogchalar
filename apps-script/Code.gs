// ==== SOZLAMALAR ====
// Maxfiy qiymatlar kodda emas: Apps Script → Loyiha sozlamalari → Skript xossalari (Script properties):
//   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, TEACHER_EMAIL
var SPREADSHEET_ID = '16fxrXvT4HM6pS0C8oJr2VbN3zc_J8DsKZY64wz9nfvg';
var SHEET_NAME = 'Natijalar';
var SAVOLLAR_SHEET_NAME = 'Savollar';
var FIREBASE_API_KEY = 'AIzaSyAw1lBVzTYqbMfkXeWv5fzKX-ORgsGCXtc'; // ochiq veb-kalit (maxfiy emas)
var FIREBASE_PROJECT = 'kuvonch-academy';

function prop(name) { return PropertiesService.getScriptProperties().getProperty(name) || ''; }

// O'qituvchini Firebase kirish tokeni orqali tekshirish: token haqiqiy va admins/{uid} hujjati bor.
function verifyAdmin(idToken) {
  if (!idToken) return false;
  try {
    var r = UrlFetchApp.fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + FIREBASE_API_KEY, {
      method: 'post', contentType: 'application/json', payload: JSON.stringify({ idToken: String(idToken) }), muteHttpExceptions: true
    });
    if (r.getResponseCode() !== 200) return false;
    var users = JSON.parse(r.getContentText()).users || [];
    if (!users.length) return false;
    var uid = users[0].localId;
    var d = UrlFetchApp.fetch('https://firestore.googleapis.com/v1/projects/' + FIREBASE_PROJECT +
      '/databases/(default)/documents/admins/' + encodeURIComponent(uid), {
      headers: { Authorization: 'Bearer ' + idToken }, muteHttpExceptions: true
    });
    return d.getResponseCode() === 200;
  } catch (err) { return false; }
}

function doPost(e) {
  var result = { ok: true };
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.action === 'addQuestions') {
      result = handleAddQuestions(data);
    } else if (data.action === 'addTopic') {
      result = handleAddTopic(data);
    } else {
      writeToSheet(data);
      sendToTelegram(data);
      sendEmailToTeacher(data);
    }
  } catch (err) {
    result = { ok: false, error: String(err) };
  }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var action = (e && e.parameter) ? e.parameter.action : null;
  if (action === 'listTopics') {
    var topics = listDynamicTopics();
    return ContentService.createTextOutput(JSON.stringify({ ok: true, topics: topics })).setMimeType(ContentService.MimeType.JSON);
  }
  // Natijalarni ko'rish endi ustoz.html (Firestore) orqali; parolli listResults olib tashlandi.
  return ContentService.createTextOutput(JSON.stringify({ ok: true, info: 'Mashqlar natijalari webhook ishlayapti.' })).setMimeType(ContentService.MimeType.JSON);
}

function writeToSheet(data) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) { sheet = ss.insertSheet(SHEET_NAME); }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Vaqt', "F.I.Sh", 'Guruh', 'Mavzu', "To'g'ri", 'Jami', 'Sana']);
  }
  sheet.insertRowAfter(1); // yangi natija sarlavhadan keyin, eng tepaga qo'shiladi
  var row = 2;
  sheet.getRange(row, 2, 1, 2).setNumberFormat('@');
  sheet.getRange(row, 1, 1, 7).setValues([[ new Date(), data.name || '', data.group || '', data.topic || '', data.correct, data.total, data.date || '' ]]);
}

function sendToTelegram(data) {
  var token = prop('TELEGRAM_BOT_TOKEN'), chat = prop('TELEGRAM_CHAT_ID');
  if (!token || !chat) return;
  var total = data.total || 0;
  var correct = data.correct || 0;
  var pct = total ? Math.round((correct / total) * 100) : 0;
  var text =
    '📝 Yangi test natijasi\n' +
    '👤 ' + (data.name || '-') + '\n' +
    '🏷 Guruh: ' + (data.group || '-') + '\n' +
    '📚 Mavzu: ' + (data.topic || '-') + '\n' +
    '✅ Natija: ' + correct + '/' + total + ' (' + pct + '%)\n' +
    '🕒 ' + (data.date || '-');
  var url = 'https://api.telegram.org/bot' + token + '/sendMessage';
  UrlFetchApp.fetch(url, { method: 'post', contentType: 'application/json', payload: JSON.stringify({ chat_id: chat, text: text }), muteHttpExceptions: true });
}

function sendEmailToTeacher(data) {
  var to = prop('TEACHER_EMAIL');
  if (!to) return;
  var total = data.total || 0;
  var correct = data.correct || 0;
  var pct = total ? Math.round((correct / total) * 100) : 0;
  var subject = 'Yangi test natijasi: ' + (data.name || '-') + ' - ' + correct + '/' + total;
  var body =
    'Yangi test natijasi\n\n' +
    'F.I.Sh: ' + (data.name || '-') + '\n' +
    'Guruh: ' + (data.group || '-') + '\n' +
    'Mavzu: ' + (data.topic || '-') + '\n' +
    'Natija: ' + correct + '/' + total + ' (' + pct + '%)\n' +
    'Vaqt: ' + (data.date || '-');
  try {
    MailApp.sendEmail(to, subject, body);
  } catch (err) {
    // email yuborilmasa ham asosiy oqim davom etadi
  }
}

function handleAddTopic(data) {
  if (!verifyAdmin(data.idToken)) {
    return { ok: false, error: "Ruxsat yo'q: o'qituvchi akkaunti bilan kiring." };
  }
  var topicName = (data.topicName || '').toString().trim();
  var questions = data.questions;
  if (!topicName) return { ok: false, error: 'Mavzu nomi kiritilmagan.' };
  if (!Array.isArray(questions) || questions.length === 0) return { ok: false, error: 'Savollar topilmadi.' };

  var topicId = 'd' + new Date().getTime();
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SAVOLLAR_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SAVOLLAR_SHEET_NAME);
    sheet.appendRow(['TopicId', 'TopicName', 'Question', 'Opt1', 'Opt2', 'Opt3', 'Opt4', 'CorrectIndex', 'Vaqt']);
  }
  var now = new Date();
  questions.forEach(function (q) {
    var opts = q.options || [];
    var qRow = sheet.getLastRow() + 1;
    sheet.getRange(qRow, 3, 1, 5).setNumberFormat('@');
    sheet.getRange(qRow, 1, 1, 9).setValues([[topicId, topicName, q.q || '', opts[0] || '', opts[1] || '', opts[2] || '', opts[3] || '', q.correct, now]]);
  });
  return { ok: true, topicId: topicId, count: questions.length };
}

function listDynamicTopics() {
  function asMatnTopic(v) {
    if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), 'MM-dd');
    return v;
  }
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SAVOLLAR_SHEET_NAME);
  if (!sheet || sheet.getLastRow() < 2) return [];
  var lastCol = Math.min(sheet.getLastColumn(), 8);
  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, lastCol).getValues();
  var byId = {};
  var order = [];
  values.forEach(function (row) {
    var topicId = row[0];
    var topicName = row[1];
    if (!topicId) return;
    if (!byId[topicId]) {
      byId[topicId] = { id: String(topicId), name: String(topicName), questions: [] };
      order.push(topicId);
    }
    byId[topicId].questions.push({
      q: asMatnTopic(row[2]),
      options: [asMatnTopic(row[3]), asMatnTopic(row[4]), asMatnTopic(row[5]), asMatnTopic(row[6])],
      correct: Number(row[7])
    });
  });
  return order.map(function (id) { return byId[id]; });
}

function testSetup() {
  var sample = { name: 'Test Testov', group: 'demo', topic: 'Sinov mavzu', correct: 4, total: 5, date: new Date().toLocaleString('uz-UZ') };
  writeToSheet(sample);
  sendToTelegram(sample);
  sendEmailToTeacher(sample);
}


// ==== SAVOLLAR BAZASI: saytda yaratilgan yangi savollar avtomatik qo'shilib boradi ====
var BANK_SPREADSHEET_ID = '1xleCHy1Wo0mZnnmftHwMJI2BLvC3UiHLpdQUKKEdTL0';
var BANK_MAX_PER_TOPIC = 400;
var BANK_MAX_TOTAL = 15000;
function bankNorm(s) { return String(s || '').replace(/\s+/g, ' ').trim().toLowerCase(); }
function handleAddQuestions(data) {
  var qs = (data && data.questions) || [];
  if (!qs.length) return { ok: true, added: 0 };
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = SpreadsheetApp.openById(BANK_SPREADSHEET_ID).getSheets()[0];
    var last = sh.getLastRow();
    var seen = {}, perTopic = {};
    if (last > 1) {
      sh.getRange(2, 2, last - 1, 3).getValues().forEach(function (r) {
        var t = String(r[0]); seen[t + '|' + bankNorm(r[2])] = 1; perTopic[t] = (perTopic[t] || 0) + 1;
      });
    }
    if (last - 1 >= BANK_MAX_TOTAL) return { ok: true, added: 0, full: true };
    var rows = [], stamp = new Date().getTime();
    qs.slice(0, 60).forEach(function (q, i) {
      var tid = String(q.topicId || '');
      if (!/^[a-z0-9]{1,8}$/i.test(tid)) return;
      var text = String(q.q || '').slice(0, 400);
      var opts = (q.options || []).map(function (o) { return String(o).slice(0, 120); });
      var c = Number(q.correct);
      if (!text || opts.length !== 4 || !(c >= 0 && c < 4)) return;
      var key = tid + '|' + bankNorm(text);
      if (seen[key] || (perTopic[tid] || 0) >= BANK_MAX_PER_TOPIC) return;
      seen[key] = 1; perTopic[tid] = (perTopic[tid] || 0) + 1;
      rows.push(["'g" + stamp + '-' + i, "'" + tid, "'" + String(q.topic || '').slice(0, 120), "'" + text,
        "'" + opts[0], "'" + opts[1], "'" + opts[2], "'" + opts[3], 'ABCD'.charAt(c)]);
    });
    if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, 9).setValues(rows);
    return { ok: true, added: rows.length };
  } finally {
    lock.releaseLock();
  }
}
