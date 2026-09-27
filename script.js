// الحقول الأساسية
const inpName = document.getElementById('inpName');
const inpTitle = document.getElementById('inpTitle');
const inpEmail = document.getElementById('inpEmail');
const inpPhone = document.getElementById('inpPhone');
const inpLocation = document.getElementById('inpLocation');
const inpLink = document.getElementById('inpLink');
const inpSummary = document.getElementById('inpSummary');
const inpSkills = document.getElementById('inpSkills');

// عناصر المعاينة
const cvName = document.getElementById('cvName');
const cvTitle = document.getElementById('cvTitle');
const cvEmail = document.getElementById('cvEmail');
const cvPhone = document.getElementById('cvPhone');
const cvLocation = document.getElementById('cvLocation');
const cvLink = document.getElementById('cvLink');
const cvSummaryText = document.getElementById('cvSummaryText');
const cvSkillsList = document.getElementById('cvSkillsList');

// فواصل الترويسة
const cvPhoneSep = document.getElementById('cvPhoneSep');
const cvLocationSep = document.getElementById('cvLocationSep');
const cvLinkSep = document.getElementById('cvLinkSep');

// الأقسام الرئيسية في المعاينة
const secSummary = document.getElementById('secSummary');
const secExp = document.getElementById('secExp');
const secEdu = document.getElementById('secEdu');
const secSkills = document.getElementById('secSkills');

// الحاويات وأزرار الإضافة
const expInputsContainer = document.getElementById('experienceInputsList');
const eduInputsContainer = document.getElementById('educationInputsList');
const addExpBtn = document.getElementById('addExpBtn');
const addEduBtn = document.getElementById('addEduBtn');
const clearBtn = document.getElementById('clearBtn');
const printBtn = document.getElementById('printBtn');
const loadDemoBtn = document.getElementById('loadDemoBtn');
const langToggleBtn = document.getElementById('langToggleBtn');

let currentLang = 'ar';

// بيانات الخبرات والتعليم المحفوظة
let experiences = [];
let educations = [];

// تحديث الترويسة والبيانات الشخصية
function updatePersonalInfo() {
  cvName.textContent = inpName.value.trim() || (currentLang === 'ar' ? 'الاسم الكامل' : 'Full Name');
  cvTitle.textContent = inpTitle.value.trim() || (currentLang === 'ar' ? 'المسمى الوظيفي' : 'Job Title');

  const email = inpEmail.value.trim();
  const phone = inpPhone.value.trim();
  const loc = inpLocation.value.trim();
  const link = inpLink.value.trim();

  cvEmail.textContent = email;
  cvPhone.textContent = phone;
  cvLocation.textContent = loc;
if (link) {
  const formattedUrl = link.startsWith('http') ? link : `https://${link}`;
  const label = link.toLowerCase().includes('linkedin') ? 'LinkedIn' : (currentLang === 'ar' ? 'الموقع المهني' : 'Portfolio');
  cvLink.innerHTML = `<a href="${formattedUrl}" target="_blank" style="color: inherit; text-decoration: underline;">${label}</a>`;
} else {
  cvLink.innerHTML = '';
}
  // إخفاء الفواصل إذا كان العنصر فارغاً
  cvPhoneSep.style.display = (email && phone) ? 'inline' : 'none';
  cvLocationSep.style.display = ((email || phone) && loc) ? 'inline' : 'none';
  cvLinkSep.style.display = ((email || phone || loc) && link) ? 'inline' : 'none';

  // ملخص مهني
  const summaryVal = inpSummary.value.trim();
  if (summaryVal) {
    secSummary.style.display = 'block';
    cvSummaryText.textContent = summaryVal;
  } else {
    secSummary.style.display = 'none';
  }

  // المهارات
  const skillsVal = inpSkills.value.trim();
  if (skillsVal) {
    secSkills.style.display = 'block';
    cvSkillsList.textContent = skillsVal;
  } else {
    secSkills.style.display = 'none';
  }
}

[inpName, inpTitle, inpEmail, inpPhone, inpLocation, inpLink, inpSummary, inpSkills].forEach(inp => {
  inp.addEventListener('input', updatePersonalInfo);
});

