// منطق نسبة جاهزية السيرة: دوال نقية (لا تلمس الصفحة) فيسهل اختبارها.
export const MIN_PHONE_LENGTH = 8;
export const MIN_SUMMARY_LENGTH = 35;
export const MIN_SKILLS = 4;
const POINTS_PER_CHECK = 20; // 5 معايير × 20 = 100

const hasText = (v) => typeof v === 'string' && v.trim().length > 2;

export function countSkills(skills) {
  const text = (skills || '').trim();
  return text ? text.split(/[\n,،]+/).filter((s) => s.trim().length > 0).length : 0;
}

export function computeScore({ email = '', phone = '', summary = '', experiences = [], educations = [], skills = '' } = {}) {
  const skillsCount = countSkills(skills);
  const checks = {
    contact: (email || '').trim().includes('@') && (phone || '').trim().length >= MIN_PHONE_LENGTH,
    summary: (summary || '').trim().length >= MIN_SUMMARY_LENGTH,
    experience: experiences.some((e) => hasText(e.role) || hasText(e.company)),
    education: educations.some((e) => hasText(e.degree) || hasText(e.school)),
    skills: skillsCount >= MIN_SKILLS
  };
  const score = Object.values(checks).filter(Boolean).length * POINTS_PER_CHECK;
  return { score, checks, skillsCount };
}
