/**
 * ==========================================================================
 * 專案名稱：50嵐 智慧團購點餐系統 (Smart Boba Order System)
 * 版本：v3.0 (全方位現代化・多品項購物車・主揪彙總・GitHub Pages & GAS 雙向相容版)
 * 檔案說明：提供 Web App 點餐前台介面、自動寫入 Google 試算表、
 *           意見回饋通報 (Email & LINE Webhook 官方推播)、跨域 CORS API。
 * ==========================================================================
 */

const CONFIG = {
  APP_NAME: '50嵐 智慧團購點餐系統',
  ORDER_SHEET: '訂單明細',
  FEEDBACK_SHEET: '意見回饋',
  EMAIL_TO: 'sales02@yongtek.com',
  TIMEZONE: 'Asia/Taipei',
  PROP_SPREADSHEET_ID: 'SPREADSHEET_ID',
  PROP_LINE_TOKEN: 'LINE_CHANNEL_ACCESS_TOKEN',
  PROP_LINE_USER_ID: 'LINE_NOTIFY_USER_ID'
};

const MENU = [
  // 原茶系列
  { id: 't1', name: '四季春青茶', priceM: 35, priceL: 40, category: '原茶', tag: '回甘首選', desc: '清新甘甜，尾韻回甘無比' },
  { id: 't2', name: '茉莉綠茶', priceM: 35, priceL: 40, category: '原茶', tag: '清爽解膩', desc: '帶有優雅茉莉花香' },
  { id: 't3', name: '阿薩姆紅茶', priceM: 35, priceL: 40, category: '原茶', tag: '茶香濃郁', desc: '醇厚麥芽茶香，經典風味' },
  { id: 't4', name: '黃金烏龍', priceM: 35, priceL: 40, category: '原茶', tag: '炭焙茶香', desc: '獨特焙火香氣，喉韻溫潤' },

  // 經典奶茶
  { id: 'm1', name: '波霸奶茶', priceM: 55, priceL: 60, category: '奶茶', tag: '🔥人氣 No.1', desc: '大顆大波霸，Q彈嚼勁十足' },
  { id: 'm2', name: '珍珠奶茶', priceM: 60, priceL: 65, category: '奶茶', tag: '經典招牌', desc: '小珍珠細緻滑順，口口滿足' },
  { id: 'm3', name: '50嵐奶茶', priceM: 50, priceL: 55, category: '奶茶', tag: '經典回味', desc: '最正宗的厚奶香回憶' },
  { id: 'm4', name: '混珠奶茶', priceM: 55, priceL: 60, category: '奶茶', tag: '雙重口感', desc: '大波霸加小珍珠，雙重嚼感一次享有' },
  { id: 'm5', name: '椰果奶茶', priceM: 50, priceL: 55, category: '奶茶', tag: '酸甜微脆', desc: '酸甜椰果與濃郁奶香的絕配' },
  { id: 'm6', name: '四季春奶茶', priceM: 50, priceL: 55, category: '奶茶', tag: '茶韻奶香', desc: '四季春茶底與香濃奶精交織' },

  // 純鮮奶拿鐵
  { id: 'l1', name: '紅茶拿鐵', priceM: 65, priceL: 70, category: '拿鐵', tag: '100%純鮮奶', desc: '阿薩姆紅茶融合優質純鮮乳' },
  { id: 'l2', name: '波霸紅茶拿鐵', priceM: 70, priceL: 75, category: '拿鐵', tag: '極致享受', desc: '鮮奶茶加 Q 彈波霸，奢華口感' },
  { id: 'l3', name: '綠茶拿鐵', priceM: 65, priceL: 70, category: '拿鐵', tag: '清新乳香', desc: '清雅綠茶與濃郁鮮奶相遇' },
  { id: 'l4', name: '烏龍拿鐵', priceM: 65, priceL: 70, category: '拿鐵', tag: '濃韻厚醇', desc: '烏龍焙香搭配鮮奶更顯層次' },

  // 鎮店之寶 / 口感系列
  { id: 's1', name: '1號 (四季春+珍波椰)', priceM: 45, priceL: 55, category: '招牌', tag: '👑 鎮店靈魂', desc: '50嵐傳奇招牌！四季春青茶加珍波椰滿杯料' },
  { id: 's2', name: '波霸鮮奶', priceM: 75, priceL: 85, category: '招牌', tag: '濃純無茶', desc: '整杯純鮮奶不加一滴水，搭滿滿波霸' },
  { id: 's3', name: '燕麥紅茶拿鐵', priceM: 70, priceL: 75, category: '招牌', tag: '膳食纖維', desc: '飽足滿分，嚴選燕麥健康嚼感' },

  // 鮮果與特調
  { id: 'f1', name: '冰淇淋紅茶', priceM: 50, priceL: 60, category: '特調', tag: '沁涼甜蜜', desc: '大球香草冰淇淋慢慢融化於紅茶中' },
  { id: 'f2', name: '檸檬青茶', priceM: 55, priceL: 65, category: '特調', tag: '酸爽消暑', desc: '現榨檸檬原汁與四季春青茶' },
  { id: 'f3', name: '梅果綠茶', priceM: 50, priceL: 60, category: '特調', tag: '酸甜開胃', desc: '特選話梅醃漬果露融入茉莉綠茶' },
  { id: 'f4', name: '金桔檸檬', priceM: 55, priceL: 65, category: '特調', tag: '維他命C', desc: '金桔清香與檸檬酸甜生津止渴' },
  { id: 'f5', name: '多多綠茶', priceM: 55, priceL: 65, category: '特調', tag: '童年經典', desc: '養樂多搭配高山綠茶，酸甜好滋味' }
];

