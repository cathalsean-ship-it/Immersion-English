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
    /** The single all-in price for the two-week stay. Not a "from" price:
     *  there is only one duration and one figure. */
    amount: number | null;
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

/**
 * Human-readable duration label, e.g. "1, 2, 3 or 4 weeks".
 * Derived here so templates never re-implement it. Previously duplicated in
 * index.astro and faqs.astro.
 */
export function durationLabel(weeks: number[]): string {
  if (weeks.length === 0) return '';
  if (weeks.length === 1) return `${weeks[0]} week${weeks[0] === 1 ? '' : 's'}`;
  return `${weeks.slice(0, -1).join(', ')} or ${weeks[weeks.length - 1]} weeks`;
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
  // Site owner's instruction, Aug 2026: the Immersion English group travels for a
  // single fixed two-week stay. MLA's centre sells 1-4 weeks; this array describes
  // OUR group only, so copy must not present it as the centre's limit.
  // price.amount below is the two-week figure. If this array ever changes, that
  // price must be rechecked — the two move together.
  durationsWeeks: [2],

  // TODO: awaiting MLA 2027 confirmation — 2027 departure dates not yet published.
  startDates: null,

  price: {
    currency: 'EUR',
    // Retail price is Immersion English's own decision — separate from MLA's
    // net rate, which never appears publicly. Not contingent on MLA confirmation.
    //
    // Set Aug 2026 from published 2026 competitor pricing for two-week Dublin
    // junior programmes:
    //   ATC at NCI (the same campus)          from €2,360
    //   ATC at UCD                            from €2,640
    //   Emerald, Alexandra College residence      €2,850
    //   Emerald, Trinity Hall residence           €2,950
    //   Emerald, intensive residence              €3,050
    //   CES Dublin, homestay not residence        €1,930 + €85 + €190 transfer
    // Raised from €2,690 to €2,950 by the owner, 29 Aug 2026. That places it
    // level with Emerald's Trinity Hall residence and below their intensive —
    // no longer "below Emerald" as the note above described the old figure.
    // Still ABOVE every ATC price on the same campus, so the positioning
    // argument now rests on what the group leader and the Sofia group add, not
    // on being cheaper.
    //
    // STILL NOT checked against MLA's 2027 net rate. The margin question is
    // easier at this price, not answered by it: if MLA's net rate lands above
    // roughly €2,300 a head the twelve-student threshold and the owner's own
    // travel still eat it. This remains a phone call, not a commit.
    amount: 2950,
    // TODO: awaiting MLA 2027 confirmation — deposit terms pending 2027 T&Cs.
    depositPercent: null,
    depositDue: null,
    balanceDue: null,
  },

  // Confirmed in the approved copy.
  securityDeposit: { currency: 'EUR', amount: 50 },
  airportTransferFrom: { currency: 'EUR', amount: 35 },
  visaRequired: false,
  medicalStaff: 'Qualified medical staff on site 24 hours a day.',

  included: [
    '20 lessons every week (15 hours) – with qualified native-speaker teachers at the centre',
    'En-suite accommodation on campus – at the National College of Ireland, in the heart of Dublin',
    'Full board – from dinner on the day of arrival to breakfast on the day of departure',
    'The full excursion programme – transport and entry tickets included, nothing extra to pay',
    "Daytime and evening activities – cooking, art and games by day; talent shows, karaoke, discos and movie nights once the sun goes down",
    'Placement test, course eBook and student portfolio – so parents can see exactly what a week achieved',
    'An Immersion English group leader – meeting the group at Dublin Airport and with them for the stay',
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
      image: '/galway.webp',
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
