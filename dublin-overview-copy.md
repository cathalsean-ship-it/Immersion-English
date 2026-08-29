> ## ⚠ SUPERSEDED IN PLACES — DO NOT COPY FROM THIS FILE WITHOUT CHECKING
>
> This is an August 2026 draft, kept as a record of the UCD → MLA/NCI rewrite.
> Parts of it were overtaken by later decisions and are now **false**. Anything
> here must be checked against `src/data/dublin.ts`, which is the source of
> truth, before it goes anywhere near the site.
>
> Known-wrong lines in this document:
>
> - **"Your teacher on the plane beside you"** (Hero sub) — no.
> - **"Lenny travels with the group from Sofia and back"** (Who travels with you) — no.
> - **"with the group from the gate in Sofia to the arrivals hall home"** (Included) — no.
>   The group leader meets the students at **Dublin Airport**. He does not fly out
>   with them. `dublin.groupLeader.travelsFromSofia` is `false` and carries a
>   comment explaining that this is a safeguarding promise to parents, not a
>   phrasing preference. Commit `adbaaee` removed this claim from eleven places
>   across six files. It must not come back through this document.
> - **"Free pre-departure online course"** (Included) — removed from the included
>   list; the pre-departure evening in Sofia was removed in `edde6fc`.
>   "Pre-departure support" (enrolment and documentation help) is real; a free
>   course and an event are not.
> - **"Ages 12–20"** — the programme is 12–17. See `dublin.ages`.
>
> The rest — voice, structure, the provider-disclosure wording — is still useful,
> which is why the file is kept rather than deleted.

# Dublin Summer 2027 — overview page copy (draft)

Route stays `/dublin-summer-2027`. Body copy only. Layout, components and styling unchanged.

Voice matched to the live site: eyebrow label, H2 as a full sentence with a full stop, short paragraphs, bold lead-in and en dash in bullets, three-line fragment rhythm in the hero.

`[CONFIRM]` marks anything needing MLA sign-off before it goes live.

---

## Hero

**Eyebrow:** Dublin, Ireland · Summer 2027

**H1:** Confidence comes from   being surrounded by it.   Not sitting beside it.

**Sub:** Immersion English takes a group from Sofia to an international summer centre in Dublin, at the National College of Ireland. Students from across Europe. Classes every morning. Your teacher on the plane beside you.

**CTAs:** See what's included · Book a free consultation

**Trust strip:** Cambridge CELTA-qualified group leader from Sofia · Bulgarian speaker available throughout · International centre, students from across Europe · Full board, en-suite campus accommodation

---

## Section: Why this centre

**Eyebrow:** Why Dublin Summer 2027

### H2: The best English lesson is the one you didn't notice.

Most summer courses put Bulgarian teenagers in a room with other Bulgarian teenagers. This one doesn't. Students come from across Europe and beyond, so English isn't the subject – it's how you order lunch, argue about football, and make a friend by Wednesday.

### Grouped by age and level

An online placement test before departure puts every student in the right class. Students are grouped with others their own age. [CONFIRM: applies to classes, residence and evening activities.]

### Small classes, big campus

Classes average 13 students, with a maximum of 18. Around them, a full international summer centre in Dublin's Docklands, ten minutes' walk from the city centre.

### A teacher from home

Lenny travels with the group from Sofia and back, and is there for the whole stay.

---

## Section: What's included

**Eyebrow:** Included in Dublin Summer 2027

### H2: One price. Nothing left to book.

**Duration** 1, 2, 3 or 4 weeks
**Ages** 12–20
**Class size** 13 average, 18 maximum
**Programme fee** [CONFIRM: retail price once 2027 net rates are published]

- **20 lessons every week** (15 hours) – with qualified native-speaker teachers at the centre
- **En-suite accommodation on campus** – at the National College of Ireland, in the heart of Dublin
- **Full board** – from dinner on the day of arrival to breakfast on the day of departure
- **The full excursion programme** – transport and entry tickets included, nothing extra to pay [CONFIRM: replace with MLA's published Dublin excursion list, catalogue p.44]
- **Evening and weekend activities** – run by the centre's own activity team
- **Free pre-departure online course** – weekly lessons from the November before you fly
- **Placement test, course eBook and student portfolio** – so parents can see exactly what a week achieved
- **An Immersion English group leader** – with the group from the gate in Sofia to the arrivals hall home

Not included: flights, airport transfers (from €35 each way), travel and medical insurance, personal spending. A refundable €50 security deposit is collected on arrival.

---

## Section: Who travels with you

**Eyebrow:** Supervision

### H2: Nobody gets handed over at the airport.

Lenny travels as group leader for the full stay. The classes in Dublin are taught by the centre's own teaching team – his job is everything around them. Settling students in, checking in every day, sorting out whatever comes up, and being the person parents can ring.

A Bulgarian speaker is available throughout.

[If Lina or Liana travel, name them here.]

---

## Section: Dates and prices

**Eyebrow:** Dates

### H2: Pick your week.

**Departure dates** [CONFIRM: 2027 dates. 2026 seven-night starts were 24/6, 1/7, 2/7, 15/7, 16/7, 29/7, 30/7, 5/8, 6/8, 12/8, 13/8]
**From** [CONFIRM: retail price]

Places are limited and confirmed first come, first served. A deposit holds the place; the balance is due in the spring. [CONFIRM: deposit percentage and dates against 2027 terms.]

**CTA:** Book a free consultation

---

## Footer block (every Dublin page)

**How this programme works**

Immersion English is a booking agent for MLA – Move Language Ahead, and accompanies its own group to MLA's summer centre at the National College of Ireland, Dublin. The programme, teaching, accommodation and on-site supervision are provided by MLA.

Your booking contract is with Vision Language Academy Ltd, MLA's Irish operating company, under MLA's terms and conditions. Immersion English handles enrolment, documentation, pre-departure support, and accompanies the group.

Read [MLA's terms and conditions] and [MLA's safeguarding policy].

---

## Grep list for Claude Code

Find and replace site-wide: "UCD", "Belfield", "13–17", "13 students", "€1,350", "our flagship summer programme", "One unforgettable week", and the six self-chosen trip cards (Trinity, Book of Kells, Dublin Castle, Howth, St Stephen's Green, Glendalough).

Also update: the homepage Dublin block, page meta descriptions and OG tags, the OG image if it shows UCD, and any JSON-LD carrying the old price, age range, duration or provider name.
