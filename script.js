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

// قسم الشهادات
const certInputsList = document.getElementById('certInputsList');
const addCertBtn = document.getElementById('addCertBtn');
const previewCertSection = document.getElementById('previewCertSection');
const previewCertList = document.getElementById('previewCertList');

let currentLang = 'ar';
let experiences = [];
let educations = [];
let certifications = [];

// ==========================================
// 1. تحديث البيانات الشخصية والترويسة
// ==========================================
function updatePersonalInfo() {
  if (cvName) cvName.textContent = inpName.value.trim() || (currentLang === 'ar' ? 'الاسم الكامل' : 'Full Name');
  if (cvTitle) cvTitle.textContent = inpTitle.value.trim() || (currentLang === 'ar' ? 'المسمى الوظيفي' : 'Job Title');

  const email = inpEmail.value.trim();
  const phone = inpPhone.value.trim();
  const loc = inpLocation.value.trim();
  const link = inpLink.value.trim();

  if (cvEmail) cvEmail.textContent = email;
  if (cvPhone) cvPhone.textContent = phone;
  if (cvLocation) cvLocation.textContent = loc;

  if (cvLink) {
    if (link) {
      const formattedUrl = link.startsWith('http') ? link : `https://${link}`;
      const label = link.toLowerCase().includes('linkedin') ? 'LinkedIn' : (currentLang === 'ar' ? 'الموقع المهني' : 'Portfolio');
      cvLink.innerHTML = `<a href="${formattedUrl}" target="_blank" style="color: inherit; text-decoration: underline;">${label}</a>`;
    } else {
      cvLink.innerHTML = '';
    }
  }

  if (cvPhoneSep) cvPhoneSep.style.display = (email && phone) ? 'inline' : 'none';
  if (cvLocationSep) cvLocationSep.style.display = ((email || phone) && loc) ? 'inline' : 'none';
  if (cvLinkSep) cvLinkSep.style.display = ((email || phone || loc) && link) ? 'inline' : 'none';

  const summaryVal = inpSummary.value.trim();
  if (secSummary) {
    if (summaryVal) {
      secSummary.style.display = 'block';
      if (cvSummaryText) cvSummaryText.textContent = summaryVal;
    } else {
      secSummary.style.display = 'none';
    }
  }

  const skillsVal = inpSkills.value.trim();
  if (secSkills) {
    if (skillsVal) {
      secSkills.style.display = 'block';
      if (cvSkillsList) cvSkillsList.textContent = skillsVal;
    } else {
      secSkills.style.display = 'none';
    }
  }
}

[inpName, inpTitle, inpEmail, inpPhone, inpLocation, inpLink, inpSummary, inpSkills].forEach(inp => {
  if (inp) {
    inp.addEventListener('input', () => {
      updatePersonalInfo();
      saveAllData();
      calculateAtsScore();
    });
  }
});

