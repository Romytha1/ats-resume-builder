// ats-match.js — أضِف <script src="ats-match.js"></script> بعد script.js في index.html
// يضيف: (1) مطابقة الكلمات المفتاحية مع إعلان الوظيفة  (2) تفعيل زري «حفظ نسخة» و«استرجاع» (كانا بلا وظيفة)
(function () {
  const STOP = new Set(('the and for with you your our are will have has from that this their they who all can able work ' +
    'team years year experience ability skills strong good plus use using including etc such new more other than into ' +
    'في من على إلى الى عن مع هذا هذه ذلك التي الذي أو او و ان أن كل لدى لديه يجب نحن أنت خبرة سنوات سنة مهارات القدرة ' +
    'العمل عمل فريق مطلوب نبحث عن ذات مثل أكثر بين خلال حول لدينا ضمن').split(/\s+/));

  const tokens = (text) =>
    (text.toLowerCase().match(/[a-z][a-z0-9+#.]{1,}|[\u0600-\u06FF]{3,}/g) || [])
      .map((t) => t.replace(/\.+$/, ''))
      .filter((t) => t.length >= 3 && !STOP.has(t));

  const cvText = () => {
    const v = (id) => (document.getElementById(id) || {}).value || '';
    const parts = [v('inpTitle'), v('inpSummary'), v('inpSkills')];
    (window.experiences || experiences || []).forEach((e) => parts.push(e.role, e.company, e.desc));
    return parts.join(' ').toLowerCase();
  };

  function analyze(jd) {
    const freq = {};
    tokens(jd).forEach((t) => (freq[t] = (freq[t] || 0) + 1));
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1] || b[0].length - a[0].length).slice(0, 15).map((e) => e[0]);
    const have = new Set(tokens(cvText()));
    const raw = cvText();
    const found = top.filter((k) => have.has(k) || raw.includes(k));
    return { top, found, missing: top.filter((k) => !found.includes(k)) };
  }

  const TXT = {
    ar: { title: '🔍 طابق سيرتك مع إعلان الوظيفة', hint: 'الصق وصف الوظيفة لنعرض الكلمات المفتاحية الناقصة في سيرتك.',
      ph: 'الصق وصف الوظيفة هنا...', btn: 'حلّل التوافق', short: 'الصق نصاً أطول من فضلك (40 حرفاً على الأقل).',
      cover: 'نسبة تغطية الكلمات المفتاحية', ok: 'موجودة', no: 'ناقصة (أضفها إن كانت صحيحة فعلاً)', bad: 'الملف غير صالح' },
    en: { title: '🔍 Match your resume to a job post', hint: 'Paste the job description to see which keywords are missing from your resume.',
      ph: 'Paste the job description here...', btn: 'Analyze match', short: 'Please paste a longer text (at least 40 characters).',
      cover: 'Keyword coverage', ok: 'Found', no: 'Missing (add them only if they are true for you)', bad: 'Invalid file' }
  };
  const t = () => TXT[document.documentElement.lang === 'en' ? 'en' : 'ar'];
  let last = null;

  const chips = (arr, cls) => arr.map((k) => `<span class="kw ${cls}">${k.replace(/[<>&"]/g, '')}</span>`).join('') || '—';

  function inject() {
    const anchor = document.querySelector('.ats-meter-card');
    if (!anchor || document.getElementById('jdCard')) return;
    const st = document.createElement('style');
    st.textContent = `.jd-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin-bottom:20px}
      .jd-card textarea{min-height:90px}.kw{display:inline-block;margin:2px;padding:2px 8px;border-radius:12px;font-size:.78rem}
      .kw.ok{background:#dcfce7;color:#166534}.kw.no{background:#fee2e2;color:#991b1b}#jdResult{font-size:.85rem;margin-top:10px}
      #jdResult b{display:block;margin:8px 0 2px}`;
    document.head.appendChild(st);
    const card = document.createElement('div');
    card.id = 'jdCard';
    card.className = 'jd-card';
    card.innerHTML = `<div class="ats-meter-title" id="jdTitle"></div>
      <p id="jdHint" style="font-size:.8rem;color:#64748b;margin:6px 0"></p>
      <textarea id="jdInput"></textarea>
      <button type="button" id="jdBtn" class="btn btn-primary"></button><div id="jdResult" aria-live="polite"></div>`;
    anchor.after(card);
    document.getElementById('jdBtn').onclick = () => {
      const jd = document.getElementById('jdInput').value.trim();
      if (jd.length < 40) { last = null; document.getElementById('jdResult').textContent = t().short; return; }
      last = analyze(jd);
      show();
    };
    applyLang();
    const lb = document.getElementById('langToggleBtn');
    if (lb) lb.addEventListener('click', applyLang);
  }

  function show() {
    const out = document.getElementById('jdResult');
    if (!out || !last) return;
    const pct = last.top.length ? Math.round((last.found.length / last.top.length) * 100) : 0;
    out.innerHTML = `<b>${t().cover}: ${pct}%</b><b>${t().ok}</b>${chips(last.found, 'ok')}<b>${t().no}</b>${chips(last.missing, 'no')}`;
  }

  function applyLang() {
    const set = (id, v, prop) => { const el = document.getElementById(id); if (el) el[prop || 'textContent'] = v; };
    set('jdTitle', t().title); set('jdHint', t().hint); set('jdInput', t().ph, 'placeholder'); set('jdBtn', t().btn);
    if (last) show(); else set('jdResult', '');
  }

  // حفظ نسخة / استرجاع (JSON)
  function wireBackup() {
    const KEY = 'ats_cv_unified_draft';
    const ex = document.getElementById('exportBtn'), im = document.getElementById('importTriggerBtn'), inp = document.getElementById('importInput');
    if (ex) ex.onclick = () => {
      const blob = new Blob([localStorage.getItem(KEY) || '{}'], { type: 'application/json' });
      const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'my-cv-backup.json' });
      a.click(); URL.revokeObjectURL(a.href);
    };
    if (im && inp) {
      im.onclick = () => inp.click();
      inp.onchange = () => {
        const f = inp.files[0]; if (!f) return;
        const rd = new FileReader();
        rd.onload = () => {
          try { JSON.parse(rd.result); localStorage.setItem(KEY, rd.result); location.reload(); }
          catch { alert(t().bad); }
        };
        rd.readAsText(f);
      };
    }
  }

  window.addEventListener('DOMContentLoaded', () => { inject(); wireBackup(); });
})();