// إدارة الخبرات
function renderExperiences() {
  expInputsContainer.innerHTML = '';
  const cvExpList = document.getElementById('cvExpList');
  cvExpList.innerHTML = '';

  if (experiences.length === 0) {
    secExp.style.display = 'none';
    return;
  }

  let hasValidContent = false;

  experiences.forEach((exp, idx) => {
    // كرت الإدخال
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-card-header">
        <span style="font-size:0.8rem; font-weight:600; color:var(--text-muted);">${currentLang === 'ar' ? 'خبرة ' + (idx + 1) : 'Experience ' + (idx + 1)}</span>
        <button type="button" class="btn-delete" onclick="removeExp(${idx})">${currentLang === 'ar' ? 'حذف' : 'Remove'}</button>
      </div>
      <input type="text" placeholder="${currentLang === 'ar' ? 'المسمى الوظيفي' : 'Job Title'}" value="${exp.role}" oninput="updateExpData(${idx}, 'role', this.value)">
      <div class="row">
        <input type="text" placeholder="${currentLang === 'ar' ? 'اسم الشركة' : 'Company Name'}" value="${exp.company}" oninput="updateExpData(${idx}, 'company', this.value)">
        <input type="text" placeholder="${currentLang === 'ar' ? 'الفترة (مثال: 2023 - الحالي)' : 'Dates (e.g. 2023 - Present)'}" value="${exp.dates}" oninput="updateExpData(${idx}, 'dates', this.value)">
      </div>
      <textarea rows="3" placeholder="${currentLang === 'ar' ? 'الإنجازات والمهام (افصل بينها بسطر جديد)...' : 'Responsibilities & achievements (one per line)...'}" oninput="updateExpData(${idx}, 'desc', this.value)">${exp.desc}</textarea>
    `;
    expInputsContainer.appendChild(card);

    // المعاينة
    if (exp.role || exp.company || exp.desc) {
      hasValidContent = true;
      const bullets = exp.desc.split('\n').filter(b => b.trim() !== '');
      const bulletsHtml = bullets.map(b => `<li>${b}</li>`).join('');

      const item = document.createElement('div');
      item.className = 'cv-exp-item';
      item.innerHTML = `
        <div class="cv-item-header">
          <span>${exp.company || ''}</span>
          <span>${exp.dates || ''}</span>
        </div>
        <div class="cv-item-sub">
          <span>${exp.role || ''}</span>
        </div>
        ${bullets.length > 0 ? `<ul class="cv-bullets">${bulletsHtml}</ul>` : ''}
      `;
      cvExpList.appendChild(item);
    }
  });

  secExp.style.display = hasValidContent ? 'block' : 'none';
}

function addExp(data = { role: '', company: '', dates: '', desc: '' }) {
  experiences.push(data);
  renderExperiences();
}

function removeExp(index) {
  experiences.splice(index, 1);
  renderExperiences();
}

function updateExpData(index, field, value) {
  experiences[index][field] = value;
  // تحديث المعاينة دون إعادة بناء حقول الإدخال لتجنب فقدان التركيز (Focus)
  renderExpPreviewOnly();
}

function renderExpPreviewOnly() {
  const cvExpList = document.getElementById('cvExpList');
  cvExpList.innerHTML = '';
  let hasValid = false;

  experiences.forEach(exp => {
    if (exp.role || exp.company || exp.desc) {
      hasValid = true;
      const bullets = exp.desc.split('\n').filter(b => b.trim() !== '');
      const bulletsHtml = bullets.map(b => `<li>${b}</li>`).join('');

      const item = document.createElement('div');
      item.className = 'cv-exp-item';
      item.innerHTML = `
        <div class="cv-item-header">
          <span>${exp.company || ''}</span>
          <span>${exp.dates || ''}</span>
        </div>
        <div class="cv-item-sub">
          <span>${exp.role || ''}</span>
        </div>
        ${bullets.length > 0 ? `<ul class="cv-bullets">${bulletsHtml}</ul>` : ''}
      `;
      cvExpList.appendChild(item);
    }
  });
  secExp.style.display = hasValid ? 'block' : 'none';
}

addExpBtn.addEventListener('click', () => addExp());

// إدارة التعليم
function renderEducation() {
  eduInputsContainer.innerHTML = '';
  const cvEduList = document.getElementById('cvEduList');
  cvEduList.innerHTML = '';

  if (educations.length === 0) {
    secEdu.style.display = 'none';
    return;
  }

  let hasValidContent = false;

  educations.forEach((edu, idx) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-card-header">
        <span style="font-size:0.8rem; font-weight:600; color:var(--text-muted);">${currentLang === 'ar' ? 'مؤهل ' + (idx + 1) : 'Degree ' + (idx + 1)}</span>
        <button type="button" class="btn-delete" onclick="removeEdu(${idx})">${currentLang === 'ar' ? 'حذف' : 'Remove'}</button>
      </div>
      <input type="text" placeholder="${currentLang === 'ar' ? 'المؤهل (مثال: بكالوريوس تقنية معلومات)' : 'Degree (e.g. B.Sc. in Computer Science)'}" value="${edu.degree}" oninput="updateEduData(${idx}, 'degree', this.value)">
      <div class="row">
        <input type="text" placeholder="${currentLang === 'ar' ? 'اسم الجامعة أو المعهد' : 'University / College'}" value="${edu.school}" oninput="updateEduData(${idx}, 'school', this.value)">
        <input type="text" placeholder="${currentLang === 'ar' ? 'سنة التخرج' : 'Graduation Year'}" value="${edu.dates}" oninput="updateEduData(${idx}, 'dates', this.value)">
      </div>
    `;
    eduInputsContainer.appendChild(card);

    if (edu.degree || edu.school) {
      hasValidContent = true;
      const item = document.createElement('div');
      item.className = 'cv-edu-item';
      item.innerHTML = `
        <div class="cv-item-header">
          <span>${edu.school || ''}</span>
          <span>${edu.dates || ''}</span>
        </div>
        <div class="cv-item-sub">
          <span>${edu.degree || ''}</span>
        </div>
      `;
      cvEduList.appendChild(item);
    }
  });

  secEdu.style.display = hasValidContent ? 'block' : 'none';
}

