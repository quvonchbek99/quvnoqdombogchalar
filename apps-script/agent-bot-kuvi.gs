/**
 * KUVI AI — @kuvonch_agent_bot ichida (Kuvonch Academy'ning AI ustozi)
 * Bu fayl «Avto-javob agent (bot kodi)» loyihasidagi alohida fayl (Kuvi.gs). Code.gs dagi eski agent ishi o'zgarmaydi.
 *
 *  1) Botning o'ziga yozganlar (shaxsiy chat; guruhda — @bot deb murojaat qilsa yoki botga javob qaytarsa) — Kuvi javob beradi.
 *  2) Sizning shaxsiy Telegramingizda (Business), siz band paytingizda kimdir savol bersa — agent salomlashadi va Kuvi javob beradi
 *     (Sozlamalar: KUVI_BIZNES = HA). Siz o'zingiz yozsangiz — agent ham, Kuvi ham jim turadi (eskicha).
 *  Kuvi'ning miyasi — Kuvi serveri (Cloudflare, tools/kuvi-ovoz-worker.js):
 *     oddiy savol — o'ylab javob; qiyin masala yoki /chuqur — «to'liq chuqur o'ylash»: reja → yechim → mustaqil tekshiruv → (xato bo'lsa) tuzatish.
 *  Har kishiga kunlik limit (Sozlamalar: KUVI_KUNLIK, KUVI_CHUQUR). Siz (boss) va KUVI_ADMINLAR — cheksiz.
 *
 *  Xabarlar qanday keladi:
 *   • Tezkor rejim (webhook): Telegram → Kuvi serveri (/tg) → shu skriptning doPost'i — javob bir necha soniyada.
 *   • Eski rejim: har daqiqada poll() o'zi tekshiradi (webhook o'chirilgan bo'lsa).
 *  ▶ webhookUlash — tezkor rejimni yoqadi (Deploy → Web app qilingandan keyin, bir marta)
 *  ▶ webhookOchir — eski (har daqiqa) rejimga qaytaradi
 *  ▶ kuviSinov    — Kuvi serveriga sinov savoli yuborib, javobni Log'da ko'rsatadi (Telegram'ga hech narsa yubormaydi)
 */

const KUVI_SERVER = 'https://kuvi-ovoz.quvonchmash12.workers.dev';
const KUVI_MIGRATSIYA = 'kuvi-2';

/* ================= Har daqiqada (trigger) ================= */

function poll() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(2000)) return;
  try {
    migratsiya_();
    migratsiyaKuvi_();
    const s = sozlamalar_();
    const token = s.BOT_TOKEN;
    if (!token) return; // token qo'yilishini kutadi
    const props = PropertiesService.getScriptProperties();
    if (props.getProperty('TOKEN_OK') !== token.slice(-6)) {
      // Token yangi qo'yilgan — tekshiramiz, eski webhookni olib tashlaymiz va bir marta jurnalga yozamiz
      const men = tg_(token, 'getMe', {});
      tg_(token, 'deleteWebhook', { drop_pending_updates: false });
      props.deleteProperty('WEBHOOK');
      props.setProperty('TOKEN_OK', token.slice(-6));
      props.setProperty('BOT_USERNAME', men.username || '');
      jurnal_('@' + men.username, 'Token topildi — agent ishlayapti', '');
    }
    const hozir = new Date();
    const h = holat_(hozir, s);
    // vaqtga bog'liq ishlar har daqiqada: dars tugagach qayta aloqa, kunlik xulosa
    qaytaAloqa_(token, s, h, props);
    kunlikXulosaTekshir_(token, s, props, hozir);

    // Tezkor rejimda xabarlar doPost orqali keladi — bu yerda faqat webhook joyidaligini tekshiramiz
    if (props.getProperty('WEBHOOK') === 'ha') { webhookTekshir_(token, props); return; }

    let ups;
    try {
      ups = tg_(token, 'getUpdates', {
        offset: Number(props.getProperty('OFFSET') || 0), timeout: 0, limit: 100,
        allowed_updates: ['business_message', 'business_connection', 'message', 'callback_query']
      });
    } catch (e) {
      // webhook ulangan bo'lsa Telegram getUpdates'ga ruxsat bermaydi — tezkor rejimga o'tamiz
      if (/webhook/i.test(String(e.message || e))) { props.setProperty('WEBHOOK', 'ha'); jurnal_('', 'Tezkor rejim (webhook)', 'xabarlar Kuvi serveri orqali keladi'); return; }
      throw e;
    }
    if (!ups.length) return;
    props.setProperty('OFFSET', String(Math.max.apply(null, ups.map(function (x) { return x.update_id; })) + 1));
    ups.forEach(function (u) {
      try { yangilanish_(token, s, props, u, { h: h, hozir: hozir }); }
      catch (e) { jurnal_('XATO', String(e.message || e), ''); }
    });
  } catch (e) {
    // Bir xil xatoni har daqiqada qayta yozmaslik uchun
    const p = PropertiesService.getScriptProperties();
    const xato = String(e.message || e);
    if (p.getProperty('OXIRGI_XATO') !== xato) { p.setProperty('OXIRGI_XATO', xato); jurnal_('XATO', xato, ''); }
  } finally {
    lock.releaseLock();
  }
}

