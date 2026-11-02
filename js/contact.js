/* ===================================
   Yova-Hub — Contact Form (Supabase)
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const statusEl = document.getElementById('contactStatus');
  const submitBtn = document.getElementById('contactSubmit');

  function setFieldError(fieldId, message) {
    const el = document.getElementById(fieldId);
    if (el) el.textContent = message || '';
  }

  function validate(data) {
    const errors = {};
    if (!isNotEmpty(data.name)) errors.errorName = 'الاسم مطلوب.';
    if (!isNotEmpty(data.phone)) {
      errors.errorPhone = 'رقم الهاتف مطلوب.';
    } else if (!isValidPhone(data.phone)) {
      errors.errorPhone = 'رقم الهاتف غير صحيح.';
    }
    if (!isNotEmpty(data.message)) errors.errorMessage = 'الرسالة مطلوبة.';
    return errors;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById('contactName').value.trim(),
      phone: document.getElementById('contactPhone').value.trim(),
      message: document.getElementById('contactMessage').value.trim()
    };

    ['errorName', 'errorPhone', 'errorMessage'].forEach((id) => setFieldError(id, ''));
    if (statusEl) {
      statusEl.textContent = '';
      statusEl.className = 'form-status';
    }

    const errors = validate(data);

    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([id, msg]) => setFieldError(id, msg));
      if (statusEl) {
        statusEl.textContent = 'يرجى تصحيح الحقول المطلوبة.';
        statusEl.className = 'form-status error';
      }
      return;
    }

    if (submitBtn) submitBtn.disabled = true;
    if (statusEl) {
      statusEl.textContent = 'جارٍ إرسال الرسالة...';
      statusEl.className = 'form-status';
    }

    try {
      // حفظ الرسالة في Supabase
      await createMessage(data);

      if (statusEl) {
        statusEl.textContent = 'تم إرسال رسالتك بنجاح! شكراً لتواصلك.';
        statusEl.className = 'form-status success';
      }
      form.reset();
    } catch (error) {
      console.error('خطأ في إرسال الرسالة:', error);
      if (statusEl) {
        statusEl.textContent = 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.';
        statusEl.className = 'form-status error';
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
});