/**
 * Web App 入口點：提供最新優化版點餐系統介面
 */
function doGet(e) {
  ensureSystem_();

  // 若帶有 API 查詢參數，則返回 JSON 資料
  if (e && e.parameter && e.parameter.action === 'getMenu') {
    return jsonOutput_({ success: true, menu: MENU });
  }
  if (e && e.parameter && e.parameter.action === 'getStatus') {
    return jsonOutput_({ success: true, status: getSystemStatus() });
  }

  // 優先載入專案中的 HTML 檔案 (若有 index 或 order system final)
  try {
    return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('50嵐 智慧團購點餐系統')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
  } catch (e1) {
    try {
      return HtmlService.createTemplateFromFile('order system final')
        .evaluate()
        .setTitle('50嵐 智慧團購點餐系統')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
    } catch (e2) {
      return HtmlService.createHtmlOutput(getInlineHtml_())
        .setTitle('50嵐 智慧團購點餐系統')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
    }
  }
}

/**
 * 處理 POST 請求：支援 LINE Bot Webhook 與前端跨域 JSON 提交 (GitHub Pages 支援)
 */
function doPost(e) {
  try {
    const rawBody = e && e.postData && e.postData.contents ? e.postData.contents : '';
    if (!rawBody) return jsonOutput_({ ok: true, ignored: 'empty body' });

    let data = {};
    try {
      data = JSON.parse(rawBody);
    } catch (err) {
      // 支援 urlencoded
      data = e.parameter || {};
    }

    // 1. 若為 LINE OA Webhook 推播事件
    if (Array.isArray(data.events)) {
      return handleLineEvents_(data.events);
    }

    // 2. 若為前端直接透過 fetch POST 呼叫
    const action = data.action || (e && e.parameter && e.parameter.action);

    if (action === 'submitOrderBatch') {
      const res = submitOrderBatch(data);
      return jsonOutput_(res);
    }

    if (action === 'submitOrder') {
      const res = submitOrder(data);
      return jsonOutput_(res);
    }

    if (action === 'submitFeedback') {
      const res = submitFeedback(data);
      return jsonOutput_(res);
    }

    // 預設若直接帶有 department 與 items / drink，則自動解析
    if (data.items && Array.isArray(data.items)) {
      return jsonOutput_(submitOrderBatch(data));
    }
    if (data.drink) {
      return jsonOutput_(submitOrder(data));
    }
    if (data.feedback) {
      return jsonOutput_(submitFeedback(data));
    }

    return jsonOutput_({ ok: true, message: 'Action not specified' });
  } catch (err) {
    console.error(err);
    return jsonOutput_({ ok: false, error: String(err.message || err) });
  }
}