/* ================= Tezkor rejim: Kuvi serveri uzatgan xabarlar ================= */

function doPost(e) {
  const ok = ContentService.createTextOutput('ok');
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (x) { return ok; }
  if (!d || !d.u || !d.tgSir) return ok;
  const s = sozlamalar_();
  const token = s.BOT_TOKEN;
  if (!token || d.tgSir !== tgSir_(token)) return ok; // faqat Telegram (maxfiy kalit bot tokenidan hisoblanadi)
  const cache = CacheService.getScriptCache();
  const uk = 'upd|' + d.u.update_id;
  if (cache.get(uk)) return ok; // Telegram qayta yuborgan bo'lsa — bir marta
  cache.put(uk, '1', 21600);
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('WEBHOOK') !== 'ha') props.setProperty('WEBHOOK', 'ha');
  try { yangilanish_(token, s, props, d.u, {}); }
  catch (x) { jurnal_('XATO', 'Tezkor rejim: ' + String(x.message || x), ''); }
  return ok;
}

function doGet() {
  return ContentService.createTextOutput('Kuvonch agent bot (Kuvi AI) ishlayapti');
}

/* ================= Bitta Telegram yangilanishi ================= */

function yangilanish_(token, s, props, u, ctx) {
  ctx = ctx || {};
  const cache = CacheService.getScriptCache();
  if (u.business_connection) {
    const bc = u.business_connection;
    props.setProperty('OWNER_' + bc.id, JSON.stringify({ id: String(bc.user.id), chat: bc.user_chat_id }));
    jurnal_(bc.user.first_name || '', bc.is_enabled ? 'Bot akkauntga ulandi' : 'Bot akkauntdan uzildi', '');
    return;
  }
  if (u.business_message) return biznesXabar_(token, s, props, cache, u.business_message, ctx);
  if (u.message) return kuviXabar_(token, s, props, cache, u.message, 0);
  if (u.callback_query) return kuviTugma_(token, s, props, cache, u.callback_query);
}

// Shaxsiy akkauntingizga kelgan xabar (Telegram Business) — eski agent + Kuvi
function biznesXabar_(token, s, props, cache, m, ctx) {
  if (!m || !m.chat || m.chat.type !== 'private') return;
  if (m.sender_business_bot) return; // agentning o'zi yuborgan xabar
  const hozir = ctx.hozir || new Date();
  const h = ctx.h !== undefined ? ctx.h : holat_(hozir, s);
  const yoqilgan = ha_(s.BOT_YOQILGAN);
  const ttl = Math.min(21600, Math.max(600, Math.round((Number(s.QAYTA_JAVOB_SOAT) || 3) * 3600)));
  const egasi = egasi_(token, m.business_connection_id, props);
  const kalit = h ? m.chat.id + '|' + h.kalit : null;

  // Bossning o'zi yozdi — shu holat davomida bu chatda agent jim turadi
  if (m.from && String(m.from.id) === egasi.id) {
    if (kalit) cache.put(kalit, 'boss', ttl);
    return;
  }
  if (m.from && m.from.is_bot) return;
  if (!yoqilgan || !h) return;
  if (hozir.getTime() / 1000 - m.date > 600) return; // 10 daqiqadan eski xabarlarga javob yo'q

  const holatKesh = cache.get(kalit);
  if (holatKesh === 'boss' || holatKesh === 'spam') return;
  const ism = ism_(m.from);
  const matn = String(m.text || m.caption || (m.voice ? '[ovozli xabar]' : m.photo ? '[rasm]' : m.document ? '[fayl]' : m.sticker ? '[stiker]' : '[xabar]'));

  if (spamMi_(m, matn, s)) {
    cache.put(kalit, 'spam', ttl);
    jurnal_(ism, 'Spam - javob berilmadi', qisqa_(matn, 80));
    return;
  }
  // shaxsiy chatda Kuvi faqat fanga oid savolga javob beradi («Ustoz, dars bormi?» kabi savollarga — yo'q)
  const kuvi = ha_(s.KUVI_YOQILGAN) && ha_(s.KUVI_BIZNES) && fanSavolMi_(m.text || m.caption || '');

  if (!holatKesh) {
    // 1-xabar: agent salomlashadi (savol bo'lsa — Kuvi ham javob beradi)
    // kurs tugmalari faqat KURS_TUGMALAR = HA bo'lsa (standart — reklamasiz)
    yubor_(token, m, toldir_(s.AGENT_MATNI, { holat: h.holat }), ha_(s.KURS_TUGMALAR) ? tugmalar_(s) : null);
    cache.put(kalit, 'agent', ttl);
    jurnal_(ism, 'Agent javob berdi', h.izoh + ' | ' + qisqa_(matn, 80));
    if (h.tur === 'Dars') {
      const L = LockService.getScriptLock(), bor = L.hasLock();
      if (bor || L.tryLock(5000)) { try { qaytaAloqaQoy_(props, h, m, ism); } finally { if (!bor) L.releaseLock(); } }
    }
    if (kuvi) kuviJavob_(token, s, props, cache, m, { biznes: true, holat: h.izoh });
  } else if (kalitSozBor_(matn, s.KALIT_SOZLAR) && !cache.get(kalit + '|havola')) {
    // Keyingi xabarda "kurs", "guruh", "link"... desa — havolalarni beradi
    yubor_(token, m, s.HAVOLA_MATNI, tugmalar_(s));
    cache.put(kalit + '|havola', '1', 1800);
    jurnal_(ism, 'Havolalar berildi', qisqa_(matn, 80));
  } else if (!faqTop_(token, m, matn, ism, cache, kalit) && kuvi) {
    kuviJavob_(token, s, props, cache, m, { biznes: true, holat: h.izoh });
  }

  // Gapini bossga yetkazish (bot chatiga)
  if (ha_(s.BOSSGA_YETKAZISH) && egasi.chat) {
    try {
      tg_(token, 'sendMessage', {
        chat_id: egasi.chat,
        text: '📩 ' + ism + (m.from && m.from.username ? ' (@' + m.from.username + ')' : '') +
              ' yozdi (' + h.izoh + '):\n' + qisqa_(matn, 700)
      });
    } catch (e) { /* bossning bot bilan chati ochilmagan bo'lishi mumkin */ }
  }
}

