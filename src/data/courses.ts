/**
 * Course pricing — the single source of truth.
 *
 * Why this file exists: the prices used to live as literals in lessons.astro AND
 * again in public/llms.txt, so the two drifted. In August 2026 the five-lesson
 * bundle read €215 on the page (5% off €225 is €213), and llms.txt had the
 * Personal Speaking Coach at €45 with the wrong bundles when the page said €50.
 * Both files now render these values, so a price can only be wrong in one place.
 *
 * The same applies to lesson length. Every course runs 90 minutes, but the site
 * used to say so only in a bullet on three of six cards, so visitors read the
 * per-lesson prices as hourly rates and the courses looked dearer than they are.
 * lessonMinutes is rendered into the price label itself on every card, in
 * llms.txt and in the JSON-LD.
 *
 * Add a price or a duration here before rendering it anywhere. Do not type a
 * figure into a template.
 */

export interface CourseBundle {
  lessons: number;
  price: number;
  /** Shown on the lessons page as "save N%". Enforced at build time against
   *  Math.floor(perLesson * lessons * (1 - savePercent / 100)) — see the guard
   *  at the bottom of this file. */
  savePercent: number;
}

export interface Course {
  /** Display name, used on the lessons page and in llms.txt. */
  name: string;
  /** One-line summary for llms.txt. Prices are NOT written here — they are
   *  appended from the fields below so the two can never disagree. */
  summary: string;
  /** Null where a course is not sold per lesson. */
  perLesson: number | null;
  /** Null unless the course is sold as one fixed block, like Speak Up!. */
  total: number | null;
  /** Length of one lesson or session, in minutes. Required, not optional: a
   *  price without a duration is what caused this whole problem. Every course
   *  is currently 90. */
  lessonMinutes: number;
  /** The noun in customer-facing labels — "per 90-minute lesson" vs "per
   *  90-minute session". Corporate training has always said "session" and the
   *  corporate page keeps that wording. */
  unitNoun: 'lesson' | 'session';
  bundles: CourseBundle[];
}

export const currency = 'EUR';

export const courses = {
  speakUp: {
    name: 'Speak Up! Group English Course',
    summary:
      'structured group speaking programme, 12 lessons over 6 weeks, max 8 students, online, B1 and above',
    perLesson: 24,
    total: 290,
    lessonMinutes: 90,
    unitNoun: 'lesson',
    bundles: [],
  },
  personalSpeakingCoach: {
    name: 'Personal Speaking Coach',
    summary: '1:1 online coaching, flexible schedule, B1 and above',
    perLesson: 50,
    total: null,
    lessonMinutes: 90,
    unitNoun: 'lesson',
    bundles: [
      { lessons: 5, price: 237, savePercent: 5 },
      { lessons: 10, price: 450, savePercent: 10 },
    ],
  },
  generalEnglish: {
    name: 'General English (1:1)',
    summary: 'individual lessons',
    perLesson: 45,
    total: null,
    lessonMinutes: 90,
    unitNoun: 'lesson',
    bundles: [
      { lessons: 5, price: 213, savePercent: 5 },
      { lessons: 10, price: 405, savePercent: 10 },
    ],
  },
  businessEnglish: {
    name: 'Business English (1:1)',
    summary: 'tailored to professional goals',
    perLesson: 45,
    total: null,
    lessonMinutes: 90,
    unitNoun: 'lesson',
    bundles: [
      { lessons: 5, price: 213, savePercent: 5 },
      { lessons: 10, price: 405, savePercent: 10 },
    ],
  },
  // Note: sold at the same per-lesson rate as General and Business English but
  // with no bundle. The missing duration was fixed in Aug 2026; the absent
  // bundle is still deliberate-or-not and unresolved.
  examPreparation: {
    name: 'Exam Preparation',
    summary: 'IELTS and Cambridge CAE, 1:1 online',
    perLesson: 45,
    total: null,
    lessonMinutes: 90,
    unitNoun: 'lesson',
    bundles: [],
  },
  // €60 is deliberately above the €45 individual rate, for the same 90 minutes.
  // These figures lived as literals in corporate-training.astro — once in the
  // visible price block and again in that page's JSON-LD, so the two could
  // disagree with each other without anyone noticing. They render from here now.
  corporateTraining: {
    name: 'Corporate Training',
    summary:
      'tailored Business English programmes for companies in Sofia, 1:1 and small group sessions',
    perLesson: 60,
    total: null,
    lessonMinutes: 90,
    unitNoun: 'session',
    bundles: [
      { lessons: 10, price: 540, savePercent: 10 },
    ],
  },
} satisfies Record<string, Course>;

/** Order used in llms.txt. */
export const courseList: Course[] = [
  courses.speakUp,
  courses.personalSpeakingCoach,
  courses.generalEnglish,
  courses.businessEnglish,
  courses.examPreparation,
  courses.corporateTraining,
];

/**
 * "€45/90-minute lesson (bundle: 5 lessons €213, 10 lessons €405)" — the price
 * half of an llms.txt course line. Empty string when a course has no published
 * price.
 *
 * The duration is in the rate itself, not appended as a note. llms.txt is what
 * an AI assistant reads when someone asks it about the school, and it has no
 * layout to carry the information anywhere else.
 */
export function priceSummary(course: Course): string {
  const unit = `${course.lessonMinutes}-minute ${course.unitNoun}`;
  const parts: string[] = [];
  if (course.total !== null) {
    parts.push(`€${course.total} total`);
    if (course.perLesson !== null) parts.push(`€${course.perLesson}/${unit}`);
  } else if (course.perLesson !== null) {
    parts.push(`€${course.perLesson}/${unit}`);
  }
  if (course.bundles.length > 0) {
    const bundles = course.bundles
      .map(b => `${b.lessons} ${course.unitNoun}s €${b.price}`)
      .join(', ');
    parts.push(`bundle: ${bundles}`);
  }
  if (parts.length === 0) return '';
  const [head, ...rest] = parts;
  return rest.length > 0 ? `${head} (${rest.join('; ')})` : head;
}

/**
 * Build-time guard.
 *
 * Astro imports this module during `npm run build`, so a throw here fails the
 * build rather than shipping a wrong price. This is the check that would have
 * caught the €215 bundle: 5% off €225 is €213.75, and the page said €215.
 *
 * Convention: bundle prices round DOWN to the whole euro. €237 is floor(237.5)
 * and €213 is floor(213.75), so both are consistent with the advertised saving.
 * If you intend a price that does not match its stated saving, change the
 * savePercent to match — do not weaken this check.
 */
for (const [key, course] of Object.entries(courses)) {
  for (const bundle of course.bundles) {
    if (course.perLesson === null) {
      throw new Error(
        `courses.${key}: has bundles but no perLesson rate, so the saving cannot be verified.`
      );
    }
    const expected = Math.floor(
      course.perLesson * bundle.lessons * (1 - bundle.savePercent / 100)
    );
    if (bundle.price !== expected) {
      throw new Error(
        `courses.${key}: the ${bundle.lessons}-lesson bundle is €${bundle.price}, but ` +
          `${bundle.savePercent}% off ${bundle.lessons} × €${course.perLesson} is €${expected}. ` +
          `Fix the price or the savePercent — one of them is wrong.`
      );
    }
  }
}

export default courses;
