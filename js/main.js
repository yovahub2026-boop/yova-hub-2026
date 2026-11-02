/* ===================================
   Yova-Hub — Main Script & Home Page Data
   =================================== */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. تحديث سنة الحقوق
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. قائمة الموبايل
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!mainNav.classList.contains('is-open')) return;
      if (mainNav.contains(e.target) || navToggle.contains(e.target)) return;
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  }

  // 3. جلب بيانات الصفحة الرئيسية من Firebase
  const categoriesGrid = document.getElementById('categoriesGrid');
  const latestWebsitesGrid = document.getElementById('latestWebsitesGrid');

  if (categoriesGrid && latestWebsitesGrid) {
    try {
      // جلب التصنيفات
      const categories = await getCategories();
      categoriesGrid.innerHTML = '';

      if (categories.length > 0) {
        categories.forEach(cat => {
          const card = document.createElement('a');
          card.className = 'category-card';
          card.href = `pages/websites.html?category=${cat.id}`;
          card.textContent = cat.name;
          categoriesGrid.appendChild(card);
        });
      } else {
        categoriesGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--color-text-muted);">لا توجد تصنيفات مضافة حالياً.</p>';
      }

      // جلب أحدث المواقع (هنعرض أول 3 مواقع)
      const websites = await getAllWebsites();
      latestWebsitesGrid.innerHTML = '';

      if (websites.length > 0) {
        const latest = websites.slice(0, 3);
        latest.forEach(w => {
          const card = document.createElement('article');
          card.className = 'website-card';

          const cover = document.createElement('div');
          cover.className = 'website-cover';
          cover.innerHTML = `<span class="placeholder-box">${w.coverImage || '[أضف صورة الموقع هنا]'}</span>`;

          const body = document.createElement('div');
          body.className = 'website-card-body';
          body.innerHTML = `
            <h3>${w.name || '[اسم الموقع]'}</h3>
            <p>${w.description || '[وصف الموقع]'}</p>
            <div class="website-card-actions">
              <a href="pages/website-details.html?id=${w.id}" class="btn btn-primary btn-sm">تفاصيل الموقع</a>
            </div>
          `;

          card.appendChild(cover);
          card.appendChild(body);
          latestWebsitesGrid.appendChild(card);
        });
      } else {
        latestWebsitesGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--color-text-muted);">لا توجد مواقع مضافة حالياً.</p>';
      }

    } catch (error) {
      console.error('خطأ في جلب بيانات الصفحة الرئيسية:', error);
      categoriesGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: red;">حدث خطأ في تحميل التصنيفات.</p>';
      latestWebsitesGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: red;">حدث خطأ في تحميل المواقع.</p>';
    }
  }
  // 3. تشغيل الأسئلة الشائعة (FAQ)
  const faqQuestions = document.querySelectorAll('.faq-question');
  if (faqQuestions.length > 0) {
    faqQuestions.forEach(btn => {
      btn.addEventListener('click', () => {
        const parent = btn.parentElement;
        const answer = parent.querySelector('.faq-answer');
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';

        // إغلاق كل الأسئلة التانية
        faqQuestions.forEach(otherBtn => {
          if (otherBtn !== btn) {
            otherBtn.setAttribute('aria-expanded', 'false');
            otherBtn.parentElement.classList.remove('active');
            otherBtn.parentElement.querySelector('.faq-answer').hidden = true;
          }
        });

        // فتح/قفل السؤال الحالي
        if (isExpanded) {
          btn.setAttribute('aria-expanded', 'false');
          parent.classList.remove('active');
          answer.hidden = true;
        } else {
          btn.setAttribute('aria-expanded', 'true');
          parent.classList.add('active');
          answer.hidden = false;
        }
      });
    });
  }
});