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
  /** Three fixed-length options, replacing the old single two-week stay.
   *  Each carries its own retail price and its own 2027 start dates — MLA
   *  prices and dates both vary by length, so they can't be shared fields. */
  durations: {
    days: number;
    nights: number;
    /** Retail price per student, EUR. Immersion English's own decision —
     *  separate from MLA's net rate, which never appears publicly. */
    price: number;
    /** DD/MM, 2027. Source: MLA's NCI centre start-date schedule, Oct 2026. */
    startDates: string[];
  }[];
  price: {
    currency: string;
    depositPercent: number | null;
    depositDue: string | null;
    balanceDue: string | null;
  };
  securityDeposit: { currency: string; amount: number };
  /**
   * Applies to Bulgarian passport holders only. Bulgaria is an EU member
   * state; Ireland grants free movement to EU citizens for tourism and
   * short study stays, so no visa applies to this group. MLA's own T&Cs
   * reference a C-Visa (Ireland) process, but that applies to non-EU
   * nationals — do not imply it's relevant to our students.
   */
  visaRequired: boolean;
  /** Sourced from MLA's price list T&Cs: "Medical Staff provided with a minimum
   *  of 200 students on site." Applies to the centre overall, not exclusively
   *  to our group — phrase copy accordingly. */
  medicalStaff: string;
  included: string[];
  notIncluded: string[];
  excursions: Excursion[] | null;
  groupLeader: {
    name: string;
    role: string;
    credential: string | null;
    teaches: boolean;
    /** Where the group leader joins the students. Render this rather than
     *  hardcoding a location, so one edit here moves every page. */
    meetsAt: string;
    /** False until it is actually settled that he flies out with them. */
    travelsFromSofia: boolean;
  };
  /** The second adult with the group in Dublin. Name withheld by design —
   *  described by role only. Null if no second chaperone is confirmed. */
  secondChaperone: { name: string | null; role: string } | null;
  /** Confirmed to cover classes. Residence + evening activities NOT yet confirmed. */
  ageGroupingScope: {
    classes: boolean;
    residence: boolean | null;
    eveningActivities: boolean | null;
  };
}

/** Shape of one entry in `dublin.durations`. */
export type DurationOption = DublinProgramme['durations'][number];

/**
 * Human-readable list of the available lengths, e.g. "7, 10 or 14 days".
 * Derived here so templates never re-implement it.
 */
export function durationOptionsLabel(durations: DurationOption[]): string {
  const days = durations.map(d => d.days);
  if (days.length === 0) return '';
  if (days.length === 1) return `${days[0]} days`;
  return `${days.slice(0, -1).join(', ')} or ${days[days.length - 1]} days`;
}

/** Lowest and highest retail price across the duration options, e.g. "€1,580–€3,150". */
export function priceRangeLabel(durations: DurationOption[]): string {
  if (durations.length === 0) return '';
  const prices = durations.map(d => d.price);
  const lo = Math.min(...prices);
  const hi = Math.max(...prices);
  const fmt = (n: number) => `€${n.toLocaleString('en-IE')}`;
  return lo === hi ? fmt(lo) : `${fmt(lo)}–${fmt(hi)}`;
}