function handleLineEvents_(events) {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty(CONFIG.PROP_LINE_TOKEN);

  events.forEach(function(event) {
    const source = event.source || {};
    const userId = source.userId || '';
    const text = event.message && event.message.type === 'text' ? String(event.message.text || '').trim() : '';

    if (userId && (event.type === 'follow' || text === '綁定通知' || text.toLowerCase() === 'bind')) {
      props.setProperty(CONFIG.PROP_LINE_USER_ID, userId);
      if (token && event.replyToken) {
        replyLine_(event.replyToken, '✅ 已完成 50嵐團購通知綁定！之後系統收到負面反饋或重要通知時，會即時通報此帳號。');
      }
    }
  });

  return jsonOutput_({ ok: true });
}

function setupSystem() {
  const ss = ensureSystem_();
  Logger.log('Google Sheet URL: ' + ss.getUrl());
  Logger.log('Spreadsheet ID: ' + ss.getId());
  return { spreadsheetUrl: ss.getUrl(), spreadsheetId: ss.getId() };
}

function getSystemStatus() {
  const ss = ensureSystem_();
  const props = PropertiesService.getScriptProperties();
  return {
    spreadsheetUrl: ss.getUrl(),
    spreadsheetId: ss.getId(),
    lineTokenConfigured: !!props.getProperty(CONFIG.PROP_LINE_TOKEN),
    lineUserConfigured: !!props.getProperty(CONFIG.PROP_LINE_USER_ID),
    emailTo: CONFIG.EMAIL_TO
  };
}

function getMenu() {
  return MENU.map(function(item) { return Object.assign({}, item); });
}

/**
 * 批次寫入多杯飲料訂單 (購物車整單送出)
 */
function submitOrderBatch(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('沒有收到訂單資料。');

  const department = cleanText_(payload.department, 50);
  const name = cleanText_(payload.name, 50);
  const items = Array.isArray(payload.items) ? payload.items : [payload];

  if (!department) throw new Error('請選擇部門。');
  if (!name) throw new Error('請填寫姓名。');
  if (items.length === 0) throw new Error('訂單內無任何飲品品項。');

  const ss = ensureSystem_();
  const sheet = ss.getSheetByName(CONFIG.ORDER_SHEET);
  const now = new Date();
  const rows = [];
  let totalOrderAmount = 0;

  items.forEach(function(item) {
    const drink = cleanText_(item.drink, 100);
    const size = cleanText_(item.size, 10);
    const sugar = cleanText_(item.sugar, 30);
    const ice = cleanText_(item.ice, 30);
    const topping = cleanText_(item.topping || '無', 50);
    const quantity = parseInt(item.quantity || 1, 10);
    const price = parseInt(item.price || item.totalPrice || 0, 10);
    const note = cleanText_(item.note || payload.note || '', 200);

    const subtotal = price * quantity;
    totalOrderAmount += subtotal;

    for (let i = 0; i < quantity; i++) {
      rows.push([
        now,
        safeCell_(department),
        safeCell_(name),
        safeCell_(drink),
        safeCell_(size),
        safeCell_(sugar),
        safeCell_(ice),
        safeCell_(topping),
        price,
        safeCell_(note)
      ]);
    }
  });

  if (rows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 10).setValues(rows);
  }

  return {
    success: true,
    message: '整單已成功寫入 Google 試算表！',
    count: rows.length,
    totalPrice: totalOrderAmount,
    spreadsheetUrl: ss.getUrl()
  };
}

/**
 * 單筆寫入訂單
 */