// ==========================================
// 2. إدارة الخبرات
// ==========================================
function renderExperiences() {
  if (!expInputsContainer) return;
  expInputsContainer.innerHTML = '';

  experiences.forEach((exp, idx) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-card-header">
        <span style="font-size:0.8rem; font-weight:600; color:var(--text-muted);">${currentLang === 'ar' ? 'خبرة ' + (idx + 1) : 'Experience ' + (idx + 1)}</span>
        <button type="button" class="btn-delete" onclick="removeExp(${idx})">${currentLang === 'ar' ? 'حذف' : 'Remove'}</button>
      </div>
      <input type="text" placeholder="${currentLang === 'ar' ? 'المسمى الوظيفي' : 'Job Title'}" value="${exp.role || ''}" oninput="updateExpData(${idx}, 'role', this.value)">
      <div class="row">
        <input type="text" placeholder="${currentLang === 'ar' ? 'اسم الشركة' : 'Company Name'}" value="${exp.company || ''}" oninput="updateExpData(${idx}, 'company', this.value)">
        <input type="text" placeholder="${currentLang === 'ar' ? 'الفترة (مثال: 2023 - الحالي)' : 'Dates (e.g. 2023 - Present)'}" value="${exp.dates || ''}" oninput="updateExpData(${idx}, 'dates', this.value)">
      </div>
      <textarea rows="3" placeholder="${currentLang === 'ar' ? 'الإنجازات والمهام (افصل بينها بسطر جديد)...' : 'Responsibilities & achievements (one per line)...'}" oninput="updateExpData(${idx}, 'desc', this.value)">${exp.desc || ''}</textarea>
    `;
    expInputsContainer.appendChild(card);
  });

  renderExpPreviewOnly();
}

function addExp(data = { role: '', company: '', dates: '', desc: '' }) {
  experiences.push(data);
  renderExperiences();
  saveAllData();
  calculateAtsScore();
}

window.removeExp = function(index) {
  experiences.splice(index, 1);
  renderExperiences();
  saveAllData();
  calculateAtsScore();
};

window.updateExpData = function(index, field, value) {
  if (experiences[index]) {
    experiences[index][field] = value;
    renderExpPreviewOnly();
    saveAllData();
    calculateAtsScore();
  }
};

function renderExpPreviewOnly() {
  const cvExpList = document.getElementById('cvExpList');
  if (!cvExpList || !secExp) return;
  cvExpList.innerHTML = '';
  let hasValid = false;

  experiences.forEach(exp => {
    if (exp.role || exp.company || exp.desc) {
      hasValid = true;
      const bullets = (exp.desc || '').split('\n').filter(b => b.trim() !== '');
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

if (addExpBtn) addExpBtn.addEventListener('click', () => addExp());

// ==========================================
// 3. إدارة التعليم
// ==========================================
function renderEducation() {
  if (!eduInputsContainer) return;
  eduInputsContainer.innerHTML = '';

  educations.forEach((edu, idx) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-card-header">
        <span style="font-size:0.8rem; font-weight:600; color:var(--text-muted);">${currentLang === 'ar' ? 'مؤهل ' + (idx + 1) : 'Degree ' + (idx + 1)}</span>
        <button type="button" class="btn-delete" onclick="removeEdu(${idx})">${currentLang === 'ar' ? 'حذف' : 'Remove'}</button>
      </div>
      <input type="text" placeholder="${currentLang === 'ar' ? 'المؤهل (مثال: بكالوريوس تقنية معلومات)' : 'Degree (e.g. B.Sc. in Computer Science)'}" value="${edu.degree || ''}" oninput="updateEduData(${idx}, 'degree', this.value)">
      <div class="row">
        <input type="text" placeholder="${currentLang === 'ar' ? 'اسم الجامعة أو المعهد' : 'University / College'}" value="${edu.school || ''}" oninput="updateEduData(${idx}, 'school', this.value)">
        <input type="text" placeholder="${currentLang === 'ar' ? 'سنة التخرج' : 'Graduation Year'}" value="${edu.dates || ''}" oninput="updateEduData(${idx}, 'dates', this.value)">
      </div>
    `;
    eduInputsContainer.appendChild(card);
  });

  renderEduPreviewOnly();
}

function addEdu(data = { degree: '', school: '', dates: '' }) {
  educations.push(data);
  renderEducation();
  saveAllData();
  calculateAtsScore();
}

window.removeEdu = function(index) {
  educations.splice(index, 1);
  renderEducation();
  saveAllData();
  calculateAtsScore();
};

window.updateEduData = function(index, field, value) {
  if (educations[index]) {
    educations[index][field] = value;
    renderEduPreviewOnly();
    saveAllData();
    calculateAtsScore();
  }
};

function renderEduPreviewOnly() {
  const cvEduList = document.getElementById('cvEduList');
  if (!cvEduList || !secEdu) return;
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

if (addEduBtn) addEduBtn.addEventListener('click', () => addEdu());

// ==========================================
// 4. إدارة الشهادات
// ==========================================
if (addCertBtn) {
  addCertBtn.addEventListener('click', () => {
    certifications.push({ name: '', issuer: '', date: '' });
    renderCertifications();
    saveAllData();
  });
}

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

  updateCertPreview();
}

window.updateCertField = function(index, field, value) {
  if (certifications[index]) {
    certifications[index][field] = value;
    updateCertPreview();
    saveAllData();
  }
};

window.removeCert = function(index) {
  certifications.splice(index, 1);
  renderCertifications();
  updateCertPreview();
  saveAllData();
};

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

// ==========================================
// 5. الحفظ التلقائي الفوري الموحّد (Auto-Save)
// ==========================================
function saveAllData() {
  const data = {
    inpName: inpName ? inpName.value : '',
    inpTitle: inpTitle ? inpTitle.value : '',
    inpEmail: inpEmail ? inpEmail.value : '',
    inpPhone: inpPhone ? inpPhone.value : '',
    inpLocation: inpLocation ? inpLocation.value : '',
    inpLink: inpLink ? inpLink.value : '',
    inpSummary: inpSummary ? inpSummary.value : '',
    inpSkills: inpSkills ? inpSkills.value : '',
    experiences: experiences,
    educations: educations,
    certifications: certifications,
    currentLang: currentLang
  };
  localStorage.setItem('ats_cv_unified_draft', JSON.stringify(data));
}

