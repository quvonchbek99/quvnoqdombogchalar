/**
 * kuvonch.uz — «Uyga vazifalar» va «Mustaqil ishlar» xizmati (Google Apps Script).
 * Fayllar sizning Google Drive'ingizga, ro'yxat esa Google jadvaliga (Sheets) yoziladi — ikkalasi ham shu skript
 * birinchi ishlaganda o'zi yaratiladi: «Kuvonch Academy — Uyga vazifalar» jadvali va «… (fayllar)» papkasi.
 *
 * O'RNATISH (bir marta, Drive egasi akkauntidan):
 *  1. https://script.google.com → «Yangi loyiha» (New project). Nomi: kuvonch-uyga-vazifa
 *  2. Code.gs ichidagi hamma narsani o'chirib, shu faylni to'liq joylang va saqlang (Ctrl+S).
 *  3. Chapdagi ⚙ «Project Settings» → pastda «Script Properties» → «Add script property»:
 *       OQITUVCHI_PAROL = o'zingiz o'ylagan parol (o'qituvchi paneliga kirish uchun)
 *     ixtiyoriy: GURUHLAR = 01-26, 02-26, 05-25 (vazifa bo'lmasa ham ro'yxatda turadigan guruhlar)
 *                FAYL_HAVOLA = ha (o'quvchi fayllari «havolasi borlar ko'ra oladi» bo'lsin; standart — faqat siz)
 *  4. «Deploy» → «New deployment» → turi: «Web app». Execute as: Me · Who has access: Anyone → Deploy.
 *     Google ruxsat so'raydi (Drive, Sheets, tashqi so'rovlar) → «Advanced» → «Go to … (unsafe)» → Allow.
 *  5. Chiqqan «Web app URL» (…/exec) ni uyga-vazifa.html dagi VZ_API ga yozing (yoki Claude'ga yuboring).
 * Kod o'zgarsa: Deploy → Manage deployments → ✏️ → Version: New version → Deploy (URL o'zgarmaydi).
 */
var JADVAL_NOMI = 'Kuvonch Academy — Uyga vazifalar';
var ILDIZ_NOMI = 'Kuvonch Academy — Uyga vazifalar (fayllar)';
var MAX_BAYT = 30 * 1024 * 1024;    // bitta so'rovda yuboriladigan fayl
var MAX_KATTA = 500 * 1024 * 1024;  // bo'laklab yuboriladigan eng katta fayl
var USTUN = {
  Vazifalar: ['id', 'yaratildi', 'guruh', 'fan', 'sarlavha', 'matn', 'muddat', 'oqituvchi', 'holat', 'ilova'],
  Topshiriqlar: ['id', 'vaqt', 'tur', 'vazifaId', 'vazifa', 'guruh', 'ism', 'fan', 'izoh', 'fayllar', 'holat', 'baho', 'oqituvchiIzohi', 'tekshirildi', 'kechikdi', 'kalit']
};

function doGet() {
  return javob({ ok: true, xizmat: 'kuvonch uyga vazifa', vaqt: new Date().toISOString() });
}

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    switch (d.amal) {
      case 'guruhlar': return javob(guruhlar());
      case 'vazifalar': return javob(vazifalar(d));
      case 'yukla': return javob(yukla(d));
      case 'boshla': return javob(boshla(d));
      case 'bolak': return javob(bolak(d));
      case 'topshir': return javob(topshir(d));
      case 'holat': return javob(holat(d));
      case 'kirish': return javob(kirish(d));
      case 'vazifa_saqla': oqituvchi(d); return javob(vazifaSaqla(d));
      case 'vazifa_yop': oqituvchi(d); return javob(vazifaYop(d));
      case 'topshiriqlar': oqituvchi(d); return javob(topshiriqlar(d));
      case 'baho': oqituvchi(d); return javob(baho(d));
    }
    return javob({ ok: false, xato: "Noma'lum amal" });
  } catch (err) {
    return javob({ ok: false, xato: String((err && err.message) || err) });
  }
}