// FAQ: mos javob bo'lsa yuboradi (yaqinda yuborilgan bo'lsa qayta yubormaydi). Mos kelsa — true
function faqTop_(token, m, matn, ism, cache, kalit) {
  const list = faq_();
  for (let i = 0; i < list.length; i++) {
    if (kalitSozBor_(matn, list[i].kalit)) {
      const ck = kalit + '|faq' + i;
      if (cache.get(ck)) return true;
      yubor_(token, m, list[i].javob, null);
      cache.put(ck, '1', 1800);
      jurnal_(ism, 'FAQ javob', qisqa_(list[i].kalit, 40));
      return true;
    }
  }
  return false;
}

/* ================= Kuvi: botga yozilgan xabar ================= */

function kuviXabar_(token, s, props, cache, m, majburDaraja) {
  if (!m || !m.chat || !m.from || m.from.is_bot) return;
  if (new Date().getTime() / 1000 - m.date > 600) return; // uzoq kutib qolgan eski xabarlar
  const shaxsiy = m.chat.type === 'private';
  let t = String(m.text || m.caption || '').trim();
  if (!shaxsiy) {
    const nom = botNomi_(token, props);
    // guruhda: faqat @bot deb murojaat qilsa, botga javob qaytarsa yoki /kuvi buyrug'i bo'lsa
    const tilga = nom && t.toLowerCase().indexOf('@' + nom.toLowerCase()) >= 0;
    const javobga = m.reply_to_message && m.reply_to_message.from && m.reply_to_message.from.is_bot && (!nom || m.reply_to_message.from.username === nom);
    if (!tilga && !javobga && !/^\/(kuvi|chuqur)\b/i.test(t)) return;
    if (nom) t = t.replace(new RegExp('@' + nom, 'ig'), '').trim();
  }
  if (!ha_(s.KUVI_YOQILGAN)) {
    if (shaxsiy && /^\/start/.test(t)) kvYubor_(token, { chat_id: m.chat.id, text: 'Assalomu alaykum! Kuvi AI hozircha o\'chirilgan.' });
    return;
  }
  const lim = kuviLimitlar_(s);
  // buyruqlar
  if (/^\/start\b/i.test(t) || /^\/(yordam|help)\b/i.test(t)) {
    const ism = m.from.first_name || '';
    kvYubor_(token, {
      chat_id: m.chat.id, parse_mode: 'HTML', link_preview_options: { is_disabled: true },
      text: 'Salom' + (ism ? ', ' + kvH_(ism) : '') + '! 👋 Men <b>Kuvi</b> — Kuvonch Academy\'ning AI ustoziman.\n\n' +
        'Istalgan savolingizni yozing: matematika, fizika, kimyo, informatika, tillar va boshqa fanlar. Masala yuborsangiz — qadam-baqadam yechib, javobni tekshirib beraman.\n\n' +
        '🧠 Qiyin masala bo\'lsa, boshiga <b>/chuqur</b> deb yozing: avval yechaman, keyin mustaqil tekshiraman, xato bo\'lsa tuzataman.\n' +
        '📊 Kunlik limit: ' + lim.kun + ' ta savol (shundan ' + lim.chuqur + ' tasi chuqur o\'ylash).\n\n' +
        'Masalan: <i>2x² − 5x + 2 = 0 ni yech</i> yoki <i>Integral nima? Sodda tushuntir</i>.'
    });
    return;
  }
  if (/^\/limit\b/i.test(t)) {
    const q = kuviLimit_(props, s, m.from.id, 0, false);
    kvYubor_(token, { chat_id: m.chat.id, text: q.cheksiz ? 'Sizda cheklov yo\'q ✨' : 'Bugun qoldi: ' + q.qoldi + ' ta savol, ' + q.chuqurQoldi + ' ta chuqur o\'ylash.' });
    return;
  }
  if (/^\/tozala\b/i.test(t)) { cache.remove('kvc|' + m.chat.id); kvYubor_(token, { chat_id: m.chat.id, text: 'Suhbat tarixi tozalandi 🧹' }); return; }
  if (!t && !m.photo) {
    if (shaxsiy && (m.voice || m.audio || m.video_note)) kvYubor_(token, { chat_id: m.chat.id, text: 'Ovozli xabarni hozircha tushunmayman — savolni matn qilib yozing 🙏', reply_parameters: { message_id: m.message_id, allow_sending_without_reply: true } });
    return;
  }
  kuviJavob_(token, s, props, cache, m, { matn: t, daraja: majburDaraja });
}