function loadAllData() {
  const saved = localStorage.getItem('ats_cv_unified_draft');
  if (!saved) {
    addExp();
    addEdu();
    updatePersonalInfo();
    calculateAtsScore();
    return;
  }

  try {
    const data = JSON.parse(saved);
    if (inpName) inpName.value = data.inpName || '';
    if (inpTitle) inpTitle.value = data.inpTitle || '';
    if (inpEmail) inpEmail.value = data.inpEmail || '';
    if (inpPhone) inpPhone.value = data.inpPhone || '';
    if (inpLocation) inpLocation.value = data.inpLocation || '';
    if (inpLink) inpLink.value = data.inpLink || '';
    if (inpSummary) inpSummary.value = data.inpSummary || '';
    if (inpSkills) inpSkills.value = data.inpSkills || '';

    experiences = Array.isArray(data.experiences) && data.experiences.length > 0 ? data.experiences : [{ role: '', company: '', dates: '', desc: '' }];
    educations = Array.isArray(data.educations) && data.educations.length > 0 ? data.educations : [{ degree: '', school: '', dates: '' }];
    certifications = Array.isArray(data.certifications) ? data.certifications : [];

    updatePersonalInfo();
    renderExperiences();
    renderEducation();
    renderCertifications();
    calculateAtsScore();
  } catch (err) {
    console.error('فشل استعادة البيانات:', err);
  }
}

// ==========================================
// 6. احتساب نقاط توافق الـ ATS لحظياً
// ==========================================
function calculateAtsScore() {
  let score = 0;

  // 1. بيانات التواصل
  const emailVal = inpEmail ? inpEmail.value.trim() : '';
  const phoneVal = inpPhone ? inpPhone.value.trim() : '';
  const hasEmail = emailVal.includes('@');
  const hasPhone = phoneVal.length >= 8;

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

  // 2. الملخص المهني
  const summaryVal = inpSummary ? inpSummary.value.trim() : '';
  const chkSummary = document.getElementById('chk-summary');
  if (summaryVal.length >= 35) {
    score += 20;
    if (chkSummary) {
      chkSummary.className = 'done';
      chkSummary.textContent = '✅ ملخص مهني واضح ومكتمل';
    }
  } else if (chkSummary) {
    chkSummary.className = 'pending';
    chkSummary.textContent = '⚪ ملخص مهني واضح ومكتمل';
  }

  // 3. الخبرة المهنية
  const hasExp = experiences.some(e => (e.role && e.role.trim().length > 2) || (e.company && e.company.trim().length > 2));
  const chkExp = document.getElementById('chk-experience');
  if (hasExp) {
    score += 20;
    if (chkExp) {
      chkExp.className = 'done';
      chkExp.textContent = '✅ خبرة مهنية واحدة على الأقل';
    }
  } else if (chkExp) {
    chkExp.className = 'pending';
    chkExp.textContent = '⚪ خبرة مهنية واحدة على الأقل';
  }

  // 4. التعليم
  const hasEdu = educations.some(e => (e.degree && e.degree.trim().length > 2) || (e.school && e.school.trim().length > 2));
  const chkEdu = document.getElementById('chk-education');
  if (hasEdu) {
    score += 20;
    if (chkEdu) {
      chkEdu.className = 'done';
      chkEdu.textContent = '✅ المؤهل الأكاديمي والتعليمي';
    }
  } else if (chkEdu) {
    chkEdu.className = 'pending';
    chkEdu.textContent = '⚪ المؤهل الأكاديمي والتعليمي';
  }

  // 5. المهارات
  const skillsVal = inpSkills ? inpSkills.value.trim() : '';
  const skillsCount = skillsVal ? skillsVal.split(/[\n,،]+/).filter(s => s.trim().length > 0).length : 0;
  const chkSkills = document.getElementById('chk-skills');
  if (skillsCount >= 4) {
    score += 20;
    if (chkSkills) {
      chkSkills.className = 'done';
      chkSkills.textContent = `✅ إضافة 4 مهارات أساسية فأكثر (${skillsCount} حالياً)`;
    }
  } else if (chkSkills) {
    chkSkills.className = 'pending';
    chkSkills.textContent = `⚪ إضافة 4 مهارات أساسية فأكثر (الحالي: ${skillsCount})`;
  }

  // تحديث الشريط الرقمي واللون
  const scoreBadge = document.getElementById('atsScoreText');
  const progressFill = document.getElementById('atsProgressFill');

  if (scoreBadge) scoreBadge.textContent = `${score}%`;
  if (progressFill) {
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

// ==========================================
// 7. مسح وتعبئة النموذج التجريبي
// ==========================================
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    if (confirm('هل ترغب في مسح جميع البيانات والبدء من جديد؟')) {
      [inpName, inpTitle, inpEmail, inpPhone, inpLocation, inpLink, inpSummary, inpSkills].forEach(el => {
        if (el) el.value = '';
      });
      experiences = [{ role: '', company: '', dates: '', desc: '' }];
      educations = [{ degree: '', school: '', dates: '' }];
      certifications = [];
      localStorage.removeItem('ats_cv_unified_draft');
      updatePersonalInfo();
      renderExperiences();
      renderEducation();
      renderCertifications();
      calculateAtsScore();
    }
  });
}