/* ---------------- O'quvchi ---------------- */
function guruhlar() {
  var s = {};
  oqi('Vazifalar').forEach(function (v) { if (v.holat !== 'yopiq') ajrat(v.guruh).forEach(function (g) { s[g] = 1; }); });
  oqi('Topshiriqlar').forEach(function (t) { if (t.guruh) s[String(t.guruh)] = 1; });
  ajrat(prop('GURUHLAR')).forEach(function (g) { s[g] = 1; });
  return { ok: true, guruhlar: Object.keys(s).sort() };
}

function vazifalar(d) {
  var g = String(d.guruh || '').trim();
  if (!g) throw new Error('Guruhni tanlang');
  var r = oqi('Vazifalar').filter(function (v) { return v.holat !== 'yopiq' && ajrat(v.guruh).indexOf(g) > -1; })
    .map(function (v) { return { id: v.id, guruh: v.guruh, fan: v.fan, sarlavha: v.sarlavha, matn: v.matn, muddat: v.muddat, oqituvchi: v.oqituvchi, yaratildi: v.yaratildi, ilova: json(v.ilova, []) }; });
  r.sort(function (a, b) { return String(a.muddat || '9').localeCompare(String(b.muddat || '9')); });
  return { ok: true, vazifalar: r };
}

/** Kichik fayl (base64 bitta so'rovda) */
function yukla(d) {
  if (d.tur === 'ilova') oqituvchi(d);
  if (!d.b64) throw new Error("Fayl bo'sh");
  var bayt = Utilities.base64Decode(d.b64);
  if (bayt.length > MAX_BAYT) throw new Error("Fayl juda katta — bo'laklab yuboring");
  var f = papka(d).createFile(Utilities.newBlob(bayt, d.mime || 'application/octet-stream', faylNomi(d)));
  ulash(f, d);
  return { ok: true, id: f.getId(), nom: f.getName(), hajm: bayt.length };
}

/** Katta fayl: Drive'da davom ettiriladigan (resumable) yuklash sessiyasi */
function boshla(d) {
  if (d.tur === 'ilova') oqituvchi(d);
  var hajm = Number(d.hajm) || 0;
  if (hajm <= 0 || hajm > MAX_KATTA) throw new Error("Fayl hajmi 500 MB gacha bo'lishi kerak");
  var meta = { name: faylNomi(d), parents: [papka(d).getId()] };
  var r = UrlFetchApp.fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id', {
    method: 'post', contentType: 'application/json; charset=UTF-8', payload: JSON.stringify(meta), muteHttpExceptions: true,
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken(), 'X-Upload-Content-Type': d.mime || 'application/octet-stream', 'X-Upload-Content-Length': String(hajm) }
  });
  if (r.getResponseCode() !== 200) throw new Error('Drive sessiyasi ochilmadi (' + r.getResponseCode() + ')');
  var h = r.getAllHeaders(), loc = h.Location || h.location;
  if (!loc) throw new Error('Drive sessiya manzilini bermadi');
  var kalit = Utilities.getUuid();
  CacheService.getScriptCache().put('s_' + kalit, JSON.stringify({ loc: loc, hajm: hajm, tur: d.tur || '' }), 21600);
  return { ok: true, sessiya: kalit, bolak: 8 * 1024 * 1024 };
}

function bolak(d) {
  var kesh = CacheService.getScriptCache(), s = JSON.parse(kesh.get('s_' + d.sessiya) || 'null');
  if (!s) throw new Error("Yuklash sessiyasi topilmadi yoki muddati tugagan — qaytadan yuboring");
  var bayt = Utilities.base64Decode(d.b64 || ''), bosh = Number(d.bosh) || 0;
  if (!bayt.length) throw new Error("Bo'lak bo'sh");
  var oxir = bosh + bayt.length - 1;
  var r = UrlFetchApp.fetch(s.loc, {
    method: 'put', payload: bayt, contentType: 'application/octet-stream', muteHttpExceptions: true, followRedirects: false,
    headers: { 'Content-Range': 'bytes ' + bosh + '-' + oxir + '/' + s.hajm }
  });
  var c = r.getResponseCode();
  if (c === 308) return { ok: true, tugadi: false, keyingi: oxir + 1 };
  if (c === 200 || c === 201) {
    var f = DriveApp.getFileById(JSON.parse(r.getContentText()).id);
    ulash(f, { tur: s.tur });
    kesh.remove('s_' + d.sessiya);
    return { ok: true, tugadi: true, id: f.getId(), nom: f.getName(), hajm: s.hajm };
  }
  throw new Error("Bo'lak yuklanmadi (" + c + ')');
}

