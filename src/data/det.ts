/**
 * Duolingo English Test (DET) page – the facts and figures, in one place.
 *
 * Every number on /duolingo-english-test and /bg/duolingo-english-test renders
 * from here, so the two language versions cannot disagree. Do not type a
 * figure into either template.
 *
 * Sources, checked November 2026:
 *  - DET Global Partner Network brochure (Apr 2026): 6,300+ institutions,
 *    results within 2 days, unlimited free score sending, and – for partners at
 *    Member level and above – priority results within 24 hours at no extra cost
 *    for students who buy with the partner's invite code. Immersion English is
 *    at Member level (confirmed by Lina, 13 Nov 2026).
 *  - englishtest.duolingo.com security page: session recorded via computer,
 *    phone camera, microphone, keyboard and mouse; human proctors with AI
 *    review every session; test cancelled if another app is opened.
 *  - DET blog, "How is the Duolingo English Test scored": 10–160 in 5-point
 *    steps, subscores for reading, writing, listening and speaking.
 *  - DET blog, secondary camera set-up: a smartphone is required.
 *  - britishcouncil.bg (12 Nov 2026): IELTS Academic €271, Cambridge C1
 *    Advanced €248, IELTS results 1–5 days on computer, 6–8 days online.
 *    The comparison does not name the provider, on the site owner's instruction.
 */

export const det = {
  /** Official price, the same in every country (tax may be added at checkout). */
  priceUsd: 70,
  /** Rounded euro equivalent shown on the page. */
  priceEurApprox: 60,
  institutions: '6,300+',
  institutionsBg: '6 300+',
  resultsDays: 2,
  /** Priority results for students who buy with our invite code (Member level). */
  partnerResultsHours: 24,
  testMinutes: 60,
  daysToTakeAfterPurchase: 21,
  scoreMin: 10,
  scoreMax: 160,
  validityYears: 2,
  ukUniversities: '130',
  /** Lenny's free DET practice test (a published Claude artifact). */
  practiceTestUrl: 'https://claude.ai/artifact/5JEvezW72S7JLnidVwN6pM',
  appDownloadUrl: 'https://englishtest.duolingo.com/mdownload',
  partnerLevel: 'Member',
  /** Test structure, from Duolingo's official test taker guide (Nov 2026). */
  format: { setupMin: 5, adaptiveMin: 45, samplesMin: 10, writingSampleMin: '3–5', speakingSampleMin: '1–3' },
  /** Question types by skill, as named in the official guide. English names on both pages – that is what students see on screen. */
  questionTypes: {
    reading: ['Read and Select', 'Fill in the Blanks', 'Read and Complete', 'Interactive Reading'],
    listening: ['Listen and Type', 'Interactive Listening'],
    writing: ['Write About the Photo', 'Interactive Writing', 'Writing Sample'],
    speaking: ['Speak About the Photo', 'Read, Then Speak', 'Interactive Speaking', 'Speaking Sample'],
  },
  /** DET score ranges against CEFR levels, as on Duolingo's own score comparison chart. */
  cefrBands: [
    { range: '60–95', cefr: 'B1' },
    { range: '100–125', cefr: 'B2' },
    { range: '130–150', cefr: 'C1' },
    { range: '155–160', cefr: 'C2' },
  ],
  /** Typical university requirement. A guide only – each programme sets its own. */
  typicalAsk: '105–125',
  scoresUrl: 'https://englishtest.duolingo.com/prepare/scores',
  // TODO: replace with the exact title on Lenny's DET trainer certificate once
  // Lina shares it. Until then this is the wording, on both language versions.
  trainerTitle: { en: 'Duolingo English Test trainer', bg: 'Обучител за Duolingo English Test' },
};

/** The other tests in the comparison table. Prices are this provider's in Sofia. */
export const otherTests = {
  ieltsAcademicEur: 271,
  cambridgeC1Eur: 248,
};
