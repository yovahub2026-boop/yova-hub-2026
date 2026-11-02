/* ===================================
   Yova-Hub — Supabase Config
   =================================== */

// ⚠️ هذه المفاتيح عامة (public) ومصممة للاستخدام في المتصفح.
// الحماية الحقيقية بتتم عن طريق Row Level Security (RLS) اللي فعلناها في Supabase.

const SUPABASE_URL = "https://enezewsqrqbhccmkmljh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuZXpld3NxcnFiaGNjbWttbGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1NTM3NjAsImV4cCI6MjEwOTEyOTc2MH0.BxmjE0E8C1KxQH-dapH3pC8HU4hkQSLXekv8ea2VJVU";

// تهيئة عميل Supabase (هنستخدم اسم supabaseClient عشان ميتعارضش مع مكتبة Supabase نفسها)
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);  