function addEdu(data = { degree: '', school: '', dates: '' }) {
  educations.push(data);
  renderEducation();
}

function removeEdu(index) {
  educations.splice(index, 1);
  renderEducation();
}

function updateEduData(index, field, value) {
  educations[index][field] = value;
  renderEduPreviewOnly();
}

function renderEduPreviewOnly() {
  const cvEduList = document.getElementById('cvEduList');
  cvEduList.innerHTML = '';
  let hasValid = false;

  educations.forEach(edu => {
    if (edu.degree || edu.school) {
      hasValid = true;
      const item = document.createElement('div');
      item.className = 'cv-edu-item';
      item.innerHTML = `
        <div class="cv-item-header">
          <span>${edu.school || ''}</span>
          <span>${edu.dates || ''}</span>
        </div>
        <div class="cv-item-sub">
          <span>${edu.degree || ''}</span>
        </div>
      `;
      cvEduList.appendChild(item);
    }
  });
  secEdu.style.display = hasValid ? 'block' : 'none';
}

addEduBtn.addEventListener('click', () => addEdu());

// مسح جميع الحقول (Clear)
clearBtn.addEventListener('click', () => {
  [inpName, inpTitle, inpEmail, inpPhone, inpLocation, inpLink, inpSummary, inpSkills].forEach(el => el.value = '');
  experiences = [];
  educations = [];
  renderExperiences();
  renderEducation();
  certifications = [];
  renderCertifications();
  updateCertPreview();
  updatePersonalInfo();
});

