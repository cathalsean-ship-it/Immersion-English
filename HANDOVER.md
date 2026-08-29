# HANDOVER — Dublin pages: UCD to MLA/NCI

Repo: `cathalsean-ship-it/Immersion-English` (Astro, deployed on Netlify)
Companion file: `dublin-overview-copy.md` — the approved replacement copy.

---

## Context

Immersion English used to run its own summer programme at UCD Belfield. That programme is cancelled. Immersion English is now a booking agent for MLA (Move Language Ahead) and takes a group to MLA's summer centre at the National College of Ireland (NCI), Dublin.

Every UCD-era fact on the site is therefore wrong: the venue, the price, the age range, the duration, the group size, the excursion list, and the claim that Immersion English runs and teaches the programme.

---

## Ground rules

1. **Work on a branch.** `feature/mla-nci-migration`. Netlify deploy preview only. Do not merge to `main`. Do not touch production config, DNS, or Netlify settings.
2. **Invent nothing.** The copy file contains `[CONFIRM]` markers where MLA has not yet supplied 2027 figures. Do not substitute real-looking prices, dates, or excursion names, and do not carry over the old ones. Render each as a visible TODO comment in the source (`{/* TODO: awaiting MLA 2027 confirmation */}`) and leave the field empty or hidden.
3. **Keep the URLs.** `/dublin-summer-2027` and its four subpages keep their routes. No redirects, no renames.
4. **Keep the design.** Components, Tailwind classes, layout and styling stay as they are. This is a content and data change only.
5. **Report, don't guess.** If a string appears somewhere the brief doesn't cover, list it in the PR description rather than deciding what it should say.

---

## Task 1 — Audit first, change nothing

Before editing, produce a report listing every file and line matching any of the following. Search case-insensitively and include all the punctuation variants listed, since the repo may not be consistent:

- `UCD`, `University College Dublin`, `Belfield`
- Age range: `13-17`, `13–17`, `13—17`, `13 - 17`, `13 to 17`, `age 13`, `aged 13`
- Price: `1,350`, `1.350`, `1350`, `€1,350`, `1,800`, `1.800`, `1800`, `650`, `1,150`
- Group size: `13 students`, `13 student`, `small groups of 13`, `Small groups`
- Duration: `7 days`, `7-day`, `one week`, `One unforgettable week`, `1-week`, `1 week`
- Ownership language: `our flagship`, `our summer programme`, `our programme`, `we run`, `our Junior summer`
- Trip names: `Trinity`, `Book of Kells`, `Dublin Castle`, `Howth`, `Stephen's Green`, `Glendalough`, `Wicklow`

Check these locations specifically, not just page bodies:

- All pages under `src/pages/dublin-summer-2027/`
- The homepage Dublin block
- Frontmatter, meta descriptions, OG and Twitter tags
- Any JSON-LD / structured data blocks (these carry price, duration, age range and provider name)
- `sitemap`, `robots`, and any hardcoded nav labels
- Image filenames and alt text under `src/assets` or `public`
- Any Bulgarian-language strings, meta keywords included (the homepage keywords contain UCD-era programme terms)

Output the report and stop. Wait for approval before Task 2.

---

## Task 2 — Create the data file

Create `src/data/dublin.ts` as the single source of truth. All Dublin pages and the homepage block must read from it. No Dublin figure should remain hardcoded in a template after this task.

Suggested shape — adjust to match repo conventions, but keep every field:

```ts
export interface DublinProgramme {
  year: number;
  provider: {
    brand: string;          // "MLA – Move Language Ahead"
    legalEntity: string;    // "Vision Language Academy Ltd"
    termsUrl: string;
    safeguardingUrl: string;
  };
  venue: {
    name: string;           // "National College of Ireland"
    shortName: string;      // "NCI"
    city: string;
    area: string;           // "Dublin Docklands"
  };
  ages: { min: number; max: number };
  classSize: { average: number; maximum: number };
  lessonsPerWeek: number;   // 20
  hoursPerWeek: number;     // 15
  durationsWeeks: number[]; // [1, 2, 3, 4]
  startDates: string[] | null;   // null until MLA confirm 2027
  price: {
    currency: string;
    fromAmount: number | null;   // null until confirmed
    depositPercent: number | null;
    depositDue: string | null;
    balanceDue: string | null;
  };
  securityDeposit: { currency: string; amount: number };  // EUR 50
  airportTransferFrom: { currency: string; amount: number }; // EUR 35 each way
  included: string[];
  notIncluded: string[];
  excursions: Excursion[] | null;  // null until MLA supply the NCI list
  groupLeader: { name: string; role: string; teaches: boolean };
}
```

`groupLeader.teaches` must be `false`. It exists so no template can render teaching claims for Dublin. If any component branches on it, the false path is the only one that should ever run for this page.

Fields that are `null` render as the TODO comment from ground rule 2, not as placeholder text, not as `0`, not as an empty string that leaves a dangling label.

---

## Task 3 — Apply the new copy

Take the copy from `dublin-overview-copy.md` and apply it to `/dublin-summer-2027`. Match the existing component structure: eyebrow label, H2, paragraph, bullets with bold lead-in and en dash separator.

For the four subpages (`accommodation`, `trips-and-activities`, `weekly-programme`, `faqs`): **do not write replacement copy.** New copy for these has not been approved yet. Instead, for each one, either leave the page untouched, or, if it makes false claims that would be live on the preview, replace the body with a short holding block reading "Details for Summer 2027 coming soon" and note it in the PR. Flag which you chose for each page.

---

## Task 4 — The provider block

Add a shared component rendering the "How this programme works" block from the copy file. It must appear on the overview page and all four subpages.

This block is a compliance requirement, not decoration. It must not be collapsed behind an accordion, hidden on mobile, or rendered in a smaller size than the rest of the footer content. It names who the parent actually contracts with.

---

## Task 5 — Structured data

Update the JSON-LD so it describes the new arrangement. The provider is MLA, not Immersion English. Remove any `offers` block carrying a price until the 2027 price is confirmed, rather than leaving a stale figure. Update age range, duration and location.

---

## Definition of done

- Audit report from Task 1, with anything unresolved listed
- No match for any Task 1 search string outside of `dublin.ts` or an intentional historical reference
- All Dublin figures read from `src/data/dublin.ts`
- Unconfirmed values render as TODO comments, never as invented content
- Provider block on all five pages
- Site builds; Netlify preview link in the PR
- PR description lists every judgement call made and every string found that this brief didn't anticipate