/** Fayllar yuklangach — topshiriqni ro'yxatga yozadi */
function topshir(d) {
  var tur = d.tur === 'mustaqil' ? 'mustaqil' : 'uyga';
  var ism = matn(d.ism, 60), guruh = matn(d.guruh, 30);
  if (ism.length < 3) throw new Error('Ism va familiyangizni yozing');
  if (!guruh) throw new Error('Guruhni tanlang');
  var fayllar = (d.fayllar || []).slice(0, 20).map(function (x) {
    var f = DriveApp.getFileById(String(x.id)); // fayl haqiqatan shu Drive'da borligini tekshiradi
    return { id: f.getId(), nom: f.getName(), hajm: f.getSize(), mime: f.getMimeType() };
  });
  if (!fayllar.length && !String(d.izoh || '').trim()) throw new Error('Kamida bitta fayl biriktiring');
  var v = null;
  if (tur === 'uyga') {
    v = oqi('Vazifalar').filter(function (x) { return String(x.id) === String(d.vazifaId); })[0];
    if (!v || v.holat === 'yopiq') throw new Error('Bu vazifa topilmadi yoki yopilgan');
  }
  var hozir = new Date(), id = Utilities.getUuid().slice(0, 8), kalit = Utilities.getUuid().replace(/-/g, '').slice(0, 16);
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    yoz('Topshiriqlar', {
      id: id, vaqt: hozir.toISOString(), tur: tur, vazifaId: v ? v.id : '', vazifa: v ? v.sarlavha : matn(d.mavzu, 140) || 'Mustaqil ish',
      guruh: guruh, ism: ism, fan: v ? v.fan : matn(d.fan, 80), izoh: matn(d.izoh, 2000), fayllar: JSON.stringify(fayllar),
      holat: 'yuborildi', baho: '', oqituvchiIzohi: '', tekshirildi: '', kechikdi: v && v.muddat && hozir > new Date(v.muddat) ? 'ha' : '', kalit: kalit
    });
  } finally { lock.releaseLock(); }
  return { ok: true, id: id, kalit: kalit };
}

/** O'quvchi o'z topshiriqlarining holatini ko'radi (id + kalit bilan) */
function holat(d) {
  var so = {};
  (d.ids || []).slice(0, 100).forEach(function (x) { if (x && x.id) so[String(x.id)] = String(x.kalit || ''); });
  var r = oqi('Topshiriqlar').filter(function (t) { return so[String(t.id)] && so[String(t.id)] === String(t.kalit); })
    .map(function (t) { return { id: t.id, holat: t.holat, baho: t.baho, izoh: t.oqituvchiIzohi, tekshirildi: t.tekshirildi }; });
  return { ok: true, holatlar: r };
}

/* ---------------- O'qituvchi ---------------- */
function kirish(d) {
  var parol = prop('OQITUVCHI_PAROL');
  if (!parol) throw new Error("O'qituvchi paroli sozlanmagan: Project Settings → Script Properties → OQITUVCHI_PAROL");
  var kesh = CacheService.getScriptCache(), n = Number(kesh.get('xato_kirish') || 0);
  if (n >= 10) throw new Error("Ko'p noto'g'ri urinish — 10 daqiqadan keyin qayta urinib ko'ring");
  if (String(d.parol || '').trim() !== parol.trim()) { kesh.put('xato_kirish', String(n + 1), 600); throw new Error("Parol noto'g'ri"); }
  var t = String(Date.now() + 30 * 864e5);
  return { ok: true, token: t + '.' + imzo(t), jadval: jadval().getUrl(), papka: ildiz().getUrl() };
}
function oqituvchi(d) {
  var t = String(d.token || ''), i = t.indexOf('.');
  if (i < 0 || imzo(t.slice(0, i)) !== t.slice(i + 1) || Number(t.slice(0, i)) < Date.now()) throw new Error('KIRISH');
}
function imzo(t) {
  var p = PropertiesService.getScriptProperties(), s = p.getProperty('SIR');
  if (!s) { s = Utilities.getUuid() + Utilities.getUuid(); p.setProperty('SIR', s); }
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(t + '|' + prop('OQITUVCHI_PAROL'), s));
}