// تعبئة نموذج تجريبي (Demo)
loadDemoBtn.addEventListener('click', () => {
  if (currentLang === 'ar') {
    inpName.value = 'محمد بن خالد';
    inpTitle.value = 'مهندس واجهات أمامية وتطبيقات ويب (Frontend Developer)';
    inpEmail.value = 'mohammed.khalid@email.com';
    inpPhone.value = '+966 55 123 4567';
    inpLocation.value = 'الرياض، المملكة العربية السعودية';
    inpLink.value = 'linkedin.com/in/mohammed-khalid';
    inpSummary.value = 'مهندس واجهات أمامية متخصص في بناء تطبيقات ويب تفاعلية وسريعة الاستجابة ومتوافقة مع معايير الأداء والـ SEO، مع خبرة في تطوير أدوات الويب وتحسين تجربة المستخدم.';
    inpSkills.value = 'HTML5, CSS3, JavaScript (ES6+), Git, GitHub, UI/UX Design, Responsive Design, Performance Optimization';

    experiences = [
      {
        role: 'Senior Frontend Developer',
        company: 'حلول التقنية المتقدمة',
        dates: '2023 - الحالي',
        desc: 'تطوير وتحديث واجهات 5 منتجات رقمية زادت من تفاعل المستخدمين بنسبة 35%.\nتحسين سرعة تحميل الصفحات بنسبة 40% عبر كتابة كود نظيف وتخفيف المكتبات الخارجية.\nالتعاون مع فرق التصميم والـ Back-End لبناء واجهات برمجية متماسكة.'
      },
      {
        role: 'Junior Web Developer',
        company: 'وكالة مسار الرقمية',
        dates: '2021 - 2023',
        desc: 'بناء واجهات مواقع متوافقة مع جميع مقاسات الشاشات والهواتف الذكية.\nتحويل ملفات التصميم (Figma/Adobe XD) إلى صفحات ويب حية بدقة بكسل كاملة.'
      }
    ];

    educations = [
      
      {
        degree: 'بكالوريوس علوم الحاسب',
        school: 'جامعة الملك فهد للبترول والمعادن',
        dates: '2017 - 2021'
      }
    ];
    certifications = [
    { name: 'Meta Front-End Developer Professional Certificate', issuer: 'Coursera / Meta', date: '2023' }
  ];
  renderCertifications();
  updateCertPreview();
  } else {
    inpName.value = 'Sarah Al-Ghamdi';
    inpTitle.value = 'Frontend Web Developer & UI Designer';
    inpEmail.value = 'sarah.ghamdi@email.com';
    inpPhone.value = '+966 50 987 6543';
    inpLocation.value = 'Jeddah, Saudi Arabia';
    inpLink.value = 'linkedin.com/in/sarah-ghamdi';
    inpSummary.value = 'Passionate Frontend Developer focused on building clean, accessible, and high-performance web applications with modern HTML/CSS and pure JavaScript.';
    inpSkills.value = 'JavaScript (ES6+), HTML5/CSS3, Git, GitHub Pages, UI/UX Systems, Responsive Web Apps, Performance Optimization';

    experiences = [
      {
        role: 'Web Applications Developer',
        company: 'Digital Horizons Studio',
        dates: '2023 - Present',
        desc: 'Engineered lightweight web micro-tools reducing user setup drop-offs by 28%.\nRefactored core CSS modules resulting in zero render-blocking layout shifts.\nAuthored semantic single-column HTML structures tailored for strict automated ATS crawlers.'
      },
      {
        role: 'UI Designer & Web Intern',
        company: 'Future Tech Lab',
        dates: '2022 - 2023',
        desc: 'Created responsive wireframes and tested cross-browser accessibility compliance across desktop and mobile browsers.'
      }
    ];

    educations = [
      {
        degree: 'B.Sc. in Computer Science',
        school: 'King Abdulaziz University',
        dates: '2018 - 2022'
      }
    ];
  }

  updatePersonalInfo();
  renderExperiences();
  renderEducation();
});

// تبديل اللغة (عربي / English)
const translations = {
  ar: {
    toggleBtn: 'English',
    loadDemo: 'تعبئة نموذج تجريبي',
    clearBtn: 'مسح الحقول 🗑️',
    print: 'تحميل PDF 📄',
    formTitle: 'البيانات والمعلومات',
    formSub: 'اكتب بياناتك وستظهر بالمعاينة مباشرة وفق معايير أنظمة التوظيف ATS',
    lblPersonal: 'البيانات الشخصية',
    lblSummary: 'الملخص المهني',
    lblExp: 'الخبرات المهنية',
    lblEdu: 'التعليم والمؤهلات',
    lblSkills: 'المهارات والكلمات المفتاحية',
    addExp: '+ إضافة خبرة',
    addEdu: '+ إضافة مؤهل',
    headSummary: 'الملخص المهني',
    headExp: 'الخبرات العملية',
    headEdu: 'التعليم',
    headSkills: 'المهارات التقنية'
  },
  en: {
    toggleBtn: 'العربية',
    loadDemo: 'Load Demo Data',
    clearBtn: 'Clear Fields 🗑️',
    print: 'Download PDF 📄',
    formTitle: 'Resume Information',
    formSub: 'Fill in your details and view the live preview formatted for ATS systems',
    lblPersonal: 'Personal Information',
    lblSummary: 'Professional Summary',
    lblExp: 'Work Experience',
    lblEdu: 'Education',
    lblSkills: 'Key Skills',
    addExp: '+ Add Experience',
    addEdu: '+ Add Education',
    headSummary: 'PROFESSIONAL SUMMARY',
    headExp: 'WORK EXPERIENCE',
    headEdu: 'EDUCATION',
    headSkills: 'TECHNICAL & CORE SKILLS'
  }
};

