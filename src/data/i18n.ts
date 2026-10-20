/**
 * English page -> Bulgarian page. The single list of which pages exist in
 * Bulgarian. BaseLayout reads it to emit hreflang tags (so Google shows each
 * language to the right searchers) and Nav reads it for the EN | БГ switch.
 *
 * Add a pair here only when the Bulgarian page actually exists.
 */
export const BG_PAGES: Record<string, string> = {
  '/': '/bg',
  '/dublin-summer-2027': '/bg/dublin-summer-2027',
};

export type Lang = 'en' | 'bg';

export function langOf(path: string): Lang {
  return path === '/bg' || path.startsWith('/bg/') ? 'bg' : 'en';
}

/** Both language versions of a page, or null if it exists in one language only. */
export function alternatesOf(path: string): { en: string; bg: string } | null {
  if (BG_PAGES[path]) return { en: path, bg: BG_PAGES[path] };
  const en = Object.keys(BG_PAGES).find(k => BG_PAGES[k] === path);
  return en !== undefined ? { en, bg: path } : null;
}

/** Where the language switch should go from this page. */
export function switchTarget(path: string): string {
  const alt = alternatesOf(path);
  if (langOf(path) === 'bg') return alt?.en ?? '/';
  return alt?.bg ?? '/bg';
}

/** Bulgarian page for an English link if one exists, else the English link. */
export function bgHref(enHref: string): string {
  const [path, hash] = enHref.split('#');
  const bg = BG_PAGES[path];
  return bg ? bg + (hash ? '#' + hash : '') : enHref;
}
