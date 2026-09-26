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
  cvLink.textContent = link;

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