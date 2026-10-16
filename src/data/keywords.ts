/**
 * Search terms per section, in English and Bulgarian.
 *
 * Used for the meta keywords tag and the page's WebPage structured data.
 * Neither ranks a page on its own: Google ignores meta keywords and Bing gives
 * them little weight. What ranks is the same words appearing in VISIBLE text
 * (headings, body copy, alt text). Treat this list as the brief for that copy.
 *
 * Keep each list short and specific to the page. A long list repeated on every
 * page reads as keyword stuffing to Bing.
 *
 * Matched on the first path segment ('' is the homepage).
 */
export const keywordsBySection: Record<string, string[]> = {
  '': [
    'English lessons Sofia', 'native English teacher Sofia', 'English summer course Dublin for teens',
    'уроци по английски София', 'английски с носител на езика', 'летен езиков курс Дъблин',
    'езиков лагер Ирландия за тийнейджъри',
  ],
  lessons: [
    'online English lessons', 'English speaking course', 'private English tutor Sofia',
    'IELTS preparation Sofia', 'Cambridge C1 Advanced preparation',
    'онлайн уроци по английски', 'индивидуални уроци по английски', 'разговорен английски',
    'подготовка за IELTS', 'подготовка за CAE', 'курс по английски за възрастни',
  ],
  'corporate-training': [
    'Business English Sofia', 'corporate English training', 'English for teams',
    'бизнес английски', 'корпоративно обучение по английски', 'английски за фирми',
  ],
  'dublin-summer-2027': [
    'English summer course Dublin', 'summer English programme for teens Ireland',
    'National College of Ireland summer', 'English abroad for teenagers',
    'летен езиков курс Дъблин', 'езикова ваканция Ирландия', 'летен лагер по английски за тийнейджъри',
    'английски в чужбина за деца',
  ],
  about: [
    'native English teacher Sofia', 'Irish English teacher', 'CELTA-qualified teacher',
    'преподавател по английски носител на езика', 'ирландски учител по английски',
  ],
  contact: [
    'free English consultation Sofia', 'English level test',
    'безплатна консултация по английски', 'записване за курс по английски',
  ],
  blog: [
    'English learning tips', 'how to improve spoken English',
    'съвети за учене на английски', 'как да говоря по-добре английски',
  ],
};

export const keywordsFor = (pathname: string): string[] | undefined =>
  keywordsBySection[pathname.split('/').filter(Boolean)[0] ?? ''];