if (loadDemoBtn) {
  loadDemoBtn.addEventListener('click', () => {
    if (currentLang === 'ar') {
      inpName.value = 'محمد بن خالد';
      inpTitle.value = 'مهندس برمجيات وواجهات ويب';
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
          desc: 'تطوير وتحديث واجهات 5 منتجات رقمية زادت من تفاعل المستخدمين بنسبة 35%.\nتحسين سرعة تحميل الصفحات بنسبة 40% عبر كتابة كود نظيف وتخفيف المكتبات الخارجية.\nالتعاون مع فرق التصميم لبناء واجهات متماسكة.'
        },
        {
          role: 'Junior Web Developer',
          company: 'وكالة مسار الرقمية',
          dates: '2021 - 2023',
          desc: 'بناء واجهات مواقع متوافقة مع جميع مقاسات الشاشات والهواتف الذكية.\nتحويل ملفات التصميم إلى صفحات ويب حية بدقة بكسل كاملة.'
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
        }
      ];

      educations = [
        {
          degree: 'B.Sc. in Computer Science',
          school: 'King Abdulaziz University',
          dates: '2018 - 2022'
        }
      ];

      certifications = [];
    }

    updatePersonalInfo();
    renderExperiences();
    renderEducation();
    renderCertifications();
    saveAllData();
    calculateAtsScore();
  });
}

// ==========================================
// 8. تبديل اللغة (عربي / English)
// ==========================================
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

if (langToggleBtn) {
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
    if (loadDemoBtn) loadDemoBtn.textContent = t.loadDemo;
    if (clearBtn) clearBtn.textContent = t.clearBtn;
    if (printBtn) printBtn.textContent = t.print;
    if (addExpBtn) addExpBtn.textContent = t.addExp;
    if (addEduBtn) addEduBtn.textContent = t.addEdu;
    
    const formTitleEl = document.getElementById('formTitle');
    const formSubEl = document.getElementById('formSub');
    const lblPersonalEl = document.getElementById('lblPersonalInfo');
    const lblSummaryEl = document.getElementById('lblSummary');
    const lblExpEl = document.getElementById('lblExperience');
    const lblEduEl = document.getElementById('lblEducation');
    const lblSkillsEl = document.getElementById('lblSkills');
    const cvHeadSumm = document.getElementById('cvHeadingSummary');
    const cvHeadExp = document.getElementById('cvHeadingExp');
    const cvHeadEdu = document.getElementById('cvHeadingEdu');
    const cvHeadSkills = document.getElementById('cvHeadingSkills');

    if (formTitleEl) formTitleEl.textContent = t.formTitle;
    if (formSubEl) formSubEl.textContent = t.formSub;
    if (lblPersonalEl) lblPersonalEl.textContent = t.lblPersonal;
    if (lblSummaryEl) lblSummaryEl.textContent = t.lblSummary;
    if (lblExpEl) lblExpEl.textContent = t.lblExp;
    if (lblEduEl) lblEduEl.textContent = t.lblEdu;
    if (lblSkillsEl) lblSkillsEl.textContent = t.lblSkills;
    if (cvHeadSumm) cvHeadSumm.textContent = t.headSummary;
    if (cvHeadExp) cvHeadExp.textContent = t.headExp;
    if (cvHeadEdu) cvHeadEdu.textContent = t.headEdu;
    if (cvHeadSkills) cvHeadSkills.textContent = t.headSkills;

    updatePersonalInfo();
    renderExperiences();
    renderEducation();
    saveAllData();
  });
}

// ==========================================
// 9. الطباعة
// ==========================================
if (printBtn) {
  printBtn.addEventListener('click', () => {
    window.print();
  });
}

// ==========================================
// 10. بدء التشغيل
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  loadAllData();
});