function vazifaSaqla(d) {
  var sarlavha = matn(d.sarlavha, 140), guruh = ajrat(d.guruh).join(', ');
  if (!sarlavha) throw new Error('Vazifa nomini yozing');
  if (!guruh) throw new Error('Kamida bitta guruh yozing');
  var o = { guruh: guruh, fan: matn(d.fan, 80), sarlavha: sarlavha, matn: matn(d.matn, 8000), muddat: matn(d.muddat, 30),
    oqituvchi: matn(d.oqituvchi, 80), ilova: JSON.stringify((d.ilova || []).slice(0, 10).map(function (x) {
      var f = DriveApp.getFileById(String(x.id)); return { id: f.getId(), nom: f.getName(), url: f.getUrl() };
    })) };
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var bor = d.id ? oqi('Vazifalar').filter(function (x) { return String(x.id) === String(d.id); })[0] : null;
    if (bor) { yangila('Vazifalar', bor._qator, o); return { ok: true, id: bor.id }; }
    o.id = Utilities.getUuid().slice(0, 8); o.yaratildi = new Date().toISOString(); o.holat = 'faol';
    yoz('Vazifalar', o);
    return { ok: true, id: o.id };
  } finally { lock.releaseLock(); }
}
function vazifaYop(d) {
  var v = oqi('Vazifalar').filter(function (x) { return String(x.id) === String(d.id); })[0];
  if (!v) throw new Error('Vazifa topilmadi');
  yangila('Vazifalar', v._qator, { holat: d.ochiq ? 'faol' : 'yopiq' });
  return { ok: true };
}

function topshiriqlar(d) {
  var V = oqi('Vazifalar'), T = oqi('Topshiriqlar'), soni = {};
  var r = T.map(function (t) {
    soni[t.vazifaId] = (soni[t.vazifaId] || 0) + 1;
    return { id: t.id, vaqt: t.vaqt, tur: t.tur, vazifaId: t.vazifaId, vazifa: t.vazifa, guruh: t.guruh, ism: t.ism, fan: t.fan, izoh: t.izoh,
      fayllar: json(t.fayllar, []).map(function (f) { f.url = 'https://drive.google.com/file/d/' + f.id + '/view'; f.yukla = 'https://drive.google.com/uc?export=download&id=' + f.id; return f; }),
      holat: t.holat, baho: t.baho, oqituvchiIzohi: t.oqituvchiIzohi, tekshirildi: t.tekshirildi, kechikdi: t.kechikdi === 'ha' };
  }).reverse();
  var v = V.map(function (x) { return { id: x.id, guruh: x.guruh, fan: x.fan, sarlavha: x.sarlavha, matn: x.matn, muddat: x.muddat, holat: x.holat, oqituvchi: x.oqituvchi, ilova: json(x.ilova, []), soni: soni[x.id] || 0 }; }).reverse();
  return { ok: true, topshiriqlar: r, vazifalar: v, jadval: jadval().getUrl() };
}
function baho(d) {
  var t = oqi('Topshiriqlar').filter(function (x) { return String(x.id) === String(d.id); })[0];
  if (!t) throw new Error('Topshiriq topilmadi');
  var h = ['qabul', 'qaytarildi', 'yuborildi'].indexOf(d.holat) > -1 ? d.holat : 'qabul';
  yangila('Topshiriqlar', t._qator, { holat: h, baho: matn(d.baho, 10), oqituvchiIzohi: matn(d.izoh, 1000), tekshirildi: new Date().toISOString() });
  return { ok: true };
}

