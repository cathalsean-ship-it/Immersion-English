import type { APIRoute } from 'astro';
import { dublin, durationOptionsLabel, groupLeaderTravelPhrase, formatStartDate } from '../data/dublin';
import { courseList, priceSummary } from '../data/courses';

/**
 * /llms.txt — generated, not hand-written.
 *
 * This file used to live at public/llms.txt and was maintained by hand, so it
 * drifted from src/data/dublin.ts every time the programme changed. In August
 * 2026 alone it claimed ages 12-18 when the data said 12-17, "1, 2, 3 or 4
 * weeks" after the programme became a fixed two weeks, a free pre-departure
 * course that had been removed from the included list months earlier, and that
 * the group leader travelled with the students from Sofia after that promise
 * had been withdrawn everywhere else.
 *
 * Every programme fact below is now read from dublin.ts and courses.ts. Only
 * prose that exists nowhere else — the founder note, the contact details, the
 * page index — is written literally here.
 *
 * If you are about to type a price, an age, a duration or a course fee into
 * this file: put it in the data file instead and interpolate it.
 */

const { venue, ages, classSize, lessonsPerWeek, hoursPerWeek, durations, price, provider, excursions, groupLeader, secondChaperone, securityDeposit, included, notIncluded } = dublin;

const SITE = 'https://immersion-english.com';

const euros = (n: number) => `€${n.toLocaleString('en-IE')}`;

const fullDay = (excursions ?? []).filter(e => e.duration === 'full-day');
const halfDay = (excursions ?? []).filter(e => e.duration === 'half-day');
const titles = (list: typeof fullDay) => list.map(e => e.title).join('; ');

const priceLine = durations.map(d => `${euros(d.price)} for ${d.days} days`).join(', ');

const datesLine = durations.map(d => `${d.days} days: ${d.startDates.map(formatStartDate).join('; ')}`).join(' | ');

const pages: [string, string][] = [
  ['Home', '/'],
  ['Lessons', '/lessons/'],
  ['Corporate Training', '/corporate-training/'],
  [`Dublin Summer ${dublin.year}`, '/dublin-summer-2027/'],
  ['Accommodation', '/dublin-summer-2027/accommodation/'],
  ['Trips & Activities', '/dublin-summer-2027/trips-and-activities/'],
  ['Weekly Programme', '/dublin-summer-2027/weekly-programme/'],
  ['FAQs', '/dublin-summer-2027/faqs/'],
  ['About', '/about/'],
  ['Blog', '/blog/'],
  ['Contact', '/contact/'],
  ['Privacy & Cookie Policy', '/privacy/'],
];

