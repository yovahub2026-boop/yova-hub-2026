/* ===================================
   Yova-Hub — Admin Dashboard Logic (Supabase)
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. حماية الصفحة
    onAuthChange(async (user) => {
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        const isAdmin = await isCurrentUserAdmin();
        if (!isAdmin) {
            window.location.href = '../index.html';
            return;
        }

        const adminEmailEl = document.getElementById('adminEmail');
        if (adminEmailEl) adminEmailEl.textContent = user.email;

        loadDashboardStats();
    });

    // 2. تسجيل الخروج
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await logoutAdmin();
            window.location.href = 'login.html';
        });
    }

    // 3. دالة تحميل الإحصائيات
    async function loadDashboardStats() {
        try {
            const websites = await getAllWebsites();
            const orders = await getAllOrders();

            document.getElementById('statWebsites').textContent = websites.length;
            document.getElementById('statOrders').textContent = orders.length;

            const newOrdersCount = orders.filter(o => o.status === 'new').length;
            document.getElementById('statNewOrders').textContent = newOrdersCount;

            const recentOrdersTable = document.getElementById('recentOrdersTable');
            recentOrdersTable.innerHTML = '';

            if (orders.length === 0) {
                recentOrdersTable.innerHTML = '<tr><td colspan="4" style="text-align:center;">لا توجد طلبات حتى الآن.</td></tr>';
                return;
            }

            const recent = orders.slice(0, 5);

            recent.forEach(order => {
                let statusText = 'جديد';
                let statusClass = 'status-new';
                if (order.status === 'contacted') { statusText = 'تم التواصل'; statusClass = 'status-contacted'; }
                if (order.status === 'in-progress') { statusText = 'قيد التنفيذ'; statusClass = 'status-in-progress'; }
                if (order.status === 'completed') { statusText = 'مكتمل'; statusClass = 'status-completed'; }
                if (order.status === 'cancelled') { statusText = 'ملغي'; statusClass = 'status-cancelled'; }

                const tr = document.createElement('tr');
                tr.innerHTML = `
          <td>${order.name || '-'}</td>
          <td>${order.phone || '-'}</td>
          <td>${order.website_name || '-'}</td>
          <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        `;
                recentOrdersTable.appendChild(tr);
            });

        } catch (error) {
            console.error('خطأ في تحميل الإحصائيات:', error);
        }
    }
});