/* ---------------- Jadval va Drive ---------------- */
function jadval() {
  var p = PropertiesService.getScriptProperties(), id = p.getProperty('JADVAL_ID'), ss = null;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; } }
  if (!ss) {
    ss = SpreadsheetApp.create(JADVAL_NOMI); p.setProperty('JADVAL_ID', ss.getId());
    try { DriveApp.getFileById(ss.getId()).moveTo(ildiz()); } catch (e) { }
  }
  return ss;
}
function varaq(nom) {
  var ss = jadval(), sh = ss.getSheetByName(nom);
  if (!sh) {
    sh = ss.insertSheet(nom); sh.getRange('A:Z').setNumberFormat('@');
    sh.appendRow(USTUN[nom]); sh.setFrozenRows(1); sh.getRange(1, 1, 1, USTUN[nom].length).setFontWeight('bold');
    var bosh = ss.getSheets().filter(function (x) { return USTUN[x.getName()] === undefined; });
    bosh.forEach(function (x) { if (ss.getSheets().length > 1) { try { ss.deleteSheet(x); } catch (e) { } } });
  }
  return sh;
}
function oqi(nom) {
  var sh = varaq(nom), v = sh.getDataRange().getValues(), h = v.shift() || [];
  return v.map(function (r, i) { var o = { _qator: i + 2 }; h.forEach(function (k, j) { o[k] = r[j] instanceof Date ? r[j].toISOString() : r[j]; }); return o; });
}
function yoz(nom, o) { varaq(nom).appendRow(USTUN[nom].map(function (k) { return xavfsiz(o[k]); })); }
function yangila(nom, qator, o) {
  var sh = varaq(nom), h = USTUN[nom];
  Object.keys(o).forEach(function (k) { var j = h.indexOf(k); if (j > -1) sh.getRange(qator, j + 1).setValue(xavfsiz(o[k])); });
}
function ildiz() {
  var p = PropertiesService.getScriptProperties(), id = p.getProperty('ILDIZ_ID');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) { } }
  var it = DriveApp.getFoldersByName(ILDIZ_NOMI), f = it.hasNext() ? it.next() : DriveApp.createFolder(ILDIZ_NOMI);
  p.setProperty('ILDIZ_ID', f.getId());
  return f;
}
// Drive tuzilmasi: Guruh / Vazifa (yoki «Mustaqil ishlar») / O'quvchi ; o'qituvchi ilovalari: Guruh / «_Vazifa ilovalari»
function papka(d) {
  var g = ichkari(ildiz(), toza(String(d.guruh || 'Guruhsiz').split(',')[0]));
  if (d.tur === 'ilova') return ichkari(g, '_Vazifa ilovalari');
  return ichkari(ichkari(g, d.tur === 'mustaqil' ? 'Mustaqil ishlar' : toza(d.vazifa || 'Vazifa')), toza(d.ism || 'Nomsiz'));
}
function ulash(f, d) {
  if (d.tur === 'ilova' || /^ha$/i.test(prop('FAYL_HAVOLA'))) f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
}
function faylNomi(d) { return toza((d.tur === 'ilova' ? '' : (d.ism ? d.ism + ' — ' : '')) + (d.nom || 'fayl')); }
function ichkari(ota, nom) { var it = ota.getFoldersByName(nom); return it.hasNext() ? it.next() : ota.createFolder(nom); }

/* ---------------- Yordamchilar ---------------- */
function prop(k) { return PropertiesService.getScriptProperties().getProperty(k) || ''; }
function ajrat(s) { return String(s || '').split(/[,;]+/).map(function (x) { return x.trim(); }).filter(String); }
function matn(s, n) { return String(s == null ? '' : s).replace(/\u0000/g, '').trim().slice(0, n || 200); }
function toza(s) { return String(s).replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 150) || 'nomsiz'; }
function xavfsiz(v) { v = v == null ? '' : String(v); return /^[=+\-@]/.test(v) ? "'" + v : v; } // jadvalda formula bo'lib qolmasin
function json(s, b) { try { return JSON.parse(String(s || '')) || b; } catch (e) { return b; } }
function javob(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
