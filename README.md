# Immersion English — Website

Marketing website for **Immersion English**, a speaking-focused English language
school in Sofia, Bulgaria, with a teen summer programme in Dublin, Ireland.

Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com).
It's a static site — no database or backend.

---

## Running it locally

You need [Node.js](https://nodejs.org) installed (version 18 or newer). Then, from
inside this folder:

```bash
npm install      # one time only — downloads dependencies into node_modules/
npm run dev      # starts the local preview server
```

Then open **http://localhost:4321** in your browser. The site reloads
automatically as you edit and save files.

| Command           | What it does                                              |
| ----------------- | --------------------------------------------------------- |
| `npm install`     | Installs dependencies (run once after cloning/unzipping)  |
| `npm run dev`     | Starts the live preview at `localhost:4321`               |
| `npm run build`   | Builds the final static site into the `dist/` folder      |
| `npm run preview` | Previews the built site (what visitors will actually see) |

---

## Project structure

```
immersion-english/
├── public/                  → images & static files (served as-is)
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro  → shared page shell (head, header, footer)
│   ├── components/
│   │   ├── Nav.astro         → top navigation + dropdown menu
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   └── Card.astro
│   ├── styles/
│   │   └── global.css        → design tokens (colours, fonts) + shared classes
│   └── pages/                → each file = one page (folder structure = URLs)
│       ├── index.astro       → /            (home)
│       ├── about.astro       → /about
│       ├── lessons.astro     → /lessons
│       ├── contact.astro     → /contact
│       └── dublin-summer-2027/
│           ├── index.astro            → /dublin-summer-2027
│           ├── accommodation.astro
│           ├── trips-and-activities.astro
│           ├── weekly-programme.astro
│           └── faqs.astro
├── astro.config.mjs         → Astro + Tailwind configuration
└── tailwind.config.mjs      → custom colours, fonts, spacing tokens
```

**How pages & URLs work:** every `.astro` file inside `src/pages/` automatically
becomes a page. The folder layout maps directly to the web address — e.g.
`src/pages/dublin-summer-2027/faqs.astro` is served at `/dublin-summer-2027/faqs`.

---

## Design system

Brand colours, fonts, and reusable styles live in two places:

- **`tailwind.config.mjs`** — custom colours (`brand-green`, `brand-orange`,
  `ink`, `cream`, `line`, etc.) and the Montserrat / Lato font families.
- **`src/styles/global.css`** — CSS variables plus shared component classes used
  across pages: `.container-x`, `.section`, `.section-tinted`, `.section-dark`,
  `.eyebrow`, `.trust-card`, `.btn` / `.btn-primary` / `.btn-ghost`, and more.

Reuse these rather than introducing new one-off styles, so the site stays consistent.

---

## To do before launch

- **Add real photography** — every image is currently a striped grey placeholder,
  sized and ready for a real image to drop straight in (put files in `public/`).
- **Wire up the contact form** — the forms are visual only and don't submit yet
  (a Tally form embed is planned).
- **Confirm 2027 programme dates** once announced (September 2026).
