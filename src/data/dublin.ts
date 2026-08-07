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
    street: string;
    postcode: string;
    country: string;
    /** Luas stop serving the campus. */
    transit: string;
    /** Query string for a Google Maps embed. No API key needed. */
    mapsQuery: string;
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
  /**
   * Applies to Bulgarian passport holders only. Bulgaria is an EU member
   * state; Ireland grants free movement to EU citizens for tourism and
   * short study stays, so no visa applies to this group. MLA's own T&Cs
   * reference a C-Visa (Ireland) process, but that applies to non-EU
   * nationals — do not imply it's relevant to our students.
   */
  visaRequired: boolean;
  included: string[];
  notIncluded: string[];
  excursions: Excursion[] | null;
  groupLeader: { name: string; role: string; credential: string | null; teaches: boolean };
  /** The second adult travelling with the group. Name withheld by design —
   *  described by role only. Null if no second chaperone is confirmed. */
  secondChaperone: { name: string | null; role: string } | null;
  /** Confirmed to cover classes. Residence + evening activities NOT yet confirmed. */
  ageGroupingScope: {
    classes: boolean;
    residence: boolean | null;
    eveningActivities: boolean | null;
  };
}

/**
 * Human-readable duration label, e.g. "1, 2, 3 or 4 weeks".
 * Derived here so templates never re-implement it. Previously duplicated in
 * index.astro and faqs.astro.
 */
export function durationLabel(weeks: number[]): string {
  if (weeks.length === 0) return '';
  if (weeks.length === 1) return `${weeks[0]} week`;
  return `${weeks.slice(0, -1).join(', ')} or ${weeks[weeks.length - 1]} weeks`;
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

  // Address verified against ncirl.ie and the IFSC business directory, Aug 2026.
  // The campus is two buildings — Mayor Square and Spencer Dock — about 300m apart.
  venue: {
    name: 'National College of Ireland',
    shortName: 'NCI',
    city: 'Dublin',
    area: 'Dublin Docklands',
    street: 'Mayor Street, IFSC',
    postcode: 'D01 K6W2',
    country: 'Ireland',
    transit: 'Mayor Square – NCI (Luas Red Line)',
    mapsQuery: 'National College of Ireland, Mayor Street, IFSC, Dublin 1, D01 K6W2',
  },

  // This is the age range of the IMMERSION ENGLISH GROUP, not the centre's limit.
  // MLA's catalogue (Junior Programmes 2026, p.44) lists the NCI centre as taking
  // ages 12-20, and the approved copy said 12-20 as well. Narrowed to 12-17 on the
  // site owner's instruction — a narrower group inside a wider centre is a normal
  // arrangement, but it means copy must describe OUR group and must not state this
  // as the centre's own age limit, which would be false.
  ages: { min: 12, max: 17 },
  classSize: { average: 13, maximum: 18 },
  lessonsPerWeek: 20,
  hoursPerWeek: 15,
  durationsWeeks: [1, 2, 3, 4],

  // TODO: awaiting MLA 2027 confirmation — 2027 departure dates not yet published.
  startDates: null,

  price: {
    currency: 'EUR',
    // Retail price is Immersion English's own decision — separate from MLA's
    // net rate, which never appears publicly. Not contingent on MLA confirmation.
    fromAmount: 1550,
    // TODO: awaiting MLA 2027 confirmation — deposit terms pending 2027 T&Cs.
    depositPercent: null,
    depositDue: null,
    balanceDue: null,
  },

  // Confirmed in the approved copy.
  securityDeposit: { currency: 'EUR', amount: 50 },
  airportTransferFrom: { currency: 'EUR', amount: 35 },
  visaRequired: false,

  included: [
    '20 lessons every week (15 hours) – with qualified native-speaker teachers at the centre',
    'En-suite accommodation on campus – at the National College of Ireland, in the heart of Dublin',
    'Full board – from dinner on the day of arrival to breakfast on the day of departure',
    'The full excursion programme – transport and entry tickets included, nothing extra to pay',
    "Evening and weekend activities – run by the centre's own activity team",
    'Placement test, course eBook and student portfolio – so parents can see exactly what a week achieved',
    'An Immersion English group leader – with the group from the gate in Sofia to the arrivals hall home',
  ],

  notIncluded: [
    'Flights',
    'Airport transfers (from €35 each way)',
    'Travel and medical insurance',
    'Personal spending',
  ],

  // SOURCE: MLA "Move Language Ahead – Junior Programmes 2026" catalogue, p.44,
  // the Dublin / National College of Ireland centre. This is MLA's own published
  // excursion programme, transcribed — not invented, and not the UCD-era list.
  //
  // CAVEAT: taken from the 2026 catalogue because the 2027 edition is not out.
  // MLA has not confirmed the 2027 programme in writing. Excursions at a centre
  // are usually stable year to year, but treat this as "MLA's published Dublin
  // programme" rather than a 2027 guarantee until they confirm.
  //
  // Note for anyone tempted to re-add the old cards: Trinity College, the Book of
  // Kells, Dublin Castle, Glendalough, Kilkenny, the Wicklow Mountains, Dublin Zoo
  // and Dundrum are NOT on MLA's list. Howth, St Patrick's Cathedral, St Stephen's
  // Green and Grafton Street are — that overlap is a coincidence, not a carry-over.
  excursions: [
    {
      title: 'Galway',
      description:
        'A walking tour of the charming city in western Ireland, travelling by private bus with MLA local staff.',
      duration: 'full-day',
    },
    {
      title: 'Howth',
      description:
        "A picturesque fishing village on the Irish cliffs, known for its traditional fish and chips.",
      duration: 'full-day',
      image: '/howth.webp',
    },
    {
      title: 'Georgian Walking Tour',
      description:
        'Discover Georgian Dublin, with its well-preserved architectural heritage.',
      duration: 'half-day',
      image: '/georgian-walking-tour.webp',
    },
    {
      title: "St Patrick's Cathedral",
      description:
        "Ireland's largest church, founded near the well where the patron saint of Ireland baptised converts around 450 AD. Entrance ticket included.",
      duration: 'half-day',
      image: '/st-patricks-cathedral.webp',
    },
    {
      title: "St Stephen's Green & Temple Bar",
      description:
        "Relax in one of the city's green lungs, then Temple Bar by night – one of Dublin's oldest and most characterful neighbourhoods.",
      duration: 'half-day',
      image: '/st-stephens-green.webp',
    },
    {
      title: "George's Street Arcade & Grafton Street",
      description:
        'The covered Victorian arcade, followed by shopping on Grafton Street.',
      duration: 'half-day',
      image: '/grafton-street.webp',
    },
    {
      title: 'EPIC Museum',
      description:
        'The Irish Emigration Museum – step into what it truly means to be Irish. Entrance ticket included.',
      duration: 'half-day',
    },
  ],

  groupLeader: {
    name: 'Lenny',
    role: 'Group leader',
    // Trust/credibility signal only — see `teaches` below. He is Cambridge
    // CELTA-qualified, but that is not the same claim as teaching this
    // programme's classes, which belong to the centre's own teaching team.
    credential: 'Cambridge CELTA-qualified',
    // Immersion English does not teach on this programme. MLA's centre staff do.
    // No template may render a teaching claim for Dublin. This is always false.
    teaches: false,
  },

  // Name withheld by site owner's instruction — described by role only.
  secondChaperone: {
    name: null,
    role: 'Native Bulgarian speaker',
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