// «🧠 Chuqur o'ylab tekshir» tugmasi
function kuviTugma_(token, s, props, cache, q) {
  const d = String(q.data || '');
  if (d.indexOf('kv:') !== 0) return;
  try { tg_(token, 'answerCallbackQuery', { callback_query_id: q.id, text: '🧠 Chuqur o\'ylayapman…' }); } catch (e) {}
  const savol = q.message && q.message.reply_to_message;
  if (!savol || !(savol.text || savol.caption || savol.photo)) {
    kvYubor_(token, { chat_id: q.message.chat.id, text: 'Asl savol topilmadi — savolni boshiga /chuqur qo\'shib qayta yozing.' });
    return;
  }
  // tugmani bosgan odam limiti hisoblanadi
  const m = JSON.parse(JSON.stringify(savol));
  m.from = q.from; m.date = Math.floor(new Date().getTime() / 1000);
  try { tg_(token, 'editMessageReplyMarkup', { chat_id: q.message.chat.id, message_id: q.message.message_id, reply_markup: { inline_keyboard: [] } }); } catch (e) {}
  kuviJavob_(token, s, props, cache, m, { matn: String(savol.text || savol.caption || '').replace(/^\/(chuqur|tez|kuvi)\s*/i, ''), daraja: 2 });
}

/* ================= Kuvi javobi (bot chati yoki Business chat) ================= */

function kuviJavob_(token, s, props, cache, m, o) {
  o = o || {};
  const biznes = !!o.biznes;
  let t = String(o.matn != null ? o.matn : (m.text || m.caption || '')).trim();
  let daraja = o.daraja || 0;
  if (/^\/chuqur\b/i.test(t) || /^🧠/.test(t)) { daraja = 2; t = t.replace(/^\/chuqur(@\w+)?\s*|^🧠\s*/i, ''); }
  else if (/^\/tez\b/i.test(t)) { daraja = -1; t = t.replace(/^\/tez(@\w+)?\s*/i, ''); }
  else if (/^\/kuvi\b/i.test(t)) t = t.replace(/^\/kuvi(@\w+)?\s*/i, '');
  if (!t && !m.photo) { kvYubor_(token, kvP_(m, { text: 'Savolingizni yozing 🙂' })); return; }
  if (!daraja) daraja = kuviDaraja_(t);
  if (daraja < 0) daraja = 0;
  if (m.photo) daraja = Math.max(daraja, 1);

  const lq = kuviLimit_(props, s, m.from.id, daraja, true);
  if (!lq.ok) {
    const ck = 'kvlim|' + m.from.id + '|' + Utilities.formatDate(new Date(), TZ, 'yyyyMMdd');
    if (!cache.get(ck)) {
      cache.put(ck, '1', 21600);
      kvYubor_(token, kvP_(m, { text: 'Bugungi Kuvi limiti tugadi (' + lq.kun + ' ta savol) 🙏 Ertaga yana yozing. Shoshilinch bo\'lsa — kuvonch.uz/kuvi-ai.html' }));
    }
    return;
  }
  if (lq.pasaytirildi) daraja = 1;

  try { tg_(token, 'sendChatAction', kvP_(m, { action: 'typing' }, true)); } catch (e) {}
  // bot chatida «o'ylayapti» xabari (keyin javob bilan almashtiriladi); Business chatda — faqat «yozmoqda…»
  let joy = null;
  if (!biznes) {
    try { joy = tg_(token, 'sendMessage', kvP_(m, { text: daraja === 2 ? '🧠 Kuvi chuqur o\'ylayapti… (yechim → tekshiruv, 10–40 soniya)' : '💭 Kuvi o\'ylayapti…' })); } catch (e) {}
  }

  const xabarlar = kvKontekst_(cache, m.chat.id);
  xabarlar.push({ role: 'user', content: t || 'Rasmdagi topshiriqni qadam-baqadam yechib ber.' });
  let qosh = String(s.KUVI_QOSHIMCHA || '');
  if (biznes) qosh += (qosh ? '\n' : '') + 'Bu suhbat Quvonchbek ustozning shaxsiy Telegram chatida bo\'lyapti; ustoz hozir band (' + (o.holat || 'band') + '). Sen uning AI yordamchisisan: savolga yordam ber, javob ixcham bo\'lsin (ko\'pi bilan ~220 so\'z). Ustoz nomidan va\'da berma — uchrashuv, narx, baho, ruxsat kabi masalalarda «Ustoz bo\'shaganda o\'zi javob beradi» de.';
  let j;
  try {
    const rasm = m.photo ? kvRasm_(token, m.photo) : null;
    j = kuviSora_(xabarlar, { daraja: daraja, qosh: qosh, rasm: rasm });
  } catch (e) {
    kuviLimit_(props, s, m.from.id, daraja, false, true); // muvaffaqiyatsiz so'rov hisoblanmaydi
    const kod = e.kod || 0, xt = String(e.message || e);
    const matn = /rasm/i.test(xt) && m.photo ? '📷 Rasmni hozircha o\'qiy olmayman — masalani matn qilib yozing 🙏'
      : kod === 429 ? '⏳ Kuvi hozir juda band (bepul limit). 1–2 daqiqadan keyin qayta yozing.'
      : '⚠️ Kuvi serveriga ulanib bo\'lmadi. Birozdan keyin qayta urinib ko\'ring.';
    if (joy) kvTahrir_(token, m, joy.message_id, kvH_(matn), null); else if (!biznes) kvYubor_(token, kvP_(m, { text: matn }));
    jurnal_(ism_(m.from), 'Kuvi xato', qisqa_(xt, 120));
    return;
  }
  const bolaklar = (j.tg && j.tg.length) ? j.tg : [kvH_(j.text || '…')];
  if (biznes) bolaklar[0] = '🤖 <b>Kuvi</b> — Quvonchbek ustozning AI yordamchisi:\n\n' + bolaklar[0];
  const tugma = !biznes && daraja < 2 && kuviLimit_(props, s, m.from.id, 2, false).chuqurQoldi > 0
    ? { inline_keyboard: [[{ text: '🧠 Chuqur o\'ylab tekshir', callback_data: 'kv:c' }]] } : null;
  for (let i = 0; i < bolaklar.length; i++) {
    const oxirgi = i === bolaklar.length - 1;
    if (i === 0 && joy) kvTahrir_(token, m, joy.message_id, bolaklar[0], oxirgi ? tugma : null);
    else kvYubor_(token, kvP_(m, { text: bolaklar[i], parse_mode: 'HTML', link_preview_options: { is_disabled: true }, reply_markup: oxirgi && tugma ? tugma : undefined }));
  }
  kvKontekstSaqla_(cache, m.chat.id, t || '[rasm]', j.text || '');
  jurnal_(ism_(m.from), 'Kuvi javob berdi', (biznes ? '(shaxsiy chat) ' : '') + (daraja === 2 ? '🧠 ' : '') + qisqa_(t || '[rasm]', 70));
}

