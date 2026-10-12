import { describe, it, expect } from 'vitest';
import { tokenize, analyzeMatch } from '../src/match.js';

describe('tokenize', () => {
  it('lowercases and removes stop words', () => {
    expect(tokenize('JavaScript and React')).toEqual(['javascript', 'react']);
  });
  it('drops very short tokens', () => {
    expect(tokenize('go to it')).toEqual([]);
  });
  it('keeps Arabic words of 3+ letters and drops Arabic stop words', () => {
    const t = tokenize('نبحث عن مطورة واجهات');
    expect(t).toContain('مطورة');
    expect(t).toContain('واجهات');
    expect(t).not.toContain('عن');
  });
  it('handles empty input', () => {
    expect(tokenize('')).toEqual([]);
    expect(tokenize(undefined)).toEqual([]);
  });
});

describe('analyzeMatch', () => {
  const job = 'We need React React TypeScript and Git experience with REST APIs';
  it('splits keywords into found and missing', () => {
    const r = analyzeMatch(job, 'I build apps with React and Git');
    expect(r.found).toContain('react');
    expect(r.found).toContain('git');
    expect(r.missing).toContain('typescript');
  });
  it('is case-insensitive', () => {
    expect(analyzeMatch('Need REACT', 'react developer').found).toContain('react');
  });
  it('ranks repeated keywords first', () => {
    expect(analyzeMatch(job, '').top[0]).toBe('react');
  });
  it('reports 100% coverage when every keyword is present', () => {
    expect(analyzeMatch('react git', 'react git').coverage).toBe(100);
  });
  it('reports 0 coverage for an empty job description', () => {
    const r = analyzeMatch('', 'anything');
    expect(r.top).toHaveLength(0);
    expect(r.coverage).toBe(0);
  });
  it('limits the number of keywords', () => {
    const many = Array.from({ length: 30 }, (_, i) => 'keyword' + i).join(' ');
    expect(analyzeMatch(many, '').top).toHaveLength(15);
  });
});