export const dublin: DublinProgramme = {
  year: 2027,

  provider: {
    brand: 'MLA – Move Language Ahead',
    // Retained in the data only. Site owner's instruction, Aug 2026: the
    // contracting-entity wording is off the site for now. Nothing renders this.
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
  // Replaces the old single fixed two-week stay. MLA's NCI centre sells 1-4
  // weeks; Immersion English offers three of those lengths as fixed packages.
  // Each option's price and 2027 start dates are set here — the two line up
  // with each other, so check both together if either changes.
  //
  // PRICING: retail prices are Immersion English's own cost-plus decision —
  // MLA's 2027 Standard (non-early-bird) net rate per student, plus the paid
  // group-leader surcharge (one of two leaders, 70% of net rate — MLA gives
  // one free place at 12+ students) and return airport transfers for the
  // whole travelling party, marked up to a ~26% target margin at 12 students.
  // Set 13 Oct 2026. Families book and pay for their own flights — not
  // included in these prices; only the two group leaders' flights are an
  // Immersion English cost, already folded into the margin above.
  //
  // DATES: MLA's confirmed NCI start-date schedule for Summer 2027, supplied
  // 13 Oct 2026. The 14-day dates are shared with MLA's 21-day option, which
  // Immersion English does not offer.
  durations: [
    {
      days: 7,
      nights: 6,
      price: 1580,
      startDates: ['01/07', '07/07', '13/07', '14/07', '21/07', '22/07', '28/07', '03/08', '10/08'],
    },
    {
      days: 10,
      nights: 9,
      price: 2290,
      startDates: ['01/07', '13/07', '22/07', '03/08', '10/08'],
    },
    {
      days: 14,
      nights: 13,
      price: 3150,
      startDates: ['17/06', '24/06', '01/07', '07/07', '14/07', '15/07', '21/07', '28/07', '03/08'],
    },
  ],

  price: {
    currency: 'EUR',
    // TODO: awaiting MLA 2027 confirmation — deposit terms pending 2027 T&Cs.
    depositPercent: null,
    depositDue: null,
    balanceDue: null,
  },

  // Confirmed in the approved copy.
  securityDeposit: { currency: 'EUR', amount: 50 },
  visaRequired: false,
  medicalStaff: 'Qualified medical staff on site 24 hours a day.',

  included: [
    '20 lessons every week (15 hours) – with qualified native-speaker teachers at the centre',
    'En-suite accommodation on campus – at the National College of Ireland, in the heart of Dublin',
    'Full board – from dinner on the day of arrival to breakfast on the day of departure',
    'Return airport transfers – between Dublin Airport and the centre, arranged directly by your group leaders',
    'The full excursion programme – transport and entry tickets included, nothing extra to pay',
    "Daytime and evening activities – cooking, art and games by day; talent shows, karaoke, discos and movie nights once the sun goes down",
    'Placement test, course eBook and student portfolio – so parents can see exactly what a week achieved',
    'An Immersion English group leader – meeting the group at Dublin Airport and with them for the stay',
  ],

  notIncluded: [
    'Flights',
    'Travel and medical insurance',
    'Personal spending',
  ],

  // SOURCE: MLA "Center Profile – National College of Ireland" brochure, Summer
  // 2027 edition, supplied 13 Oct 2026. This is MLA's own published excursion
  // programme for the NCI centre, transcribed — not invented, and not the
  // UCD-era list.
  //
  // CORRECTION 13 Oct 2026: the 2027 brochure names Kilkenny (Walking Tour &
  // Kilkenny Castle, entrance ticket included) as the full-day private-bus
  // excursion, replacing Galway, which was sourced from the 2026 catalogue and
  // is not on the 2027 list. The rest of the programme is unchanged between
  // the two editions.
  //
  // Note for anyone tempted to re-add the old cards: Trinity College, the Book of
  // Kells, Dublin Castle, Glendalough, the Wicklow Mountains, Dublin Zoo and
  // Dundrum are NOT on MLA's list. Howth, Kilkenny, St Patrick's Cathedral, St
  // Stephen's Green and Grafton Street are.
  excursions: [
    {
      title: 'Kilkenny',
      description:
        'A walking tour of Kilkenny city and Kilkenny Castle, travelling by private bus with local centre staff. Castle entrance ticket included.',
      duration: 'full-day',
      image: '/kilkenny.webp',
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
    // Site owner's instruction, Aug 2026: he does NOT fly out with the students.
    // He joins them on arrival. No page may say he travels with them from Sofia,
    // meets them at the gate in Sofia, or that the group flies out together with
    // him — that is a safeguarding promise to parents and it is not the case.
    travelsFromSofia: false,
    meetsAt: 'Dublin Airport',
  },

  // Name added by site owner's instruction, 29 Aug 2026, superseding the earlier
  // "withheld — described by role only". Everywhere except the "who do I call"
  // FAQ still renders .role rather than .name, so filling this in changed
  // exactly one sentence. dublin-summer-2027/index.astro also hardcodes "Lenny
  // and Lina" and now agrees with this data; that literal could be interpolated
  // from here rather than typed.
  secondChaperone: {
    name: 'Lina',
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
