/* ===================================
   Yova-Hub — Admin Messages Logic (Supabase)
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    let allMessages = [];

    onAuthChange(async (user) => {
        if (!user) return window.location.href = 'login.html';
        const isAdmin = await isCurrentUserAdmin();
        if (!isAdmin) return window.location.href = '../index.html';
        loadMessages();
    });

    document.getElementById('logoutBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        await logoutAdmin();
        window.location.href = 'login.html';
    });

    const table = document.getElementById('messagesTable');
    const modal = document.getElementById('messageModal');
    const modalDetails = document.getElementById('messageDetails');

    const closeModal = () => { modal.hidden = true; document.body.classList.remove('modal-open'); };
    document.getElementById('closeMessageModal').addEventListener('click', closeModal);
    document.getElementById('messageModalOverlay').addEventListener('click', closeModal);

    async function loadMessages() {
        try {
            allMessages = await getAllMessages();
            table.innerHTML = '';

            if (allMessages.length === 0) {
                table.innerHTML = '<tr><td colspan="4" style="text-align:center;">لا توجد رسائل.</td></tr>';
                return;
            }

            allMessages.forEach(msg => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
          <td>${msg.name || '-'}</td>
          <td>${msg.phone || '-'}</td>
          <td>${msg.message ? msg.message.substring(0, 30) + '...' : '-'}</td>
          <td class="actions">
            <button class="btn-icon view-btn" data-id="${msg.id}">عرض</button>
            <button class="btn-icon delete delete-btn" data-id="${msg.id}">حذف</button>
          </td>
        `;
                table.appendChild(tr);
            });

            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    const msg = allMessages.find(m => m.id === id);
                    if (!msg) return;

                    modalDetails.innerHTML = `
            <p><strong>الاسم:</strong> ${msg.name}</p>
            <p><strong>الهاتف:</strong> ${msg.phone}</p>
            <p><strong>الرسالة:</strong><br> ${msg.message}</p>
          `;
                    modal.hidden = false;
                    document.body.classList.add('modal-open');
                });
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.dataset.id;
                    if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
                        try {
                            await deleteMessage(id);
                            loadMessages();
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
});