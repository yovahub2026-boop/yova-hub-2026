/* ===================================
   Yova-Hub — Websites Gallery (Supabase)
   =================================== */

let allWebsites = [];
let allCategories = [];

function buildWebsiteCard(website) {
  const card = document.createElement('article');
  card.className = 'website-card';

  const cover = document.createElement('div');
  cover.className = 'website-cover';
  const coverPlaceholder = document.createElement('span');
  coverPlaceholder.className = 'placeholder-box';
  coverPlaceholder.textContent = website.cover_image || '[أضف صورة الموقع هنا]';
  cover.appendChild(coverPlaceholder);

  const body = document.createElement('div');
  body.className = 'website-card-body';

  const title = document.createElement('h3');
  title.textContent = website.name || '[اكتب اسم الموقع هنا]';

  const category = document.createElement('span');
  category.className = 'badge';
  const cat = allCategories.find(c => c.id === website.category_id);
  category.textContent = cat ? cat.name : '[اسم التصنيف هنا]';

  const desc = document.createElement('p');
  desc.textContent = website.description || '[اكتب وصف الموقع هنا]';

  const actions = document.createElement('div');
  actions.className = 'website-card-actions';

  const previewBtn = document.createElement('a');
  previewBtn.className = 'btn btn-outline btn-sm';
  previewBtn.textContent = 'معاينة الموقع';
  if (website.preview_url && website.preview_url.startsWith('http')) {
    previewBtn.href = website.preview_url;
    previewBtn.target = '_blank';
    previewBtn.rel = 'noopener noreferrer';
  } else {
    previewBtn.href = '#';
    previewBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('رابط المعاينة غير متوفر حالياً.');
    });
  }

  const orderBtn = document.createElement('a');
  orderBtn.className = 'btn btn-primary btn-sm';
  orderBtn.textContent = 'اطلب هذا الموقع';
  orderBtn.href = `website-details.html?id=${encodeURIComponent(website.id)}`;

  actions.appendChild(previewBtn);
  actions.appendChild(orderBtn);
  body.appendChild(title);
  body.appendChild(category);
  body.appendChild(desc);
  body.appendChild(actions);
  card.appendChild(cover);
  card.appendChild(body);
  return card;
}

function renderWebsites(websites) {
  const grid = document.getElementById('websitesGrid');
  const emptyState = document.getElementById('emptyState');
  const loadingState = document.getElementById('loadingState');

  if (!grid) return;
  if (loadingState) loadingState.hidden = true;
  grid.innerHTML = '';

  if (!websites || websites.length === 0) {
    if (emptyState) emptyState.hidden = false;
    return;
  }

  if (emptyState) emptyState.hidden = true;
  const fragment = document.createDocumentFragment();
  websites.forEach((w) => fragment.appendChild(buildWebsiteCard(w)));
  grid.appendChild(fragment);
}

function renderFilterTabs(categories, activeId = 'all') {
  const tabs = document.getElementById('filterTabs');
  if (!tabs) return;
  tabs.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.className = 'filter-tab' + (activeId === 'all' ? ' active' : '');
  allBtn.dataset.category = 'all';
  allBtn.setAttribute('role', 'tab');
  allBtn.setAttribute('aria-selected', String(activeId === 'all'));
  allBtn.textContent = 'الكل';
  tabs.appendChild(allBtn);

  categories.forEach((cat) => {
    const btn = document.createElement('button');
    btn.className = 'filter-tab' + (activeId === cat.id ? ' active' : '');
    btn.dataset.category = cat.id;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', String(activeId === cat.id));
    btn.textContent = cat.name;
    tabs.appendChild(btn);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const loadingState = document.getElementById('loadingState');
  const grid = document.getElementById('websitesGrid');

  if (loadingState) loadingState.hidden = false;

  try {
    allWebsites = await getPublishedWebsites();
    allCategories = await getCategories();

    allWebsites.forEach(w => {
      const cat = allCategories.find(c => c.id === w.category_id);
      if (cat) w.categoryName = cat.name;
    });

    renderFilterTabs(allCategories, 'all');
    renderWebsites(allWebsites);

  } catch (error) {
    console.error('خطأ في جلب المواقع:', error);
    if (loadingState) loadingState.hidden = true;
    if (grid) {
      grid.innerHTML = '<p style="text-align:center;color:red;">حدث خطأ أثناء تحميل المواقع.</p>';
    }
  }

  const tabs = document.getElementById('filterTabs');
  if (tabs) {
    tabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-tab');
      if (!btn) return;

      const category = btn.dataset.category;
      tabs.querySelectorAll('.filter-tab').forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filtered = category === 'all'
        ? allWebsites
        : allWebsites.filter((w) => w.category_id === parseInt(category));

      renderWebsites(filtered);
    });
  }
});