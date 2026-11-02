/* ===================================
   Yova-Hub — Admin Orders Logic (Supabase)
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    let allOrders = [];

    onAuthChange(async (user) => {
        if (!user) return window.location.href = 'login.html';
        const isAdmin = await isCurrentUserAdmin();
        if (!isAdmin) return window.location.href = '../index.html';
        loadOrders();
    });

    document.getElementById('logoutBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        await logoutAdmin();
        window.location.href = 'login.html';
    });

    const table = document.getElementById('ordersTable');
    const modal = document.getElementById('orderModal');
    const modalDetails = document.getElementById('orderDetails');

    const closeModal = () => { modal.hidden = true; document.body.classList.remove('modal-open'); };
    document.getElementById('closeOrderModal').addEventListener('click', closeModal);
    document.getElementById('orderModalOverlay').addEventListener('click', closeModal);

    function getStatusBadge(status) {
        if (status === 'new') return '<span class="status-badge status-new">جديد</span>';
        if (status === 'contacted') return '<span class="status-badge status-contacted">تم التواصل</span>';
        if (status === 'in-progress') return '<span class="status-badge status-in-progress">قيد التنفيذ</span>';
        if (status === 'completed') return '<span class="status-badge status-completed">مكتمل</span>';
        if (status === 'cancelled') return '<span class="status-badge status-cancelled">ملغي</span>';
        return status;
    }

    async function loadOrders() {
        try {
            allOrders = await getAllOrders();
            table.innerHTML = '';

            if (allOrders.length === 0) {
                table.innerHTML = '<tr><td colspan="6" style="text-align:center;">لا توجد طلبات.</td></tr>';
                return;
            }

            allOrders.forEach(order => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
          <td>${order.name || '-'}</td>
          <td>${order.phone || '-'}</td>
          <td>${order.business || '-'}</td>
          <td>${order.website_name || '-'}</td>
          <td>${getStatusBadge(order.status)}</td>
          <td class="actions">
            <button class="btn-icon view-btn" data-id="${order.id}">عرض</button>
            <select class="status-select" data-id="${order.id}" style="padding: 0.3rem; border-radius: 4px; border: 1px solid #ccc;">
              <option value="new" ${order.status === 'new' ? 'selected' : ''}>جديد</option>
              <option value="contacted" ${order.status === 'contacted' ? 'selected' : ''}>تم التواصل</option>
              <option value="in-progress" ${order.status === 'in-progress' ? 'selected' : ''}>قيد التنفيذ</option>
              <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>مكتمل</option>
              <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>ملغي</option>
            </select>
            <button class="btn-icon delete delete-btn" data-id="${order.id}">حذف</button>
          </td>
        `;
                table.appendChild(tr);
            });

            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    const order = allOrders.find(o => o.id === id);
                    if (!order) return;

                    modalDetails.innerHTML = `
            <p><strong>الاسم:</strong> ${order.name}</p>
            <p><strong>الهاتف:</strong> ${order.phone}</p>
            <p><strong>النشاط التجاري:</strong> ${order.business}</p>
            <p><strong>الموقع المطلوب:</strong> ${order.website_name}</p>
            <p><strong>طريقة التواصل المفضلة:</strong> ${order.preferred_contact === 'phone' ? 'هاتف' : order.preferred_contact === 'whatsapp' ? 'واتساب' : 'بريد إلكتروني'}</p>
            <p><strong>الوصف:</strong><br> ${order.description}</p>
          `;
                    modal.hidden = false;
                    document.body.classList.add('modal-open');
                });
            });

            document.querySelectorAll('.status-select').forEach(select => {
                select.addEventListener('change', async (e) => {
                    const id = e.target.dataset.id;
                    const newStatus = e.target.value;
                    try {
                        await updateOrderStatus(id, newStatus);
                        loadOrders();
                    } catch (error) {
                        alert('حدث خطأ أثناء تحديث الحالة: ' + error.message);
                    }
                });
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.dataset.id;
                    if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
                        try {
                            await deleteOrder(id);
                            loadOrders();
                        } catch (error) {
                            alert('حدث خطأ أثناء الحذف: ' + error.message);
                        }
                    }
                });
            });

        } catch (error) {
            console.error(error);
            table.innerHTML = '<tr><td colspan="6" style="text-align:center;color:red;">حدث خطأ في تحميل البيانات.</td></tr>';
        }
    }
});