langToggleBtn.addEventListener('click', () => {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  const html = document.documentElement;

  if (currentLang === 'en') {
    html.setAttribute('lang', 'en');
    html.setAttribute('dir', 'ltr');
  } else {
    html.setAttribute('lang', 'ar');
    html.setAttribute('dir', 'rtl');
  }

  const t = translations[currentLang];
  langToggleBtn.textContent = t.toggleBtn;
  loadDemoBtn.textContent = t.loadDemo;
  clearBtn.textContent = t.clearBtn;
  printBtn.textContent = t.print;
  addExpBtn.textContent = t.addExp;
  addEduBtn.textContent = t.addEdu;
  document.getElementById('formTitle').textContent = t.formTitle;
  document.getElementById('formSub').textContent = t.formSub;
  document.getElementById('lblPersonalInfo').textContent = t.lblPersonal;
  document.getElementById('lblSummary').textContent = t.lblSummary;
  document.getElementById('lblExperience').textContent = t.lblExp;
  document.getElementById('lblEducation').textContent = t.lblEdu;
  document.getElementById('lblSkills').textContent = t.lblSkills;
  document.getElementById('cvHeadingSummary').textContent = t.headSummary;
  document.getElementById('cvHeadingExp').textContent = t.headExp;
  document.getElementById('cvHeadingEdu').textContent = t.headEdu;
  document.getElementById('cvHeadingSkills').textContent = t.headSkills;

  updatePersonalInfo();
  renderExperiences();
  renderEducation();
});

// الطباعة
printBtn.addEventListener('click', () => {
  window.print();
});

// تشغيل افتراضي بخبرة ومؤهل فارغين
addExp();
addEdu();
updatePersonalInfo();
// دالة لحفظ جميع المدخلات تلقائياً
function saveFormData() {
  const inputs = document.querySelectorAll('input, textarea, select');
  const data = {};
  inputs.forEach(input => {
    if (input.id) {
      data[input.id] = input.value;
    }
  });
  data.certifications = certifications;
  localStorage.setItem('ats_resume_data', JSON.stringify(data));
}

// دالة لاسترجاع البيانات عند فتح أو تحديث الصفحة
function loadFormData() {
  const savedData = localStorage.getItem('ats_resume_data');
  if (savedData) {
    const data = JSON.parse(savedData);
    Object.keys(data).forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.value = data[id];
        // تشغيل حدث التحديث عشان تنعكس البيانات فوراً في المعاينة
        element.dispatchEvent(new Event('input'));
      }
     
    });

 if (data.certifications) {
        certifications = data.certifications;
        renderCertifications();
        updateCertPreview();
      }
        }
}
// تفعيل الحفظ عند الكتابة والاسترجاع عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
  loadFormData();
  
  // حفظ البيانات عند أي تعديل في الحقول
  document.addEventListener('input', (e) => {
    if (e.target.matches('input, textarea, select')) {
      saveFormData();
    }
  });
});
function clearResumeData() {
  if (confirm('هل أنت متأكد من مسح جميع البيانات والبدء من جديد؟')) {
    localStorage.removeItem('ats_resume_data');
    location.reload();
  }
}
// --- تصدير واستيراد البيانات (JSON Backup) ---

const exportBtn = document.getElementById('exportBtn');
const importTriggerBtn = document.getElementById('importTriggerBtn');
const importInput = document.getElementById('importInput');

// 1. تصدير البيانات كملف JSON
if (exportBtn) {
  exportBtn.addEventListener('click', () => {
    const data = localStorage.getItem('resumeData');
    if (!data) {
      alert('لا توجد بيانات محفوظة لتصديرها بعد!');
      return;
    }

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ats-resume-backup.json';
    link.click();
    URL.revokeObjectURL(url);
  });
}