function submitOrder(data) {
  return submitOrderBatch({
    department: data.department,
    name: data.name,
    items: [{
      drink: data.drink,
      size: data.size,
      sugar: data.sugar,
      ice: data.ice,
      topping: data.topping,
      price: data.price || data.totalPrice,
      quantity: 1,
      note: data.note
    }]
  });
}

function submitFeedback(data) {
  if (!data || typeof data !== 'object') throw new Error('沒有收到意見回饋資料。');

  const department = cleanText_(data.department, 50);
  const name = cleanText_(data.name, 50);
  const rating = data.rating ? parseInt(data.rating, 10) + ' 星' : '未評分';
  const category = cleanText_(data.category || '其他', 50);
  const feedback = cleanText_(data.feedback, 1000);

  if (!department) throw new Error('請選擇部門。');
  if (!name) throw new Error('請填寫姓名。');
  if (!feedback) throw new Error('請填寫意見內容。');

  const negative = isNegativeFeedback_(category, feedback);
  const ss = ensureSystem_();
  const sheet = ss.getSheetByName(CONFIG.FEEDBACK_SHEET);

  sheet.appendRow([
    new Date(), safeCell_(department), safeCell_(name), safeCell_(category),
    safeCell_(rating + ' - ' + feedback),
    negative ? '⚠️ 負面意見' : '一般意見', '待處理', negative ? '待處理' : '－'
  ]);
  const row = sheet.getLastRow();

  let emailStatus = '✅ 已寄出';
  try {
    sendFeedbackEmail_({ department, name, category, rating, feedback, negative, spreadsheetUrl: ss.getUrl() });
  } catch (err) {
    emailStatus = '❌ ' + String(err.message || err).slice(0, 180);
  }
  sheet.getRange(row, 7).setValue(emailStatus);

  let lineStatus = '－';
  if (negative) {
    try {
      sendLineMessage_({ department, name, category, rating, feedback, spreadsheetUrl: ss.getUrl() });
      lineStatus = '✅ 已通知';
    } catch (err) {
      lineStatus = '❌ ' + String(err.message || err).slice(0, 180);
    }
    sheet.getRange(row, 8).setValue(lineStatus);
  }

  return {
    success: true,
    negative: negative,
    message: negative ? '意見已送出，並已啟動主管與負責人即時通報。' : '感謝您的寶貴回饋，我們將持續優化！',
    emailStatus: emailStatus,
    lineStatus: lineStatus,
    spreadsheetUrl: ss.getUrl()
  };
}

function ensureSystem_() {
  const props = PropertiesService.getScriptProperties();
  let ss = null;
  const savedId = props.getProperty(CONFIG.PROP_SPREADSHEET_ID);

  if (savedId) {
    try { ss = SpreadsheetApp.openById(savedId); } catch (e) { ss = null; }
  }

  if (!ss) {
    try { ss = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) { ss = null; }
  }

  if (!ss) {
    ss = SpreadsheetApp.create(CONFIG.APP_NAME);
  }

  props.setProperty(CONFIG.PROP_SPREADSHEET_ID, ss.getId());
  ensureOrderSheet_(ss);
  ensureFeedbackSheet_(ss);
  return ss;
}

function ensureOrderSheet_(ss) {
  let sheet = ss.getSheetByName(CONFIG.ORDER_SHEET);
  if (!sheet) sheet = ss.insertSheet(CONFIG.ORDER_SHEET);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 10).setValues([[
      '訂購時間', '部門', '姓名', '飲料品項', '尺寸', '甜度', '冰量', '加料', '單價', '備註'
    ]]);
    formatHeader_(sheet, 10);
    sheet.getRange('A:A').setNumberFormat('yyyy/mm/dd hh:mm:ss');
  }
}

function ensureFeedbackSheet_(ss) {
  let sheet = ss.getSheetByName(CONFIG.FEEDBACK_SHEET);
  if (!sheet) sheet = ss.insertSheet(CONFIG.FEEDBACK_SHEET);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 8).setValues([[
      '送出時間', '部門', '姓名', '回饋分類', '意見內容與滿意度', '系統判定', 'Email狀態', 'LINE狀態'
    ]]);
    formatHeader_(sheet, 8);
    sheet.getRange('A:A').setNumberFormat('yyyy/mm/dd hh:mm:ss');
    sheet.setColumnWidth(5, 420);
  }
}

