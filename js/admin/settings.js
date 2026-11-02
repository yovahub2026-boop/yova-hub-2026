/* ===================================
   Yova-Hub — Admin Settings Logic (Supabase)
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    onAuthChange(async (user) => {
        if (!user) return window.location.href = 'login.html';
        const isAdmin = await isCurrentUserAdmin();
        if (!isAdmin) return window.location.href = '../index.html';
        loadSettings();
    });

    document.getElementById('logoutBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        await logoutAdmin();
        window.location.href = 'login.html';
    });

    const form = document.getElementById('settingsForm');
    const statusEl = document.getElementById('settingsStatus');

    async function loadSettings() {
        try {
            const settings = await getSettings();
            if (settings) {
                document.getElementById('siteTitle').value = settings.siteTitle || '';
                document.getElementById('contactPhone').value = settings.contactPhone || '';
                document.getElementById('contactEmail').value = settings.contactEmail || '';
                document.getElementById('whatsappLink').value = settings.whatsappLink || '';
                document.getElementById('socialLinks').value = settings.socialLinks || '';
            }
        } catch (error) {
            console.error('خطأ في تحميل الإعدادات:', error);
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            siteTitle: document.getElementById('siteTitle').value.trim(),
            contactPhone: document.getElementById('contactPhone').value.trim(),
            contactEmail: document.getElementById('contactEmail').value.trim(),
            whatsappLink: document.getElementById('whatsappLink').value.trim(),
            socialLinks: document.getElementById('socialLinks').value.trim()
        };

        const btn = document.getElementById('saveSettingsBtn');
        btn.disabled = true;
        statusEl.textContent = 'جارٍ الحفظ...';
        statusEl.className = 'form-status';

        try {
            await saveSettings(data);
            statusEl.textContent = 'تم حفظ الإعدادات بنجاح!';
            statusEl.className = 'form-status success';
        } catch (error) {
            console.error(error);
            statusEl.textContent = 'حدث خطأ أثناء الحفظ.';
            statusEl.className = 'form-status error';
        } finally {
            btn.disabled = false;
        }
    });
});