// 2. فتح نافذة اختيار الملف عند النقر على زر الاستيراد
if (importTriggerBtn && importInput) {
  importTriggerBtn.addEventListener('click', () => {
    importInput.click();
  });

  // 3. قراءة الملف وتعبئة الحقول تلقائياً
  importInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsedData = JSON.parse(event.target.result);
        localStorage.setItem('resumeData', JSON.stringify(parsedData));
        location.reload();
      } catch (err) {
        alert('الملف غير صالح، يرجى التأكد من اختيار ملف بصيغة .json صحيحة.');
      }
    };
    reader.readAsText(file);
  });
}

// --- احتساب نقاط توافق الـ ATS لحظياً ---
function calculateAtsScore() {
  let score = 0;

  // 1. بيانات التواصل (البريد ورقم الجوال)
  const phone = document.getElementById('phoneInput')?.value.trim();
  const email = document.getElementById('emailInput')?.value.trim();
  const chkContact = document.getElementById('chk-contact');
  if (phone && email) {
    score += 20;
    if (chkContact) {
      chkContact.className = 'done';
      chkContact.textContent = '✅ بيانات التواصل كاملة';
    }
  } else if (chkContact) {
    chkContact.className = 'pending';
    chkContact.textContent = '⚪ بيانات التواصل كاملة (بريد وهاتف)';
  }

  // 2. الملخص المهني
  const summary = document.getElementById('summaryInput')?.value.trim();
  const chkSummary = document.getElementById('chk-summary');
  if (summary && summary.length >= 40) {
    score += 20;
    if (chkSummary) {
      chkSummary.className = 'done';
      chkSummary.textContent = '✅ ملخص مهني كافٍ ومكتمل';
    }
  } else if (chkSummary) {
    chkSummary.className = 'pending';
    chkSummary.textContent = '⚪ ملخص مهني واضح ومكتمل';
  }

  // 3. الخبرة المهنية
  const expTitle = document.querySelector('.exp-title')?.value.trim();
  const expCompany = document.querySelector('.exp-company')?.value.trim();
  const chkExp = document.getElementById('chk-experience');
  if (expTitle && expCompany) {
    score += 20;
    if (chkExp) {
      chkExp.className = 'done';
      chkExp.textContent = '✅ تمت إضافة خبرة مهنية سابقة';
    }
  } else if (chkExp) {
    chkExp.className = 'pending';
    chkExp.textContent = '⚪ خبرة مهنية واحدة على الأقل';
  }

  // 4. التعليم
  const eduDegree = document.querySelector('.edu-degree')?.value.trim();
  const eduSchool = document.querySelector('.edu-school')?.value.trim();
  const chkEdu = document.getElementById('chk-education');
  if (eduDegree && eduSchool) {
    score += 20;
    if (chkEdu) {
      chkEdu.className = 'done';
      chkEdu.textContent = '✅ المؤهل الأكاديمي مضاف';
    }
  } else if (chkEdu) {
    chkEdu.className = 'pending';
    chkEdu.textContent = '⚪ المؤهل الأكاديمي والتعليمي';
  }

  // 5. المهارات (تحديد 4 مهارات على الأقل)
  const skillsText = document.getElementById('skillsInput')?.value.trim();
  const skillsCount = skillsText ? skillsText.split(/[\n,،]+/).filter(s => s.trim().length > 0).length : 0;
  const chkSkills = document.getElementById('chk-skills');
  if (skillsCount >= 4) {
    score += 20;
    if (chkSkills) {
      chkSkills.className = 'done';
      chkSkills.textContent = `✅ المهارات مكتملة (${skillsCount} مهارات)`;
    }
  } else if (chkSkills) {
    chkSkills.className = 'pending';
    chkSkills.textContent = `⚪ إضافة 4 مهارات أساسية فأكثر (الحالي: ${skillsCount})`;
  }

  // تحديث شريط النسبة والألوان
  const scoreBadge = document.getElementById('atsScoreText');
  const progressFill = document.getElementById('atsProgressFill');

  if (scoreBadge && progressFill) {
    scoreBadge.textContent = `${score}%`;
    progressFill.style.width = `${score}%`;

    if (score <= 40) {
      progressFill.style.backgroundColor = '#ef4444'; // أحمر
    } else if (score < 80) {
      progressFill.style.backgroundColor = '#f59e0b'; // برتقالي
    } else {
      progressFill.style.backgroundColor = '#10b981'; // أخضر
    }
  }
}