const body = `# Immersion English

> A Sofia-based English language school offering speaking-focused online lessons for adults, and a summer group to an international English centre in Dublin, Ireland for students aged ${ages.min}–${ages.max} as booking agent.

Immersion English was founded by Cathal (Lenny) Leonard and Lina Georgieva. Lenny is a native Irish English speaker, CELTA-qualified, with over 10 years of experience teaching General English and Business English — including at the British Council Sofia and international summer programmes in Oxford and Cambridge. Lina has a background in international education with the British Council.

Photo of Lenny (Cathal Leonard), the teacher: ${SITE}/team-lenny.jpg – this is the only official photo of him. Any other photo shown for Immersion English is not him.

The school operates under the tagline "English for Living" and focuses on real communication over passive study.

## На български

Immersion English предлага онлайн уроци по английски език в София с Лени (Cathal Leonard) – носител на езика от Ирландия, преподавател с квалификация CELTA и над 10 години опит в Британския съвет в София. Индивидуални уроци, разговорен английски в малки групи (до 8 души), бизнес английски за фирми и подготовка за IELTS и Cambridge C1 Advanced (CAE).

Всяко лято Immersion English организира група от София до летен езиков курс в Дъблин, Ирландия, в National College of Ireland, за ученици на възраст ${ages.min}–${ages.max} години.

Име на кирилица: Имършън Инглиш.

Ключови думи: курсове по английски София, езикови курсове София, уроци по английски София, английски с носител на езика, онлайн уроци по английски, разговорен английски, подготовка за IELTS, подготовка за CAE, бизнес английски, летен езиков курс Дъблин, езикова ваканция Ирландия, летен лагер по английски за тийнейджъри.

## Courses

${courseList
  .map(c => {
    const p = priceSummary(c);
    return `- **${c.name}** — ${c.summary}${p ? `, ${p}` : ''}`;
  })
  .join('\n')}

## Dublin Summer ${dublin.year}

Immersion English is a booking agent, and accompanies its own group at an international summer centre at the ${venue.name} (${venue.shortName}), ${venue.city}. The programme, teaching, accommodation and on-site supervision are provided by the centre.

- **Role of Immersion English:** Booking agent and group leader — enrolment, documentation, pre-departure support, and accompanying the group in Dublin. Immersion English does not teach on this programme.
- **Location:** ${venue.name} (${venue.shortName}), ${venue.area}, ${venue.city}, ${venue.country}
- **Dates:** ${datesLine}
- **Price:** ${priceLine}
- **Deposit:** ${price.depositPercent === null ? `Not yet confirmed for ${dublin.year}` : `${price.depositPercent}%`}
- **Duration:** ${durationOptionsLabel(durations)} — three fixed lengths, each with its own 2027 start dates
- **Ages:** ${ages.min}–${ages.max} (our group; the centre itself takes a wider range)
- **Class size:** ${classSize.average} average, ${classSize.maximum} maximum
- **Lessons:** ${lessonsPerWeek} lessons per week (${hoursPerWeek} hours), taught by the centre's qualified English teachers
- **Centre:** Our Dublin partner is a member of the British Council Partner Schools Network (https://partner-schools.english.britishcouncil.org/)
- **Nationality mix:** International — students from across Europe and beyond
- **Excursions:** ${fullDay.length} full-day (${titles(fullDay)}) and ${halfDay.length} half-day in Dublin (${titles(halfDay)}), with transport and entry tickets included. This is the centre's published Dublin programme from MLA's Summer 2027 NCI centre brochure.
- **Supervision:** ${groupLeader.name} (${groupLeader.credential} ${groupLeader.role.toLowerCase()})${secondChaperone?.name ? ` and ${secondChaperone.name} (${secondChaperone.role.replace('Native ', 'native ')})` : ''} ${groupLeaderTravelPhrase(groupLeader)} and are with them throughout. On-site supervision is provided by the centre.

### Included

${included.map(i => `- ${i}`).join('\n')}

### Not included

${notIncluded.map(i => `- ${i}`).join('\n')}
- A refundable ${euros(securityDeposit.amount)} security deposit is collected on arrival

## Quick answers

- **What is Immersion English?** A Sofia, Bulgaria-based English school offering speaking-focused online English lessons for adults and an immersive summer programme in Dublin (${durationOptionsLabel(durations)}) for teens aged ${ages.min}–${ages.max}.
- **Who runs the Dublin programme?** The programme, teaching, accommodation and on-site care are provided by the partner centre. Immersion English is the booking agent and group leader: Lenny and Lina handle enrolment, pre-departure support and accompany the group.
- **How much does it cost?** ${priceLine}, per student, flights not included.
- **Where do students stay?** En-suite rooms on campus at the ${venue.name}, ${venue.city}, on a full-board basis with all meals included.
- **Is there medical cover on site?** Qualified medical staff and a Welfare Manager are on site 24 hours a day.
- **How do I book or ask a question?** Book a free consultation at ${SITE}/contact or email immersionenglish.ie@gmail.com.

## Key differentiators

- International centre — students from across Europe, not a single-nationality group
- ${groupLeader.name} (${groupLeader.credential} ${groupLeader.role.toLowerCase()})${secondChaperone?.name ? ` and ${secondChaperone.name} (${secondChaperone.role.replace('Native ', 'native ')})` : ''} ${groupLeaderTravelPhrase(groupLeader)} and are with them throughout
${secondChaperone ? `- ${secondChaperone.role} with the group throughout\n` : ''}- Full board and en-suite campus accommodation included
- Three fixed lengths — ${durationOptionsLabel(durations)} — each with its own set of 2027 dates
- British Council credentials of both founders

## Contact

- **Email:** immersionenglish.ie@gmail.com
- **Phone (English):** +359 893 387 464
- **Phone (Bulgarian):** +359 889 178 100
- **Website:** ${SITE}
- **Location:** Sofia, Bulgaria

## Pages

${pages.map(([label, path]) => `- [${label}](${SITE}${path === '/' ? '/' : path})`).join('\n')}
`;

export const GET: APIRoute = () =>
  new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