function formatHeader_(sheet, columns) {
  sheet.getRange(1, 1, 1, columns)
    .setFontWeight('bold')
    .setBackground('#0A5C36')
    .setFontColor('#FFFFFF')
    .setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
}

function sendFeedbackEmail_(data) {
  const subject = data.negative ? '⚠️【50嵐團購】負面意見緊急通報' : '【50嵐團購】同仁意見回饋通知';
  const body = [
    '50嵐飲料團購系統收到同仁回饋：', '',
    '部門：' + data.department,
    '姓名：' + data.name,
    '滿意度評分：' + (data.rating || '未評分'),
    '分類：' + data.category,
    '系統判定：' + (data.negative ? '⚠️ 負面意見 (需即刻關心)' : '一般建議'), '',
    '意見內容：', data.feedback, '',
    'Google 試算表連結：', data.spreadsheetUrl
  ].join('\n');

  MailApp.sendEmail({
    to: CONFIG.EMAIL_TO,
    subject: subject,
    body: body,
    name: CONFIG.APP_NAME
  });
}

function isNegativeFeedback_(category, feedback) {
  const text = (String(category || '') + ' ' + String(feedback || '')).toLowerCase();
  const keywords = [
    '太甜','太淡','太酸','太苦','太澀','不好喝','難喝','有異味','味道怪','味道不對',
    '冰太多','太冰','不夠冰','錯單','漏單','送錯','做錯','少一杯','少了','沒收到','沒有收到',
    '品質不好','品質差','不新鮮','壞掉','無法使用','不能使用','無法送出','不能送出',
    '錯誤','失敗','當機','bug','不滿','不滿意','很差','太差','糟糕','抱怨','投訴','客訴'
  ];
  return keywords.some(function(k) { return text.includes(k.toLowerCase()); });
}

function sendLineMessage_(data) {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty(CONFIG.PROP_LINE_TOKEN);
  const userId = props.getProperty(CONFIG.PROP_LINE_USER_ID);

  if (!token) throw new Error('尚未設定 LINE_CHANNEL_ACCESS_TOKEN');
  if (!userId) throw new Error('尚未完成 LINE 收件人綁定，請對官方帳號傳送「綁定通知」。');

  const text = [
    '⚠️ 50嵐團購客訴通報', '',
    '部門：' + data.department,
    '姓名：' + data.name,
    '評分：' + (data.rating || '未評分'),
    '分類：' + data.category, '',
    '內容：', data.feedback, '',
    '試算表：', data.spreadsheetUrl
  ].join('\n');

  const response = UrlFetchApp.fetch('https://api.line.me/v2/bot/message/push', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    payload: JSON.stringify({ to: userId, messages: [{ type: 'text', text: text }] }),
    muteHttpExceptions: true
  });

  const code = response.getResponseCode();
  if (code < 200 || code >= 300) {
    throw new Error('LINE API HTTP ' + code + '：' + response.getContentText());
  }
}

function replyLine_(replyToken, text) {
  const token = PropertiesService.getScriptProperties().getProperty(CONFIG.PROP_LINE_TOKEN);
  if (!token) return;
  UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    payload: JSON.stringify({ replyToken: replyToken, messages: [{ type: 'text', text: text }] }),
    muteHttpExceptions: true
  });
}

function cleanText_(value, maxLength) {
  return String(value == null ? '' : value).trim().slice(0, maxLength);
}

function safeCell_(value) {
  const text = String(value == null ? '' : value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getInlineHtml_() {
  return '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>50嵐智慧點餐系統</title></head><body>'
    + '<p style="font-family:sans-serif;text-align:center;padding:40px;">請載入 index.html 檔案以開啟最新版時尚點餐介面！</p>'
    + '</body></html>';
}