// تشغيل الفحص عند أي إدخال في الصفحة وفي البداية
document.addEventListener('input', calculateAtsScore);
// --- احتساب نقاط توافق الـ ATS لحظياً ---
// --- احتساب نقاط توافق الـ ATS لحظياً ---
function calculateAtsScore() {
  let score = 0;

  // جلب كافة المدخلات في النموذج
  const inputs = Array.from(document.querySelectorAll('.form-section input, .form-section textarea'));
  
  // 1. فحص بيانات التواصل (البريد ورقم الهاتف)
  const hasEmail = inputs.some(i => i.value.includes('@'));
  const hasPhone = inputs.some(i => {
    const val = i.value.trim();
    // البحث عن أي حقل يحتوي أرقاماً متتالية تشبه رقم الجوال
    return val.match(/\d{5,}/);
  });

  const chkContact = document.getElementById('chk-contact');
  if (hasEmail && hasPhone) {
    score += 20;
    if (chkContact) {
      chkContact.className = 'done';
      chkContact.textContent = '✅ بيانات التواصل كاملة (بريد وهاتف)';
    }
  } else if (chkContact) {
    chkContact.className = 'pending';
    chkContact.textContent = '⚪ بيانات التواصل كاملة (بريد وهاتف)';
  }

  // 2. الملخص المهني (البحث عن أي textarea يتعدى 25 حرفاً)
  const textareas = Array.from(document.querySelectorAll('textarea'));
  const hasSummary = textareas.some(t => t.value.trim().length >= 25);
  const chkSummary = document.getElementById('chk-summary');
  if (hasSummary) {
    score += 20;
    if (chkSummary) {
      chkSummary.className = 'done';
      chkSummary.textContent = '✅ ملخص مهني كافٍ ومكتمل';
    }
  } else if (chkSummary) {
    chkSummary.className = 'pending';
    chkSummary.textContent = '⚪ ملخص مهني واضح ومكتمل';
  }

  // 3. الخبرة المهنية
  const expBlock = document.querySelector('#experienceContainer, .experience-group, [id*="exp"]');
  const hasExp = expBlock ? Array.from(expBlock.querySelectorAll('input, textarea')).some(i => i.value.trim().length > 2) : false;
  const chkExp = document.getElementById('chk-experience');
  if (hasExp) {
    score += 20;
    if (chkExp) {
      chkExp.className = 'done';
      chkExp.textContent = '✅ تمت إضافة خبرة مهنية سابقة';
    }
  } else if (chkExp) {
    chkExp.className = 'pending';
    chkExp.textContent = '⚪ خبرة مهنية واحدة على الأقل';
  }

  // 4. التعليم
  const eduBlock = document.querySelector('#educationContainer, .education-group, [id*="edu"]');
  const hasEdu = eduBlock ? Array.from(eduBlock.querySelectorAll('input, textarea')).some(i => i.value.trim().length > 2) : false;
  const chkEdu = document.getElementById('chk-education');
  if (hasEdu) {
    score += 20;
    if (chkEdu) {
      chkEdu.className = 'done';
      chkEdu.textContent = '✅ المؤهل الأكاديمي مضاف';
    }
  } else if (chkEdu) {
    chkEdu.className = 'pending';
    chkEdu.textContent = '⚪ المؤهل الأكاديمي والتعليمي';
  }

  // 5. المهارات
  const skillsInput = document.querySelector('#skills, #skillsInput, textarea[placeholder*="مهار"], input[placeholder*="مهار"]');
  let skillsCount = 0;
  if (skillsInput && skillsInput.value.trim()) {
    skillsCount = skillsInput.value.trim().split(/[\n,،]+/).filter(s => s.trim().length > 0).length;
  }
  const chkSkills = document.getElementById('chk-skills');
  if (skillsCount >= 4) {
    score += 20;
    if (chkSkills) {
      chkSkills.className = 'done';
      chkSkills.textContent = `✅ المهارات مكتملة (${skillsCount} مهارات)`;
    }
  } else if (chkSkills) {
    chkSkills.className = 'pending';
    chkSkills.textContent = `⚪ إضافة 4 مهارات أساسية فأكثر (الحالي: ${skillsCount})`;
  }

  // تحديث النسبة والشريط
  const scoreBadge = document.getElementById('atsScoreText');
  const progressFill = document.getElementById('atsProgressFill');

  if (scoreBadge && progressFill) {
    scoreBadge.textContent = `${score}%`;
    progressFill.style.width = `${score}%`;

    if (score <= 40) {
      progressFill.style.backgroundColor = '#ef4444';
    } else if (score < 80) {
      progressFill.style.backgroundColor = '#f59e0b';
    } else {
      progressFill.style.backgroundColor = '#10b981';
    }
  }
}

