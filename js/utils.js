/* ===================================
   Yova-Hub — Utilities
   =================================== */

/**
 * يهرّب النصوص لمنع إدخال HTML/JS ضارة.
 * استخدمها قبل أي عرض لبيانات المستخدم في DOM.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * تحقق من صحة البريد الإلكتروني.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).trim());
}

/**
 * تحقق من صحة رقم الهاتف (أرقام + رموز بسيطة، 7-15 رقم).
 * @param {string} phone
 * @returns {boolean}
 */
function isValidPhone(phone) {
  if (!phone) return false;
  const cleaned = String(phone).replace(/[\s\-()]/g, '');
  return /^\+?\d{7,15}$/.test(cleaned);
}

/**
 * تحقق من أن النص غير فارغ بعد trim.
 * @param {string} str
 * @returns {boolean}
 */
function isNotEmpty(str) {
  return typeof str === 'string' && str.trim().length > 0;
}

/**
 * يحول النص إلى شكل آمن للعرض داخل HTML.
 * @param {string} str
 * @returns {string}
 */
function safeText(str) {
  return escapeHtml(str);
}

// تصدير للاستخدام في بيئة اختبار (احتياطي)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { escapeHtml, isValidEmail, isValidPhone, isNotEmpty, safeText };
}