// Kuvi serveriga so'rov (oqimsiz, Telegram formatida)
function kuviSora_(xabarlar, o) {
  const d = o.daraja || 0;
  // chat uslubi: qisqa, sarlavha va chiziqlarsiz — xuddi odam yozgandek
  const chat = 'CHAT USLUBI: bu Telegram suhbati. Javobni xuddi tirik ustoz chatda yozgandek ber: qisqa va aniq (odatda 3–10 qator), sarlavha, «———» chiziq va ortiqcha qalin matnsiz. Masala yechganda qadamlarni raqamlab yoz, oxirida «Javob: …». Foydalanuvchiga «siz» deb murojaat qil.';
  const body = {
    messages: xabarlar, preset: 'tg', tg: true, stream: false, qosh: chat + (o.qosh ? '\n' + o.qosh : ''),
    deep: d >= 1, chuqur: d === 2, fikr: d >= 1, tgFikr: d >= 1,
    effort: d === 2 ? 'high' : d === 1 ? 'medium' : 'low', max: d === 2 ? 5000 : d === 1 ? 3500 : 1500, vaqt: 50000
  };
  if (o.rasm) body.rasm = o.rasm;
  const r = UrlFetchApp.fetch(KUVI_SERVER + '/chat', {
    method: 'post', contentType: 'application/json', payload: JSON.stringify(body),
    headers: { 'X-Kuvi-Mijoz': 'bot' }, muteHttpExceptions: true
  });
  let j = {};
  try { j = JSON.parse(r.getContentText()); } catch (e) {}
  if (r.getResponseCode() !== 200) {
    const e = new Error(j.error || ('Kuvi serveri: ' + r.getResponseCode()));
    e.kod = r.getResponseCode();
    throw e;
  }
  return j;
}

// Savol qanchalik chuqur o'ylashni talab qiladi: 0 — oddiy gap, 1 — savol (o'ylab javob), 2 — masala/isbot (chuqur + tekshiruv)
function kuviDaraja_(t) {
  const n = norm_(t);
  if (/(isbotla|isbot qil|yechib ber|yechimini|yech\b|yeching|yechilsin|hisobla|hisoblang|qadam-baqadam|bosqichma-bosqich|tahlil qil|masala|tenglama|tengsizlik|integral|hosila|limit|ehtimollik|prove|solve|step by step|докажи|реши|вычисли)/i.test(n)) return 2;
  if (/[=<>≤≥]/.test(t) && /\d/.test(t) && t.length > 6) return 2;
  if (savolMi_(t) || t.split(/\s+/).length >= 7) return 1;
  return 0;
}

