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
  appDownloadUrl: 'https://englishtest.duolingo.com/mdownload',
  partnerLevel: 'Member',
  // TODO: replace with the exact title on Lenny's DET trainer certificate once
  // Lina shares it. Until then this is the wording, on both language versions.
  trainerTitle: { en: 'Duolingo English Test trainer', bg: 'Обучител за Duolingo English Test' },
};

/** The other tests in the comparison table. Prices are this provider's in Sofia. */
export const otherTests = {
  ieltsAcademicEur: 271,
  cambridgeC1Eur: 248,
};