// تفعيل الاستماع على كامل الصفحة
document.addEventListener('input', calculateAtsScore);
document.addEventListener('keyup', calculateAtsScore);
document.addEventListener('change', calculateAtsScore);
window.addEventListener('load', calculateAtsScore);
setTimeout(calculateAtsScore, 300);
// ==========================================
// إدارة قسم الشهادات المهنية والدورات ديناميكياً
// ==========================================
let certifications = [];

const certInputsList = document.getElementById('certInputsList');
const addCertBtn = document.getElementById('addCertBtn');
const previewCertSection = document.getElementById('previewCertSection');
const previewCertList = document.getElementById('previewCertList');

// حدث الضغط على زر إضافة شهادة
if (addCertBtn) {
  addCertBtn.addEventListener('click', () => {
    certifications.push({ name: '', issuer: '', date: '' });
    renderCertifications();
    updateCertPreview();
  });
}

// رسم حقول إدخال الشهادات
function renderCertifications() {
  if (!certInputsList) return;
  certInputsList.innerHTML = '';

  certifications.forEach((cert, index) => {
    const item = document.createElement('div');
    item.className = 'dynamic-item';
    item.style.marginBottom = '12px';
    item.style.padding = '10px';
    item.style.border = '1px solid #e2e8f0';
    item.style.borderRadius = '6px';
    item.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-weight: 600; font-size: 0.85rem; color: #475569;">شهادة / دورة ${index + 1}</span>
        <button type="button" onclick="removeCert(${index})" style="color: #ef4444; background: none; border: none; cursor: pointer; font-size: 0.8rem; font-weight: 500;">حذف</button>
      </div>
      <div class="row" style="margin-bottom: 8px;">
        <input type="text" placeholder="اسم الشهادة أو الاعتماد" value="${cert.name || ''}" oninput="updateCertField(${index}, 'name', this.value)">
        <input type="text" placeholder="الجهة المانحة (مثال: Google, PMI)" value="${cert.issuer || ''}" oninput="updateCertField(${index}, 'issuer', this.value)">
      </div>
      <input type="text" placeholder="تاريخ الحصول عليها (مثال: 2024)" value="${cert.date || ''}" oninput="updateCertField(${index}, 'date', this.value)">
    `;
    certInputsList.appendChild(item);
  });
}

// تحديث بيانات الشهادة عند الكتابة
window.updateCertField = function(index, field, value) {
  if (certifications[index]) {
    certifications[index][field] = value;
    updateCertPreview();
  }
};

// حذف شهادة
window.removeCert = function(index) {
  certifications.splice(index, 1);
  renderCertifications();
  updateCertPreview();
};

// تحديث عرض الشهادات في ورقة المعاينة A4
function updateCertPreview() {
  if (!previewCertList || !previewCertSection) return;

  const validCerts = certifications.filter(c => (c.name && c.name.trim()) || (c.issuer && c.issuer.trim()));
  
  if (validCerts.length === 0) {
    previewCertSection.style.display = 'none';
    previewCertList.innerHTML = '';
    return;
  }

  previewCertSection.style.display = 'block';
  previewCertList.innerHTML = validCerts.map(c => `
    <div style="margin-bottom: 8px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; font-weight: 600; font-size: 0.95rem;">
        <span>${c.name || ''}</span>
        <span style="font-size: 0.85rem; color: #64748b;">${c.date || ''}</span>
      </div>
      ${c.issuer ? `<div style="color: #475569; font-size: 0.88rem;">${c.issuer}</div>` : ''}
    </div>
  `).join('');
}