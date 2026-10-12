import { describe, it, expect } from 'vitest';
import { esc } from '../src/utils.js';

describe('esc', () => {
  it('escapes HTML special characters', () => {
    expect(esc('<img src=x onerror=alert(1)> "hi"')).toBe('&lt;img src=x onerror=alert(1)&gt; &quot;hi&quot;');
  });
  it('escapes ampersands and single quotes', () => {
    expect(esc("Tom & Jerry's")).toBe('Tom &amp; Jerry&#39;s');
  });
  it('returns an empty string for null and undefined', () => {
    expect(esc(null)).toBe('');
    expect(esc(undefined)).toBe('');
  });
  it('keeps Arabic text unchanged', () => {
    expect(esc('مهندسة برمجيات')).toBe('مهندسة برمجيات');
  });
});
