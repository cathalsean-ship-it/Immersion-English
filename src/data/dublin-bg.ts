/**
 * Bulgarian wording for the Dublin programme.
 *
 * WORDS ONLY. Every number, date, price, age and name still comes from
 * dublin.ts, so the two languages can never disagree on a fact. If an item is
 * added to or removed from a list in dublin.ts (included, notIncluded,
 * excursions), update the matching list here in the same order – the build
 * fails loudly below if the lengths drift apart.
 */
import { dublin, type DurationOption } from './dublin';

const MONTHS_BG = ['януари', 'февруари', 'март', 'април', 'май', 'юни', 'юли', 'август', 'септември', 'октомври', 'ноември', 'декември'];

/** "7, 10 или 14 дни" */
export function durationOptionsLabelBg(durations: DurationOption[]): string {
  const days = durations.map(d => d.days);
  if (days.length === 0) return '';
  if (days.length === 1) return `${days[0]} дни`;
  return `${days.slice(0, -1).join(', ')} или ${days[days.length - 1]} дни`;
}

/** "юли" or "юли и август" */
export function startMonthsLabelBg(durations: DurationOption[]): string {
  const months = [...new Set(durations.flatMap(d => d.startDates).map(sd => Number(sd.split('/')[1])))].sort((a, b) => a - b);
  return months.map(m => MONTHS_BG[m - 1]).filter(Boolean).join(' и ');
}

/** "01/07" -> "1 юли" */
export function formatStartDateBg(date: string): string {
  const [day, month] = date.split('/').map(Number);
  return MONTHS_BG[month - 1] ? `${day} ${MONTHS_BG[month - 1]}` : date;
}

/** "€1580", "€12 500" – Bulgarian convention: no separator in 4-digit numbers, a space from 5 digits. */
export function euroBg(n: number): string {
  return `€${n.toLocaleString('bg-BG')}`;
}

export function priceFromLabelBg(durations: DurationOption[]): string {
  return durations.length ? euroBg(Math.min(...durations.map(d => d.price))) : '';
}

const { venue, lessonsPerWeek, hoursPerWeek, groupLeader, secondChaperone } = dublin;

/** Bulgarian spelling of a team name from dublin.ts; falls back to the name as written. */
const NAMES_BG: Record<string, string> = { Lenny: 'Лени', Lina: 'Лина' };
export const nameBg = (n?: string | null) => (n ? NAMES_BG[n] ?? n : '');
// One leader flies with the group (either), both stay for the whole programme.
const leaders = [nameBg(groupLeader.name), nameBg(secondChaperone?.name)].filter(Boolean).join(' или ');

// Same order as dublin.included. Lead – detail, split on " – " by the page.
export const includedBg: string[] = [
  `${lessonsPerWeek} урока седмично – ${hoursPerWeek} часа с квалифицирани преподаватели по английски, в групи по ниво след онлайн тест за определяне на нивото`,
  `Стаи със самостоятелна баня в истински университетски кампус – единични или двойни стаи в ${venue.name}, в сърцето на Дъблин`,
  'Пълен пансион и предплатена карта за храна – всички хранения са включени, а по време на екскурзиите всеки ученик получава предплатена карта, с която сам избира къде да се нахрани, плюс обяд в Hard Rock Cafe',
  'Грижа на място – отговорник за благосъстоянието на учениците и квалифициран медицински персонал денонощно, както и координатори, които правят всеки ден активен и приятен',
  `Вашите групови ръководители през цялото време – ${leaders} пътува с детето ви от София до Дъблин и обратно, а двамата остават през цялата програма. ${nameBg(secondChaperone?.name)} говори български и винаги е на разположение за родителите`,
  'Разгледай. Играй. Учи. – програмата от екскурзии за вашия престой, с включен транспорт и билети и безплатно приложение с куизове, мисии и значки',
  'Занимания ден и нощ – изкуство, спорт, кулинария и магия през деня; караоке, шоу на талантите, дискотеки и ирландски танци céilí вечер',
  'Летищни трансфери в двете посоки – между летище Дъблин и центъра, организирани лично от груповите ръководители',
  'Видим напредък – тест за ниво, електронни учебници и ученическо портфолио, плюс доклад в края на курса, сертификат за участие и церемония по завършване',
];

export const notIncludedBg: string[] = [
  'самолетни билети',
  'туристическа и медицинска застраховка',
  'джобни пари',
];

// Same order as dublin.excursions. Place names stay in English where that is
// what students will see on signs and tickets.
export const excursionsBg: { title: string; description: string }[] = [
  { title: 'Килкени', description: 'Пешеходна обиколка на град Килкени и замъка Килкени, с частен автобус и придружени от местния екип на центъра. Входният билет за замъка е включен.' },
  { title: 'Хаут', description: 'Живописно рибарско селище върху ирландските скали, известно с традиционните си fish and chips.' },
  { title: 'Джорджиански Дъблин', description: 'Пешеходна обиколка на джорджиански Дъблин и неговото добре запазено архитектурно наследство.' },
  { title: 'Катедралата „Св. Патрик"', description: 'Най-голямата църква в Ирландия, основана до кладенеца, при който покровителят на страната е кръщавал новопокръстени около 450 г. Входният билет е включен.' },
  { title: "St Stephen's Green и Temple Bar", description: 'Отдих в един от зелените „бели дробове" на града, а вечерта – Temple Bar, един от най-старите и колоритни квартали на Дъблин.' },
  { title: "George's Street Arcade и Grafton Street", description: 'Покритата викторианска галерия, последвана от пазаруване на Grafton Street.' },
  { title: 'Музеят EPIC', description: 'Музеят на ирландската емиграция – какво всъщност означава да си ирландец. Входният билет е включен.' },
];

// Fail the build rather than show a Bulgarian page that is missing an item,
// or pairs one excursion's photo with another's description.
for (const [name, en, bg] of [
  ['included', dublin.included, includedBg],
  ['notIncluded', dublin.notIncluded, notIncludedBg],
  ['excursions', dublin.excursions ?? [], excursionsBg],
] as const) {
  if (en.length !== bg.length) {
    throw new Error(`dublin-bg.ts: ${name} has ${bg.length} Bulgarian entries but dublin.ts has ${en.length}. Update both together.`);
  }
}
