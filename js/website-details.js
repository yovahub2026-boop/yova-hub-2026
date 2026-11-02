/* ===================================
   Yova-Hub — Website Details (Supabase)
   =================================== */

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function showError() {
  const loading = document.getElementById('detailsLoading');
  const error = document.getElementById('detailsError');
  const content = document.getElementById('detailsContent');
  if (loading) loading.hidden = true;
  if (content) content.hidden = true;
  if (error) error.hidden = false;
}

function showContent() {
  const loading = document.getElementById('detailsLoading');
  const error = document.getElementById('detailsError');
  const content = document.getElementById('detailsContent');
  if (loading) loading.hidden = true;
  if (error) error.hidden = true;
  if (content) content.hidden = false;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || '';
}

function renderGallery(gallery) {
  const galleryEl = document.getElementById('websiteGallery');
  if (!galleryEl) return;
  galleryEl.innerHTML = '';

  if (!gallery || gallery.length === 0) {
    const placeholder = document.createElement('span');
    placeholder.className = 'placeholder-box';
    placeholder.textContent = '[لا توجد صور إضافية]';
    galleryEl.appendChild(placeholder);
    return;
  }

  gallery.forEach((src) => {
    const item = document.createElement('span');
    item.className = 'placeholder-box';
    item.textContent = src;
    galleryEl.appendChild(item);
  });
}

/* ---------- Order Modal ---------- */
function openOrderModal(website) {
  const modal = document.getElementById('orderModal');
  if (!modal) return;

  const idInput = document.getElementById('orderWebsiteId');
  const nameInput = document.getElementById('orderWebsiteName');
  if (idInput) idInput.value = website.id;
  if (nameInput) nameInput.value = website.name;

  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  const status = document.getElementById('orderStatus');
  if (status) {
    status.textContent = '';
    status.className = 'form-status';
  }

  const firstField = document.getElementById('orderName');
  if (firstField) firstField.focus();
}

function closeOrderModal() {
  const modal = document.getElementById('orderModal');
  if (!modal) return;
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function setFieldError(fieldId, message) {
  const el = document.getElementById(fieldId);
  if (el) el.textContent = message || '';
}

function validateOrderForm(data) {
  const errors = {};
  if (!isNotEmpty(data.name)) errors.orderErrorName = 'الاسم مطلوب.';
  if (!isNotEmpty(data.phone)) {
    errors.orderErrorPhone = 'رقم الهاتف مطلوب.';
  } else if (!isValidPhone(data.phone)) {
    errors.orderErrorPhone = 'رقم الهاتف غير صحيح.';
  }
  if (!isNotEmpty(data.business)) errors.orderErrorBusiness = 'اسم النشاط التجاري مطلوب.';
  if (!isNotEmpty(data.preferred_contact)) errors.orderErrorPreferredContact = 'طريقة التواصل مطلوبة.';
  if (!isNotEmpty(data.description)) errors.orderErrorDesc = 'وصف الاحتياجات مطلوب.';
  return errors;
}

async function handleOrderSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const data = {
    name: form.querySelector('#orderName').value.trim(),
    phone: form.querySelector('#orderPhone').value.trim(),
    business: form.querySelector('#orderBusiness').value.trim(),
    preferred_contact: form.querySelector('#orderPreferredContact').value,
    description: form.querySelector('#orderDesc').value.trim(),
    website_id: form.querySelector('#orderWebsiteId').value,
    website_name: form.querySelector('#orderWebsiteName').value
  };

  ['orderErrorName', 'orderErrorPhone', 'orderErrorBusiness', 'orderErrorPreferredContact', 'orderErrorDesc']
    .forEach((id) => setFieldError(id, ''));

  const status = document.getElementById('orderStatus');
  const submitBtn = document.getElementById('orderSubmit');
  const errors = validateOrderForm(data);

  if (Object.keys(errors).length > 0) {
    Object.entries(errors).forEach(([id, msg]) => setFieldError(id, msg));
    if (status) {
      status.textContent = 'يرجى تصحيح الحقول المطلوبة.';
      status.className = 'form-status error';
    }
    return;
  }

  // حفظ الطلب في Supabase
  if (submitBtn) submitBtn.disabled = true;
  if (status) {
    status.textContent = 'جارٍ إرسال الطلب...';
    status.className = 'form-status';
  }

  try {
    await createOrder(data);
    if (status) {
      status.textContent = 'تم استلام طلبك بنجاح! سنتواصل معك قريباً.';
      status.className = 'form-status success';
    }
    form.reset();
  } catch (error) {
    console.error('خطأ في حفظ الطلب:', error);
    if (status) {
      status.textContent = 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.';
      status.className = 'form-status error';
    }
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', async () => {
  const loading = document.getElementById('detailsLoading');
  if (loading) loading.hidden = false;

  const id = getQueryParam('id');

  if (!id) {
    showError();
    return;
  }

  try {
    const website = await getWebsiteById(id);

    if (!website) {
      showError();
      return;
    }

    setText('websiteName', website.name);
    setText('websiteDesc', website.description);
    setText('breadcrumbName', website.name);

    // جلب التصنيف
    if (website.category_id) {
      const cats = await getCategories();
      const cat = cats.find(c => c.id === website.category_id);
      if (cat) setText('websiteCategory', cat.name);
    }

    const coverEl = document.querySelector('.details-cover .placeholder-box');
    if (coverEl) coverEl.textContent = website.cover_image || '[أضف صورة الغلاف هنا]';

    renderGallery(website.gallery || []);

    // رابط المعاينة
    const previewLink = document.getElementById('previewLink');
    if (previewLink) {
      if (website.preview_url && website.preview_url.startsWith('http')) {
        previewLink.href = website.preview_url;
        previewLink.target = '_blank';
        previewLink.rel = 'noopener noreferrer';
      } else {
        previewLink.href = '#';
        previewLink.addEventListener('click', (e) => {
          e.preventDefault();
          alert('رابط المعاينة غير متوفر حالياً.');
        });
      }
    }

    document.title = `${website.name} | Yova-Hub`;
    showContent();

    // Modal controls
    const orderBtn = document.getElementById('orderWebsiteBtn');
    const closeBtn = document.getElementById('orderModalClose');
    const overlay = document.getElementById('orderModalOverlay');
    const orderForm = document.getElementById('orderForm');

    if (orderBtn) orderBtn.addEventListener('click', () => openOrderModal(website));
    if (closeBtn) closeBtn.addEventListener('click', closeOrderModal);
    if (overlay) overlay.addEventListener('click', closeOrderModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeOrderModal(); });
    if (orderForm) orderForm.addEventListener('submit', handleOrderSubmit);

  } catch (error) {
    console.error('خطأ في جلب تفاصيل الموقع:', error);
    showError();
  }
});