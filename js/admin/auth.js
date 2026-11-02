/* ===================================
   Yova-Hub — Admin Auth (Login Page)
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginStatus = document.getElementById('loginStatus');
    const loginBtn = document.getElementById('loginBtn');

    if (!loginForm) return;

    // لو المستخدم مسجل دخول بالفعل وهو أدمن، حوله للداشبورد فوراً
    onAuthChange(async (user) => {
        if (user) {
            const isAdmin = await isCurrentUserAdmin();
            if (isAdmin && window.location.pathname.endsWith('login.html')) {
                window.location.href = 'index.html';
            }
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            loginStatus.textContent = 'يرجى إدخال البريد الإلكتروني وكلمة المرور.';
            loginStatus.className = 'form-status error';
            return;
        }

        loginBtn.disabled = true;
        loginStatus.textContent = 'جارٍ التحقق...';
        loginStatus.className = 'form-status';

        try {
            const data = await loginAdmin(email, password);
            const user = data.user;

            // التأكد إن المستخدم ده موجود في جدول admins
            const isAdmin = await isCurrentUserAdmin();

            if (!isAdmin) {
                await logoutAdmin(); // لو مش أدمن، نطرده
                throw new Error('ليس لديك صلاحية الدخول إلى لوحة التحكم.');
            }

            // لو أدمن، نروح للداشبورد
            window.location.href = 'index.html';

        } catch (error) {
            console.error('خطأ في تسجيل الدخول:', error);
            let msg = 'حدث خطأ أثناء تسجيل الدخول.';

            if (error.message.includes('Invalid login credentials')) {
                msg = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
            } else if (error.message) {
                msg = error.message;
            }

            loginStatus.textContent = msg;
            loginStatus.className = 'form-status error';
            loginBtn.disabled = false;
        }
    });
});