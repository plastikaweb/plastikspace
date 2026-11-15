import { resolveReturnUrl } from './resolve-return-url';

describe('resolveReturnUrl', () => {
  const fallback = '/tauler';

  it.each([
    ['/socis', '/socis'],
    ['/comandes?estat=pendent', '/comandes?estat=pendent'],
    ['/productes/abc123#preus', '/productes/abc123#preus'],
    ['/', '/'],
    ['/accedir-ajuda', '/accedir-ajuda'],
  ])('follows the in-app path %s', (raw, expected) => {
    expect(resolveReturnUrl(raw, fallback)).toBe(expected);
  });

  it.each([
    ['a missing value', null],
    ['an undefined value', undefined],
    ['an empty value', ''],
    ['an absolute address', 'https://evil.example/'],
    ['a protocol-relative address', '//evil.example'],
    ['a backslash after the slash', '/\\evil.example'],
    ['a backslash further in', '/socis\\..\\x'],
    ['a lone backslash', '\\'],
    ['a relative path', 'socis'],
    ['a script address', 'javascript:alert(1)'],
    ['a tab that a browser would strip', '/\t/evil.example'],
    ['a line break', '/socis\nx'],
    ['a null character', '/socis\u0000'],
    ['the login screen', '/accedir'],
    ['the login screen with a query', '/accedir?returnUrl=/accedir'],
    ['the login screen with a fragment', '/accedir#x'],
    ['a child of the login screen', '/accedir/x'],
    ['a path the router cannot parse', '/socis(aux:'],
  ])('falls back on %s', (_label, raw) => {
    expect(resolveReturnUrl(raw, fallback)).toBe(fallback);
  });
});
