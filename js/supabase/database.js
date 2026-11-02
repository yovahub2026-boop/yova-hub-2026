/* ===================================
   Yova-Hub — Supabase Database Helpers
   =================================== */

/* ---------- Websites ---------- */

async function getPublishedWebsites() {
    const { data, error } = await supabaseClient
        .from('websites')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

async function getWebsiteById(id) {
    const { data, error } = await supabaseClient
        .from('websites')
        .select('*')
        .eq('id', id)
        .single();
    if (error) return null;
    return data;
}

async function getAllWebsites() {
    const { data, error } = await supabaseClient
        .from('websites')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

async function createWebsite(websiteData) {
    const { data, error } = await supabaseClient
        .from('websites')
        .insert([websiteData])
        .select();
    if (error) throw error;
    return data[0].id;
}

async function updateWebsite(id, websiteData) {
    const { error } = await supabaseClient
        .from('websites')
        .update(websiteData)
        .eq('id', id);
    if (error) throw error;
}

async function deleteWebsite(id) {
    const { error } = await supabaseClient
        .from('websites')
        .delete()
        .eq('id', id);
    if (error) throw error;
}

/* ---------- Categories ---------- */

async function getCategories() {
    const { data, error } = await supabaseClient
        .from('categories')
        .select('*')
        .order('name');
    if (error) throw error;
    return data;
}

async function createCategory(categoryData) {
    const { data, error } = await supabaseClient
        .from('categories')
        .insert([categoryData])
        .select();
    if (error) throw error;
    return data[0].id;
}

async function updateCategory(id, categoryData) {
    const { error } = await supabaseClient
        .from('categories')
        .update(categoryData)
        .eq('id', id);
    if (error) throw error;
}

async function deleteCategory(id) {
    const { error } = await supabaseClient
        .from('categories')
        .delete()
        .eq('id', id);
    if (error) throw error;
}

/* ---------- Orders ---------- */

async function createOrder(orderData) {
    const { error } = await supabaseClient
        .from('orders')
        .insert([{ ...orderData, status: 'new' }]);
    if (error) throw error;
}

async function getAllOrders() {
    const { data, error } = await supabaseClient
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

async function updateOrderStatus(id, status) {
    const { error } = await supabaseClient
        .from('orders')
        .update({ status })
        .eq('id', id);
    if (error) throw error;
}

async function deleteOrder(id) {
    const { error } = await supabaseClient
        .from('orders')
        .delete()
        .eq('id', id);
    if (error) throw error;
}

/* ---------- Messages ---------- */

async function createMessage(messageData) {
    const { error } = await supabaseClient
        .from('messages')
        .insert([messageData]);
    if (error) throw error;
}

async function getAllMessages() {
    const { data, error } = await supabaseClient
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

async function deleteMessage(id) {
    const { error } = await supabaseClient
        .from('messages')
        .delete()
        .eq('id', id);
    if (error) throw error;
}

/* ---------- Settings ---------- */
// (بما إننا لسه معملناش جدول settings، هنخليها مؤقتاً ترجع null)
async function getSettings() {
    return null;
}
async function saveSettings(settingsData) {
    console.log('Settings save not implemented yet for Supabase.');
}