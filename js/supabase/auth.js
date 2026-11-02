/* ===================================
   Yova-Hub — Supabase Auth Helpers
   =================================== */

/**
 * تسجيل دخول الأدمن بالإيميل والباسورد.
 */
async function loginAdmin(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
    });
    if (error) throw error;
    return data;
}

/**
 * تسجيل خروج.
 */
async function logoutAdmin() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
}

/**
 * الاستماع لتغيير حالة تسجيل الدخول.
 */
function onAuthChange(callback) {
    supabaseClient.auth.onAuthStateChange((event, session) => {
        callback(session ? session.user : null);
    });
}

/**
 * التحقق مما إذا كان المستخدم الحالي أدمن.
 */
async function isCurrentUserAdmin() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return false;

    try {
        const { data, error } = await supabaseClient
            .from('admins')
            .select('id')
            .eq('id', session.user.id)
            .single();

        if (error) return false;
        return !!data;
    } catch (error) {
        console.error('خطأ في التحقق من صلاحيات الأدمن:', error);
        return false;
    }
}

/**
 * الحصول على بيانات المستخدم الحالي.
 */
function getCurrentUser() {
    return supabaseClient.auth.getUser().then(({ data }) => data.user);
}