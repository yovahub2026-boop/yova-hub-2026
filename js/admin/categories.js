/* ===================================
   Yova-Hub — Admin Categories Logic (Supabase)
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    onAuthChange(async (user) => {
        if (!user) return window.location.href = 'login.html';
        const isAdmin = await isCurrentUserAdmin();
        if (!isAdmin) return window.location.href = '../index.html';
        loadCategories();
    });

    document.getElementById('logoutBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        await logoutAdmin();
        window.location.href = 'login.html';
    });

    const table = document.getElementById('categoriesTable');
    const modal = document.getElementById('categoryModal');
    const form = document.getElementById('categoryForm');
    const modalTitle = document.getElementById('categoryModalTitle');
    const statusEl = document.getElementById('categoryStatus');

    document.getElementById('addCategoryBtn').addEventListener('click', () => {
        form.reset();
        document.getElementById('categoryId').value = '';
        modalTitle.textContent = 'إضافة تصنيف جديد';
        statusEl.textContent = '';
        modal.hidden = false;
        document.body.classList.add('modal-open');
    });

    const closeModal = () => {
        modal.hidden = true;
        document.body.classList.remove('modal-open');
    };
    document.getElementById('closeCategoryModal').addEventListener('click', closeModal);
    document.getElementById('categoryModalOverlay').addEventListener('click', closeModal);

    async function loadCategories() {
        try {
            const categories = await getCategories();
            table.innerHTML = '';

            if (categories.length === 0) {
                table.innerHTML = '<tr><td colspan="3" style="text-align:center;">لا توجد تصنيفات.</td></tr>';
                return;
            }

            categories.forEach(cat => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
          <td>${cat.name}</td>
          <td>${cat.id}</td>
          <td class="actions">
            <button class="btn-icon edit-btn" data-id="${cat.id}" data-name="${cat.name}">تعديل</button>
            <button class="btn-icon delete delete-btn" data-id="${cat.id}">حذف</button>
          </td>
        `;
                table.appendChild(tr);
            });

            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    const name = e.target.dataset.name;
                    document.getElementById('categoryId').value = id;
                    document.getElementById('categoryName').value = name;
                    modalTitle.textContent = 'تعديل التصنيف';
                    statusEl.textContent = '';
                    modal.hidden = false;
                    document.body.classList.add('modal-open');
                });
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.dataset.id;
                    if (confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
                        try {
                            await deleteCategory(id);
                            loadCategories();
                        } catch (error) {
                            alert('حدث خطأ أثناء الحذف: ' + error.message);
                        }
                    }
                });
            });

        } catch (error) {
            console.error(error);
            table.innerHTML = '<tr><td colspan="3" style="text-align:center;color:red;">حدث خطأ في تحميل البيانات.</td></tr>';
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('categoryId').value;
        const name = document.getElementById('categoryName').value.trim();

        if (!name) return;

        const btn = document.getElementById('saveCategoryBtn');
        btn.disabled = true;
        statusEl.textContent = 'جارٍ الحفظ...';
        statusEl.className = 'form-status';

        try {
            if (id) {
                await updateCategory(id, { name });
            } else {
                await createCategory({ name });
            }
            closeModal();
            loadCategories();
        } catch (error) {
            console.error(error);
            statusEl.textContent = 'حدث خطأ أثناء الحفظ.';
            statusEl.className = 'form-status error';
        } finally {
            btn.disabled = false;
        }
    });
});