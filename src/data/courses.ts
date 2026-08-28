/**
 * Course pricing — the single source of truth.
 *
 * Why this file exists: the prices used to live as literals in lessons.astro AND
 * again in public/llms.txt, so the two drifted. In August 2026 the five-lesson
 * bundle read €215 on the page (5% off €225 is €213), and llms.txt had the
 * Personal Speaking Coach at €45 with the wrong bundles when the page said €50.
 * Both files now render these values, so a price can only be wrong in one place.
 *
 * Add a price here before rendering it anywhere. Do not type a figure into a
 * template.
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
    bundles: [],
  },
  personalSpeakingCoach: {
    name: 'Personal Speaking Coach',
    summary: '1:1 online coaching, flexible schedule, B1 and above',
    perLesson: 50,
    total: null,
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
    bundles: [
      { lessons: 5, price: 213, savePercent: 5 },
      { lessons: 10, price: 405, savePercent: 10 },
    ],
  },
  // Note: sold at the same per-lesson rate as General and Business English but
  // with no bundle, and the lessons page does not say how long a lesson is.
  // Flagged Aug 2026, left as-is pending a decision.
  examPreparation: {
    name: 'Exam Preparation',
    summary: 'IELTS and Cambridge CAE, 1:1 online',
    perLesson: 45,
    total: null,
    bundles: [],
  },
  corporateTraining: {
    name: 'Corporate Training',
    summary:
      'tailored Business English programmes for companies in Sofia, 1:1 and small group sessions',
    perLesson: null,
    total: null,
    bundles: [],
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
 * "€45/lesson (bundle: 5 lessons €213, 10 lessons €405)" — the price half of an
 * llms.txt course line. Empty string when a course has no published price.
 */
export function priceSummary(course: Course): string {
  const parts: string[] = [];
  if (course.total !== null) {
    parts.push(`€${course.total} total`);
    if (course.perLesson !== null) parts.push(`€${course.perLesson}/lesson`);
  } else if (course.perLesson !== null) {
    parts.push(`€${course.perLesson}/lesson`);
  }
  if (course.bundles.length > 0) {
    const bundles = course.bundles
      .map(b => `${b.lessons} lessons €${b.price}`)
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