// Xabar savolmi (Business chatda Kuvi faqat savollarga javob beradi; salom-alikka emas)
function savolMi_(t) {
  t = String(t || '').trim();
  if (t.length < 6) return false;
  const n = norm_(t);
  if (/^(salom|assalom|va alaykum|vaalaykum|hayrli|xayrli|rahmat|raxmat|ok\b|xop\b|ha\b|yoq\b|ustoz|domla|qalaysiz|yaxshimisiz)[\s\S]{0,25}$/.test(n) && !/\?/.test(t)) return false;
  if (/\?/.test(t)) return true;
  if (/(qanday|qanaqa|nega\b|nima uchun|nimaga|nima\b|qancha|nechta|necha\b|qaysi|qachon|qayer|kim\b|tushuntir|yech|hisobla|isbotla|toping|topish|aytib ber|misol|masala|formula|tenglama|integral|hosila|logarifm|teorema|tarif|farqi|how\b|what\b|why\b|explain|solve|calculate|как\b|почему|что такое|реши|объясни)/.test(n)) return true;
  if (telefonMi_(t)) return false;
  if (/\d\s*[+*/×÷^=<>]\s*[\dx(]|[a-z]\s*[\^²³]|√|∫/i.test(t)) return true;
  return false;
}
function telefonMi_(t) { return /^\+?\(?\d[\d\s()\-]{6,}$/.test(String(t || '').trim()); }

// Fanga oid savol (matematika, fizika va h.k.) — shaxsiy chatda Kuvi faqat shunga javob beradi
function fanSavolMi_(t) {
  t = String(t || '').trim();
  if (t.length < 6 || telefonMi_(t)) return false;
  const n = norm_(t);
  if (/(^|\s)kuvi\b/.test(n)) return true; // «Kuvi, …» deb murojaat qilsa
  if (/(matematik|algebra|geometri|fizika|kimyo|biolog|informatika|grammatika|tenglama|tengsizlik|misol|masala|formula|hosila|integral|logarifm|trigonometri|sinus|kosinus|tangens|teorema|isbot|funksiya|grafigi|kasr|foiz|daraja|ildiz|kvadrat|vektor|matritsa|ehtimollik|progressiya|yechib|yechish|yechimi|yeching|hisobla|tushuntirib|nima degani|qanday topiladi|qanday yechiladi|solve|equation|derivative|integral|уравнен|задач|формул)/.test(n)) return true;
  if (/[a-z]\s*[\^²³]|√|∫|\d\s*[+*/×÷^=<>]\s*[\dx(]/i.test(t)) return true;
  return false;
}

/* ================= Kunlik limit ================= */

function kuviLimitlar_(s) {
  return { kun: Math.max(1, parseInt(s.KUVI_KUNLIK, 10) || 30), chuqur: Math.max(0, parseInt(s.KUVI_CHUQUR, 10) || 5) };
}
function adminMi_(props, s, uid) {
  uid = String(uid);
  if (String(s.KUVI_ADMINLAR || '').split(/[\s,;]+/).indexOf(uid) >= 0) return true;
  const keys = props.getKeys();
  for (let i = 0; i < keys.length; i++) {
    if (keys[i].indexOf('OWNER_') !== 0) continue;
    try { if (JSON.parse(props.getProperty(keys[i])).id === uid) return true; } catch (e) {}
  }
  return false;
}
// yoz=true — hisoblaydi; qaytar=true — muvaffaqiyatsiz so'rovni qaytaradi
function kuviLimit_(props, s, uid, daraja, yoz, qaytar) {
  const lim = kuviLimitlar_(s);
  if (adminMi_(props, s, uid)) return { ok: true, cheksiz: true, qoldi: 999, chuqurQoldi: 999, kun: lim.kun };
  const L = LockService.getUserLock();
  const bor = L.hasLock();
  if (!bor) L.tryLock(5000);
  try {
    const bugun = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd');
    let d = {};
    try { d = JSON.parse(props.getProperty('KUVI_LIM') || '{}'); } catch (e) {}
    if (d.d !== bugun) d = { d: bugun, u: {} };
    const k = String(uid), x = d.u[k] || [0, 0];
    let pas = false;
    if (qaytar) { x[0] = Math.max(0, x[0] - 1); if (daraja === 2) x[1] = Math.max(0, x[1] - 1); }
    else if (yoz) {
      if (x[0] >= lim.kun) return { ok: false, qoldi: 0, chuqurQoldi: Math.max(0, lim.chuqur - x[1]), kun: lim.kun };
      if (daraja === 2 && x[1] >= lim.chuqur) pas = true; // chuqur limiti tugagan — oddiy o'ylab javob
      x[0]++; if (daraja === 2 && !pas) x[1]++;
    }
    if (yoz || qaytar) {
      d.u[k] = x;
      let s2 = JSON.stringify(d);
      if (s2.length > 8500) { d.u = {}; d.u[k] = x; s2 = JSON.stringify(d); } // juda ko'payib ketsa (9 KB chegara)
      props.setProperty('KUVI_LIM', s2);
    }
    return { ok: true, pasaytirildi: pas, qoldi: Math.max(0, lim.kun - x[0]), chuqurQoldi: Math.max(0, lim.chuqur - x[1]), kun: lim.kun };
  } finally {
    if (!bor) { try { L.releaseLock(); } catch (e) {} }
  }
}

/* ================= Yordamchilar ================= */

// chat va javob parametrlari (Business chatda business_connection_id ham kerak)
function kvP_(m, p, faqatChat) {
  p = p || {};
  p.chat_id = m.chat.id;
  if (m.business_connection_id) p.business_connection_id = m.business_connection_id;
  if (!faqatChat && m.message_id && !p.reply_parameters) p.reply_parameters = { message_id: m.message_id, allow_sending_without_reply: true };
  return p;
}
function kvH_(t) { return String(t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
// HTML xato bo'lsa (Telegram «can't parse entities») — oddiy matn bilan qayta yuboradi
function kvOddiy_(html) {
  return String(html || '').replace(/<blockquote[^>]*>/g, '').replace(/<\/blockquote>/g, '\n').replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}
function kvYubor_(token, p) {
  try { return tg_(token, 'sendMessage', p); }
  catch (e) {
    if (p.parse_mode && /parse|entit|tag/i.test(String(e.message || e))) {
      const q = JSON.parse(JSON.stringify(p)); delete q.parse_mode; q.text = kvOddiy_(p.text);
      try { return tg_(token, 'sendMessage', q); } catch (x) {}
    }
    if (p.reply_parameters) { const q = JSON.parse(JSON.stringify(p)); delete q.reply_parameters; try { return tg_(token, 'sendMessage', q); } catch (x) {} }
    return null;
  }
}
function kvTahrir_(token, m, msgId, html, markup) {
  const p = { chat_id: m.chat.id, message_id: msgId, text: html, parse_mode: 'HTML', link_preview_options: { is_disabled: true } };
  if (m.business_connection_id) p.business_connection_id = m.business_connection_id;
  if (markup) p.reply_markup = markup;
  try { return tg_(token, 'editMessageText', p); }
  catch (e) {
    if (/not modified/i.test(String(e.message || e))) return null;
    const q = JSON.parse(JSON.stringify(p)); delete q.parse_mode; q.text = kvOddiy_(html);
    try { return tg_(token, 'editMessageText', q); } catch (x) { return kvYubor_(token, kvP_(m, { text: html, parse_mode: 'HTML', reply_markup: markup || undefined })); }
  }
}
// suhbat xotirasi: oxirgi 3 savol-javob (6 soatgacha)
function kvKontekst_(cache, chatId) {
  let a = [];
  try { a = JSON.parse(cache.get('kvc|' + chatId) || '[]'); } catch (e) {}
  const out = [];
  a.forEach(function (x) { out.push({ role: 'user', content: x.q }); out.push({ role: 'assistant', content: x.a }); });
  return out;
}
function kvKontekstSaqla_(cache, chatId, q, a) {
  let arr = [];
  try { arr = JSON.parse(cache.get('kvc|' + chatId) || '[]'); } catch (e) {}
  arr.push({ q: qisqa_(q, 1200), a: qisqa_(a, 1800) });
  if (arr.length > 3) arr = arr.slice(-3);
  try { cache.put('kvc|' + chatId, JSON.stringify(arr), 21600); } catch (e) {}
}
// rasmni Telegram'dan olib, base64 qiladi (4 MB gacha)
function kvRasm_(token, photos) {
  let p = photos[photos.length - 1];
  for (let i = photos.length - 1; i >= 0; i--) { if (!photos[i].file_size || photos[i].file_size <= 4000000) { p = photos[i]; break; } }
  const f = tg_(token, 'getFile', { file_id: p.file_id });
  const blob = UrlFetchApp.fetch('https://api.telegram.org/file/bot' + token + '/' + f.file_path).getBlob();
  return { mime: 'image/jpeg', b64: Utilities.base64Encode(blob.getBytes()) };
}
function botNomi_(token, props) {
  let n = props.getProperty('BOT_USERNAME');
  if (!n) { try { n = tg_(token, 'getMe', {}).username || ''; props.setProperty('BOT_USERNAME', n); } catch (e) { n = ''; } }
  return n;
}
// Telegram webhook maxfiy kaliti — bot tokenidan hisoblanadi (alohida parol saqlash shart emas)
function tgSir_(token) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, token + '|kuvi-tg', Utilities.Charset.UTF_8)
    .map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join('').slice(0, 48);
}

/* ================= Boshqaruv (▶ Run) ================= */

// Tezkor rejim: Telegram xabarlarni darhol Kuvi serveriga (u esa shu skriptga) yuboradi
function webhookUlash() {
  const s = sozlamalar_();
  if (!s.BOT_TOKEN) throw new Error("Sozlamalar varag'ida BOT_TOKEN yo'q");
  tg_(s.BOT_TOKEN, 'setWebhook', {
    url: KUVI_SERVER + '/tg', secret_token: tgSir_(s.BOT_TOKEN), max_connections: 20, drop_pending_updates: false,
    allowed_updates: ['message', 'callback_query', 'business_connection', 'business_message']
  });
  PropertiesService.getScriptProperties().setProperty('WEBHOOK', 'ha');
  jurnal_('', 'Tezkor rejim yoqildi', 'xabarlar Kuvi serveri orqali darhol keladi');
  const w = tg_(s.BOT_TOKEN, 'getWebhookInfo', {});
  Logger.log('✅ Tezkor rejim yoqildi: ' + w.url + ' (kutayotgan xabarlar: ' + (w.pending_update_count || 0) + ')');
}

// Eski rejim: har daqiqada poll() tekshiradi
function webhookOchir() {
  const s = sozlamalar_();
  tg_(s.BOT_TOKEN, 'deleteWebhook', { drop_pending_updates: false });
  PropertiesService.getScriptProperties().deleteProperty('WEBHOOK');
  jurnal_('', 'Tezkor rejim o\'chirildi', 'har daqiqada tekshiradi');
  Logger.log('⏹ Tezkor rejim o\'chirildi — bot har daqiqada xabarlarni tekshiradi.');
}

// har 10 daqiqada: webhook joyidami? (kimdir o'chirib qo'ygan bo'lsa — eski rejimga qaytamiz)
function webhookTekshir_(token, props) {
  const m = Math.floor(new Date().getTime() / 600000);
  if (props.getProperty('WEBHOOK_TEK') === String(m)) return;
  props.setProperty('WEBHOOK_TEK', String(m));
  try {
    const w = tg_(token, 'getWebhookInfo', {});
    if (!w.url) { props.deleteProperty('WEBHOOK'); jurnal_('', 'Tezkor rejim topilmadi', 'har daqiqada tekshirishga qaytildi'); return; }
    if (w.last_error_date && new Date().getTime() / 1000 - w.last_error_date < 600) {
      const x = String(w.last_error_message || '');
      if (props.getProperty('WEBHOOK_XATO') !== x) { props.setProperty('WEBHOOK_XATO', x); jurnal_('XATO', 'Webhook: ' + x, ''); }
    }
  } catch (e) {}
}

function kuviSinov() {
  const s = sozlamalar_();
  const t0 = new Date().getTime();
  const j = kuviSora_([{ role: 'user', content: '2x² − 5x + 2 = 0 tenglamani yech' }], { daraja: 2, qosh: s.KUVI_QOSHIMCHA || '' });
  Logger.log('⏱ ' + Math.round((new Date().getTime() - t0) / 1000) + ' s, model: ' + j.model);
  Logger.log('JAVOB:\n' + j.text);
  Logger.log('FIKRLASH:\n' + (j.fikr || '').slice(0, 1500));
  Logger.log('TELEGRAM (' + (j.tg || []).length + ' bo\'lak):\n' + (j.tg || []).join('\n---\n').slice(0, 3000));
}

/* ================= Sozlamalar varag'iga Kuvi qatorlari (bir marta) ================= */

function migratsiyaKuvi_() {
  const p = PropertiesService.getScriptProperties();
  if (p.getProperty('KUVI_MIGRATSIYA') === KUVI_MIGRATSIYA) return;
  const sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Sozlamalar');
  const mavjud = sh.getRange(2, 1, Math.max(sh.getLastRow() - 1, 1), 1).getDisplayValues().map(function (r) { return String(r[0]).trim(); });
  const qosh = function (k, v, izoh) { if (mavjud.indexOf(k) >= 0) return; sh.appendRow([k, v, izoh || '']); mavjud.push(k); };
  qosh('KUVI_YOQILGAN', 'HA', 'Botga (@kuvonch_agent_bot) yozganlarga Kuvi AI javob beradi');
  qosh('KUVI_BIZNES', 'HA', 'Siz band paytingizda shaxsiy chatingizda savol berishsa, Kuvi ham javob beradi');
  qosh('KUVI_KUNLIK', '30', 'Bir kishiga kuniga nechta savol (siz — cheksiz)');
  qosh('KUVI_CHUQUR', '5', "Shundan nechtasi «to'liq chuqur o'ylash» (yechim → tekshiruv)");
  qosh('KUVI_ADMINLAR', '', 'Cheksiz foydalanadigan Telegram ID lar (vergul bilan)');
  qosh('KUVI_QOSHIMCHA', '', "Kuvi'ga qo'shimcha ko'rsatma (ixtiyoriy)");
  qosh('KURS_TUGMALAR', "YO'Q", "HA — agent salomida kurs/guruh tugmalari ham chiqadi (reklama). YO'Q — chiqmaydi, faqat so'rasa");
  p.setProperty('KUVI_MIGRATSIYA', KUVI_MIGRATSIYA);
  jurnal_('', 'Kuvi AI qo\'shildi', 'Sozlamalar: KUVI_* qatorlari');
}
