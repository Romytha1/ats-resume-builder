import { describe, it, expect } from 'vitest';
import { computeScore, countSkills } from '../src/score.js';

const full = {
  email: 'a@b.com',
  phone: '0501234567',
  summary: 'x'.repeat(35),
  experiences: [{ role: 'Developer', company: 'Acme' }],
  educations: [{ degree: 'BSc', school: 'KAU' }],
  skills: 'HTML, CSS, JS, Git'
};

describe('computeScore', () => {
  it('returns 0 for an empty resume', () => {
    expect(computeScore({}).score).toBe(0);
  });
  it('returns 100 for a complete resume', () => {
    expect(computeScore(full).score).toBe(100);
  });
  it('requires both a valid email and a phone for contact', () => {
    expect(computeScore({ email: 'a@b.com', phone: '' }).checks.contact).toBe(false);
    expect(computeScore({ email: 'not-an-email', phone: '0501234567' }).checks.contact).toBe(false);
    expect(computeScore({ email: 'a@b.com', phone: '0501234567' }).checks.contact).toBe(true);
  });
  it('requires a summary of at least 35 characters', () => {
    expect(computeScore({ summary: 'x'.repeat(34) }).checks.summary).toBe(false);
    expect(computeScore({ summary: 'x'.repeat(35) }).checks.summary).toBe(true);
  });
  it('ignores empty experience and education entries', () => {
    const r = computeScore({ experiences: [{ role: '', company: '' }], educations: [{ degree: ' ', school: '' }] });
    expect(r.checks.experience).toBe(false);
    expect(r.checks.education).toBe(false);
  });
  it('adds 20 points per passed check', () => {
    expect(computeScore({ email: 'a@b.com', phone: '0501234567' }).score).toBe(20);
  });
});

describe('countSkills', () => {
  it('counts comma, Arabic comma and newline separated skills', () => {
    expect(countSkills('HTML, CSS،JS\nGit')).toBe(4);
  });
  it('returns 0 for empty input', () => {
    expect(countSkills('')).toBe(0);
    expect(countSkills(undefined)).toBe(0);
  });
  it('needs 4 skills to pass the skills check', () => {
    expect(computeScore({ skills: 'a1, b2, c3' }).checks.skills).toBe(false);
    expect(computeScore({ skills: 'a1, b2, c3, d4' }).checks.skills).toBe(true);
  });
});
