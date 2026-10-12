// مطابقة كلمات إعلان الوظيفة مع السيرة: دوال نقية قابلة للاختبار.
export const STOP_WORDS = new Set(('the and for with you your our are will have has from that this their they who all can able work ' +
  'team years year experience ability skills strong good plus use using including etc such new more other than into ' +
  'في من على إلى الى عن مع هذا هذه ذلك التي الذي أو او و ان أن كل لدى لديه يجب نحن أنت خبرة سنوات سنة مهارات القدرة ' +
  'العمل عمل فريق مطلوب نبحث عن ذات مثل أكثر بين خلال حول لدينا ضمن').split(/\s+/));

export function tokenize(text) {
  return ((text || '').toLowerCase().match(/[a-z][a-z0-9+#.]{1,}|[\u0600-\u06FF]{3,}/g) || [])
    .map((t) => t.replace(/\.+$/, ''))
    .filter((t) => t.length >= 3 && !STOP_WORDS.has(t));
}

export function analyzeMatch(jobText, cvText, maxKeywords = 15) {
  const freq = {};
  tokenize(jobText).forEach((t) => { freq[t] = (freq[t] || 0) + 1; });
  const top = Object.entries(freq)
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .slice(0, maxKeywords)
    .map((entry) => entry[0]);
  const raw = (cvText || '').toLowerCase();
  const have = new Set(tokenize(raw));
  const found = top.filter((k) => have.has(k) || raw.includes(k));
  const missing = top.filter((k) => !found.includes(k));
  const coverage = top.length ? Math.round((found.length / top.length) * 100) : 0;
  return { top, found, missing, coverage };
}
