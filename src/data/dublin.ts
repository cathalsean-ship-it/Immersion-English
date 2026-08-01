/**
 * Dublin Summer 2027 — single source of truth.
 *
 * Immersion English is a BOOKING AGENT for MLA (Move Language Ahead) and
 * accompanies its own group to MLA's summer centre at the National College of
 * Ireland. It does not run, teach, or accommodate the programme.
 *
 * RULES FOR THIS FILE
 * 1. `null` means MLA has not confirmed the 2027 value. Templates must render a
 *    TODO comment for a null field — never a placeholder, never `0`, never an
 *    empty string that leaves a dangling label, and never a carried-over
 *    UCD-era figure.
 * 2. Do not populate a null field from the 2026 catalogue, from the old UCD
 *    programme, or from an estimate. It gets filled in from MLA's written 2027
 *    confirmation or it stays null.
 */

export interface Excursion {
  title: string;
  description: string;
  /** 'full-day' | 'half-day' — per MLA's published programme, not ours. */
  duration: 'full-day' | 'half-day';
  image?: string;
}

export interface DublinProgramme {
  year: number;
  provider: {
    brand: string;
    legalEntity: string;
    termsUrl: string | null;
    safeguardingUrl: string | null;
  };
  venue: {
    name: string;
    shortName: string;
    city: string;
    area: string;
  };
  ages: { min: number; max: number };
  classSize: { average: number; maximum: number };
  lessonsPerWeek: number;
  hoursPerWeek: number;
  durationsWeeks: number[];
  startDates: string[] | null;
  price: {
    currency: string;
    fromAmount: number | null;
    depositPercent: number | null;
    depositDue: string | null;
    balanceDue: string | null;
  };
  securityDeposit: { currency: string; amount: number };
  airportTransferFrom: { currency: string; amount: number };
  included: string[];
  notIncluded: string[];
  excursions: Excursion[] | null;
  groupLeader: { name: string; role: string; teaches: boolean };
  /** Confirmed to cover classes. Residence + evening activities NOT yet confirmed. */
  ageGroupingScope: {
    classes: boolean;
    residence: boolean | null;
    eveningActivities: boolean | null;
  };
}

export const dublin: DublinProgramme = {
  year: 2027,

  provider: {
    brand: 'MLA – Move Language Ahead',
    legalEntity: 'Vision Language Academy Ltd',
    // TODO: awaiting MLA 2027 confirmation — no URL supplied in the approved copy.
    termsUrl: null,
    // TODO: awaiting MLA 2027 confirmation — no URL supplied in the approved copy.
    safeguardingUrl: null,
  },

  venue: {
    name: 'National College of Ireland',
    shortName: 'NCI',
    city: 'Dublin',
    area: 'Dublin Docklands',
  },

  ages: { min: 12, max: 20 },
  classSize: { average: 13, maximum: 18 },
  lessonsPerWeek: 20,
  hoursPerWeek: 15,
  durationsWeeks: [1, 2, 3, 4],

  // TODO: awaiting MLA 2027 confirmation — 2027 departure dates not yet published.
  startDates: null,

  price: {
    currency: 'EUR',
    // TODO: awaiting MLA 2027 confirmation — retail price pending 2027 net rates.
    fromAmount: null,
    // TODO: awaiting MLA 2027 confirmation — deposit terms pending 2027 T&Cs.
    depositPercent: null,
    depositDue: null,
    balanceDue: null,
  },

  // Confirmed in the approved copy.
  securityDeposit: { currency: 'EUR', amount: 50 },
  airportTransferFrom: { currency: 'EUR', amount: 35 },

  included: [
    '20 lessons every week (15 hours) – with qualified native-speaker teachers at the centre',
    'En-suite accommodation on campus – at the National College of Ireland, in the heart of Dublin',
    'Full board – from dinner on the day of arrival to breakfast on the day of departure',
    'The full excursion programme – transport and entry tickets included, nothing extra to pay',
    "Evening and weekend activities – run by the centre's own activity team",
    'Free pre-departure online course – weekly lessons from the November before you fly',
    'Placement test, course eBook and student portfolio – so parents can see exactly what a week achieved',
    'An Immersion English group leader – with the group from the gate in Sofia to the arrivals hall home',
  ],

  notIncluded: [
    'Flights',
    'Airport transfers (from €35 each way)',
    'Travel and medical insurance',
    'Personal spending',
  ],

  // TODO: awaiting MLA 2027 confirmation — NCI excursion list, catalogue p.44.
  // The six UCD-era excursions were self-chosen by Immersion English and are NOT
  // MLA's programme. They must not be reinstated here.
  excursions: null,

  groupLeader: {
    name: 'Lenny',
    role: 'Group leader',
    // Immersion English does not teach on this programme. MLA's centre staff do.
    // No template may render a teaching claim for Dublin. This is always false.
    teaches: false,
  },

  ageGroupingScope: {
    classes: true,
    // TODO: awaiting MLA 2027 confirmation — written confirmation requested that
    // age grouping extends beyond classes.
    residence: null,
    eveningActivities: null,
  },
};

export default dublin;
