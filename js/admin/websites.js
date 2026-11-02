/* ===================================
   Yova-Hub — Admin Websites Logic (Supabase)
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    let allCategories = [];

    onAuthChange(async (user) => {
        if (!user) return window.location.href = 'login.html';
        const isAdmin = await isCurrentUserAdmin();
        if (!isAdmin) return window.location.href = '../index.html';

        initAdmin();
    });

    document.getElementById('logoutBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        await logoutAdmin();
        window.location.href = 'login.html';
    });

    const table = document.getElementById('websitesTable');
    const modal = document.getElementById('websiteModal');
    const form = document.getElementById('websiteForm');
    const modalTitle = document.getElementById('websiteModalTitle');
    const statusEl = document.getElementById('websiteStatus');
    const categorySelect = document.getElementById('siteCategory');

    async function initAdmin() {
        allCategories = await getCategories();
        categorySelect.innerHTML = '<option value="">اختر التصنيف</option>';
        allCategories.forEach(cat => {
            categorySelect.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
        });

        loadWebsites();
    }

    document.getElementById('addWebsiteBtn').addEventListener('click', () => {
        form.reset();
        document.getElementById('websiteId').value = '';
        document.getElementById('sitePublished').checked = true;
        modalTitle.textContent = 'إضافة موقع جديد';
        statusEl.textContent = '';
        modal.hidden = false;
        document.body.classList.add('modal-open');
    });

    const closeModal = () => {
        modal.hidden = true;
        document.body.classList.remove('modal-open');
    };
    document.getElementById('closeWebsiteModal').addEventListener('click', closeModal);
    document.getElementById('websiteModalOverlay').addEventListener('click', closeModal);

    async function loadWebsites() {
        try {
            const websites = await getAllWebsites();
            table.innerHTML = '';

            if (websites.length === 0) {
                table.innerHTML = '<tr><td colspan="4" style="text-align:center;">لا توجد مواقع مضافة.</td></tr>';
                return;
            }

            websites.forEach(site => {
                const cat = allCategories.find(c => c.id === site.category_id);
                const catName = cat ? cat.name : '-';
                const statusText = site.published ? 'منشور' : 'مخفي';
                const statusClass = site.published ? 'status-completed' : 'status-cancelled';

                const tr = document.createElement('tr');
                tr.innerHTML = `
          <td>${site.name}</td>
          <td>${catName}</td>
          <td><span class="status-badge ${statusClass}">${statusText}</span></td>
          <td class="actions">
            <button class="btn-icon edit-btn" data-id="${site.id}">تعديل</button>
            <button class="btn-icon delete delete-btn" data-id="${site.id}">حذف</button>
          </td>
        `;
                table.appendChild(tr);
            });

            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    const site = websites.find(w => w.id === id);
                    if (!site) return;

                    document.getElementById('websiteId').value = site.id;
                    document.getElementById('siteName').value = site.name || '';
                    document.getElementById('siteCategory').value = site.category_id || '';
                    document.getElementById('siteDesc').value = site.description || '';
                    document.getElementById('sitePreviewUrl').value = site.preview_url || '';
                    document.getElementById('siteCoverImage').value = site.cover_image || '';
                    document.getElementById('sitePublished').checked = site.published !== false;

                    modalTitle.textContent = 'تعديل الموقع';
                    statusEl.textContent = '';
                    modal.hidden = false;
                    document.body.classList.add('modal-open');
                });
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.dataset.id;
                    if (confirm('هل أنت متأكد من حذف هذا الموقع نهائياً؟')) {
                        try {
                            await deleteWebsite(id);
                            loadWebsites();
                        } catch (error) {
                            alert('حدث خطأ أثناء الحذف: ' + error.message);
                        }
                    }
                });
            });

        } catch (error) {
            console.error(error);
            table.innerHTML = '<tr><td colspan="4" style="text-align:center;color:red;">حدث خطأ في تحميل البيانات.</td></tr>';
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('websiteId').value;

        const data = {
            name: document.getElementById('siteName').value.trim(),
            category_id: document.getElementById('siteCategory').value || null,
            description: document.getElementById('siteDesc').value.trim(),
            preview_url: document.getElementById('sitePreviewUrl').value.trim(),
            cover_image: document.getElementById('siteCoverImage').value.trim(),
            published: document.getElementById('sitePublished').checked
        };

        const btn = document.getElementById('saveWebsiteBtn');
        btn.disabled = true;
        statusEl.textContent = 'جارٍ الحفظ...';
        statusEl.className = 'form-status';

        try {
            if (id) {
                await updateWebsite(id, data);
            } else {
                await createWebsite(data);
            }
            closeModal();
            loadWebsites();
        } catch (error) {
            console.error(error);
            statusEl.textContent = 'حدث خطأ أثناء الحفظ.';
            statusEl.className = 'form-status error';
        } finally {
            btn.disabled = false;
        }
    });
});