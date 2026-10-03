// ats-service.js — أضِف <script src="ats-service.js"></script> بعد ats-match.js في index.html
(function () {
  // ===== عدّلي هذه القيم فقط =====
  const PHONE = '966536370082';   // رقم الواتساب بصيغة دولية بدون + أو أصفار (هذا الرقم من الـ Portfolio)
  const PRICE = 49;               // السعر بالريال
  // ================================

  const TXT = {
    ar: {
      title: '✍️ تبغي أحد يراجع سيرتك معك؟',
      lead: 'أراجع سيرتك الذاتية شخصياً وأعدّلها لتناسب الوظيفة التي تتقدم لها.',
      items: ['سيرتك بعد التعديل (PDF جاهز للتقديم)', 'إضافة الكلمات المفتاحية المناسبة لإعلان الوظيفة', 'ورقة قصيرة توضح ما تغيّر ولماذا', 'تعديل واحد مجاني بعد التسليم'],
      meta: `التسليم خلال 24 ساعة • ${PRICE} ريال`,
      btn: '💬 اطلب الخدمة عبر واتساب',
      note: 'لا نضمن القبول في الوظيفة، لكننا نرفع فرص سيرتك في الفرز الأولي. نحذف ملفك بعد التسليم.',
      msg: `السلام عليكم، أريد خدمة مراجعة وتحسين السيرة الذاتية (${PRICE} ريال) من موقع smartatscv.com`
    },
    en: {
      title: '✍️ Want a real person to review your resume?',
      lead: 'I personally review your resume and tailor it to the job you are applying for.',
      items: ['Your revised resume (application-ready PDF)', 'Keywords added to match the job post', 'A short note explaining what changed and why', 'One free revision after delivery'],
      meta: `Delivered within 24 hours • ${PRICE} SAR`,
      btn: '💬 Request via WhatsApp',
      note: 'We cannot guarantee a job offer, but we improve your chances in the first screening. Your file is deleted after delivery.',
      msg: `Hello, I would like the resume review service (${PRICE} SAR) from smartatscv.com`
    }
  };
  const t = () => TXT[document.documentElement.lang === 'en' ? 'en' : 'ar'];

  function render() {
    const T = t();
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('svcTitle', T.title); set('svcLead', T.lead); set('svcMeta', T.meta); set('svcNote', T.note); set('svcBtn', T.btn);
    const ul = document.getElementById('svcItems');
    if (ul) { ul.textContent = ''; T.items.forEach((i) => { const li = document.createElement('li'); li.textContent = '✓ ' + i; ul.appendChild(li); }); }
    const a = document.getElementById('svcBtn');
    if (a) a.href = `https://wa.me/${PHONE}?text=${encodeURIComponent(T.msg)}`;
  }

  function init() {
    const anchor = document.getElementById('jdCard') || document.querySelector('.ats-meter-card');
    if (!anchor || document.getElementById('svcCard')) return;
    const st = document.createElement('style');
    st.textContent = `.svc-card{background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:16px;margin-bottom:20px}
      .svc-card h4{font-size:1rem;margin-bottom:4px}.svc-card p{font-size:.85rem;color:#475569;margin-bottom:8px}
      .svc-card ul{list-style:none;font-size:.85rem;margin-bottom:10px;line-height:1.8}
      .svc-meta{font-weight:700;color:#1d4ed8;margin-bottom:10px;font-size:.9rem}
      .svc-btn{display:inline-block;background:#16a34a;color:#fff;text-decoration:none;font-weight:700;font-size:.9rem;padding:.6rem 1.1rem;border-radius:6px}
      .svc-btn:hover{background:#15803d}.svc-note{font-size:.75rem!important;color:#64748b!important;margin:10px 0 0!important}`;
    document.head.appendChild(st);
    const card = document.createElement('div');
    card.id = 'svcCard';
    card.className = 'svc-card no-print';
    card.innerHTML = `<h4 id="svcTitle"></h4><p id="svcLead"></p><ul id="svcItems"></ul><div class="svc-meta" id="svcMeta"></div>
      <a id="svcBtn" class="svc-btn" target="_blank" rel="noopener noreferrer" href="#"></a><p class="svc-note" id="svcNote"></p>`;
    anchor.after(card);
    render();
    const lb = document.getElementById('langToggleBtn');
    if (lb) lb.addEventListener('click', render);
  }

  window.addEventListener('DOMContentLoaded', init);
})();
