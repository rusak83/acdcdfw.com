# DESIGN.md — ACDC Home Services (acdcdfw.com)

> Source of truth for visual design. Claude Code: read this before touching any
> page or `assets/css/styles.css`, and run the **Pre-Flight Checklist** at the bottom
> of this file before every commit that touches a page or the stylesheet.
>
> **Core idea — thermal design.** The visual temperature matches the appliance.
> COLD treatment (blue + frost) belongs ONLY on refrigeration pages. Heat appliances
> (ranges, ovens, cooktops, heating) get a WARM treatment. General pages stay neutral
> premium. The brand layer is constant across all of them; only the "temperature skin"
> changes per page type. Reference feel: Apple natural-light + Claude warm editorial.

## Brand layer — CONSTANT on every page (cold, warm, or neutral)
- **Navy** `--color-primary` #001F92 — headings, logo, primary CTA. The brand anchor everywhere.
- **Electric yellow** `--color-accent` — accent only (CTAs, highlights, icons, star rating). Constant. No lightning/bolt motif anywhere.
- **Warm real photos** — Victor + hands on real appliances. Photos carry warmth on EVERY page type.
- **Friendly, trustworthy copy.** Premium, never cheap/gimmicky.
- Audience: premium DFW homeowners + commercial accounts. Never red. Never prices.

## Thermal page themes — the per-page "temperature skin"
The ONLY thing that changes between page types is the atmosphere (background tint, texture,
section accents). Apply a theme class on `<body>` (e.g. `theme-cold` / `theme-warm` / `theme-neutral`).

| Theme | Apply to | Atmosphere | Texture | Accent tint |
|---|---|---|---|---|
| **COLD** `theme-cold` | Refrigeration: sub-zero, refrigerator, freezer, ice-machine, wine-cooler(s), commercial refrigeration, fridge pages of any brand | Deep-blue → navy gradient, crisp white, airy | Subtle frost/ice (see below) | Ice blue `--color-ice` #7dd3fc |
| **WARM** `theme-warm` | Heat: ranges, ovens, cooktops, stoves, range-hood, HVAC **heating**, dryer/dryer-vent | Warm off-white / soft ember gradient, cozy | Soft warm glow, NO frost | Ember amber `--color-warm` #f59e0b / orange |
| **NEUTRAL** `theme-neutral` | Home, about, contact, locations, dishwasher, washer, general brand hubs, HVAC cooling/general | Cool-gray premium base (current site) | None / minimal | Brand navy + electric yellow only |

Rules:
- COLD ≠ default. Do NOT put frost/ice on the homepage, about, range/oven, or HVAC-heating pages.
- The electric-yellow brand accent stays in ALL themes — it's the through-line.
- Heat pages must never feel icy; fridge pages must never feel warm-toned. Match the appliance.

## Color tokens  (update `:root` in assets/css/styles.css)
```css
:root {
  /* BLUES — cold canvas (Pantone Reflex Blue / Blue 072 / Dark Blue family) */
  --color-primary:        #001F92;  /* deep navy — headings, links, logo, primary CTA */
  --color-primary-deep:   #001357;  /* darkest — hero gradient base */
  --color-primary-light:  #0b52ff;  /* bright electric blue — hover, gradient top */
  --color-ice:            #7dd3fc;  /* frost blue — thin highlights, icy accents */
  --color-frost:          #e8f3fb;  /* very light icy tint — section backgrounds */

  /* INK / NEUTRALS */
  --color-ink:            #0f172a;  /* body text */
  --color-muted:          #475569;  /* secondary text */
  --color-white:          #ffffff;
  --color-surface:        #f0f4f8;  /* page bg — cool gray */
  --color-surface-card:   #f7f8ff;  /* card bg */
  --color-border:         #dbe4f1;

  /* ACCENT — electric/acid yellow. Brand constant, ALL themes. (No lightning motif.) */
  --color-accent:         #FFE100;  /* electric yellow — CTAs, highlights, icons */
  --color-accent-acid:    #E6F000;  /* acid variant — sparingly, for energy */
  --color-accent-ink:     #001F92;  /* text/icons placed ON yellow = navy (high contrast) */

  /* WARM theme atmosphere (theme-warm pages only — ranges/ovens/heating). NOT the brand accent. */
  --color-warm:           #f59e0b;  /* ember amber — warm accents/glow */
  --color-warm-deep:      #b45309;  /* deep ember — warm gradient base */
  --color-warm-surface:   #fff7ed;  /* warm off-white — warm-page background */

  --radius: 12px; --radius-pill: 999px;
  --max-width: 960px;
}
```
> NOTE: yellow hexes are tuned to the Pantone acid-yellow family — nudge `--color-accent`
> if you want it greener (toward `#E6F000`) or warmer (toward `#FFD500`). Lock with Victor.

## Contrast rules (non-negotiable — accessibility + premium feel)
- **Never** yellow text on white or yellow text on light gray (fails contrast, looks cheap).
- Yellow is a **fill / accent** color: navy text on a yellow chip/button = great contrast.
- On the dark blue hero: white text for body, yellow only for one highlight word or the accent CTA.
- Body text = `--color-ink` on light, white on dark. Keep ≥ 4.5:1.

## Frost / ice texture — `theme-cold` pages ONLY (NO falling snow)
Decision: **subtle frost texture, not animated snowflakes.** Premium, not gimmicky, zero perf cost.
Applies only to refrigeration pages. Do NOT use on home/warm/neutral pages.
- Hero: vertical gradient `--color-primary-deep` → `--color-primary`, with a faint radial
  ice-light top-center and a low-opacity SVG frost/crystal pattern (opacity ≤ 0.06).
- Cards over the hero: frosted glass — `background: rgba(255,255,255,.08); backdrop-filter: blur(10px);`
  with a 1px `--color-ice` top highlight border.
- Section dividers: thin `--color-ice` hairline or a soft frost gradient, not hard lines.
- Optional: faint frosted-corner SVG on section corners at ≤ 6% opacity.
- Motion: only gentle (fade/translate on scroll, ≤ 300ms). Respect `prefers-reduced-motion`.

## Warm treatment — `theme-warm` pages ONLY (ranges, ovens, cooktops, heating)
The heat counterpart to frost. Cozy, never icy.
- Background: `--color-warm-surface` off-white, or a soft `--color-warm-deep` → warm-mid gradient on hero.
- Atmosphere: faint warm radial glow (ember) behind hero, opacity ≤ 0.06. No frost, no ice blue.
- Accents/section highlights: `--color-warm` ember amber. Brand navy + electric yellow CTA stay.
- Photos: warm-lit cooking/range shots. Feeling: reliable, warm, premium — not cold-tech.

## Typography
- Font: system stack already in use (`-apple-system, "Segoe UI", Roboto, …`). Keep — fast, clean, premium.
- Headlines: bold, tight leading, large (hero ~clamp(2.5rem, 6vw, 4.5rem)). Navy on light, white on hero.
- Body: 1rem–1.125rem, `--color-ink`, comfortable line-height (1.6).
- One accent treatment: a single highlighted word in headline can use a yellow underline/marker.

## Components
- **Primary CTA** (phone): navy fill `--color-primary`, white text, pill radius. On hover slightly lighter.
- **Accent CTA / highlight** (e.g. "Same-Day"): yellow `--color-accent` fill, navy text — the electric pop.
- **Phone button**: on desktop, label expands to "CALL US NOW — (469) 224-0577"; on mobile shows the number / call icon.
- **Service cards**: white/frosted card, navy icon, yellow accent on hover (icon or top border). Replace any leftover RED icons → navy with yellow accent. (No red anywhere — red conflicts with the cold premium system.)
- **Trust badges** (4.8★ / 434+ / 7 yrs / 17 cities): pill chips, navy text, star = yellow.
- **Nav**: 68px, white bg, navy logo, slash separators, `.nav-phone` + `.nav-cta` (yellow-accent CTA optional).
- **Mobile header**: collapse nav into a hamburger (To-Do item — implement).
- **Footer**: white bg, dark text (per v2 — NOT navy footer).

## Photography direction (the warm layer — HIGHEST visual ROI)
The site currently has **zero photos**. This is the #1 fix. Use real job photos:
- Real Victor / real hands on real premium appliances (Sub-Zero, Viking, Wolf). Warm light.
- Before/after, diagnostic moments, branded van, commercial kitchens.
- Treatment: photos bring the warmth; keep UI around them cold/clean so they pop.
- Every image: SEO filename (`subzero-refrigerator-repair-dallas-01.webp`), descriptive alt
  (brand + appliance + city), WebP/AVIF, responsive sizes, `ImageObject` schema where relevant.

## Live "recent booking" popup
Only with **real Bitrix data** (recent lead: city + service, no names). Never fabricated.
Subtle, dismissible, bottom-left, frosted-glass card. If no live data source wired → do not show.

## DO NOT
- No red. No soft amber (`#f59e0b` is retired → `--color-accent` electric yellow).
- No falling-snow animation. No spinning/looping decorative motion.
- No yellow text on light backgrounds.
- No fabricated reviews or fake "order" popups.
- No prices on the site (company rule).
- Don't apply COLD frost/ice outside refrigeration pages. Match visual temperature to the appliance: fridge = cold, range/oven/heating = warm, everything else = neutral.

---

# Pre-Flight Checklist

> Run this before every commit that touches a page or `assets/css/styles.css`.
> **Binary: one failed box means the work is not done.** Do not ship "mostly passing."
> Check only the pages you changed, not the whole site.
>
> Each item is either mechanically checkable (command given, run it) or a 10-second
> eyeball check. If a rule genuinely does not apply to the page, write why in the
> commit message instead of silently skipping it.

### A. Language — English only, no exceptions

Everything that leaves this machine is English. Russian belongs in conversation, never in
an artifact. This is a hard rule, not a preference: a stray Russian string in a public repo
or a CRM record tells anyone reading it how the work was produced.

- [ ] **No Cyrillic anywhere in the repository.** Check before every commit:
      `grep -rlP '[\x{0400}-\x{04FF}]' --include=* . | grep -v '^./.git/'`
- [ ] **Page content, alt text, meta tags, schema** — English.
- [ ] **Code comments, variable names, TODOs** — English.
- [ ] **Commit messages, branch names, PR titles and bodies** — English.
- [ ] **Form field values and anything written into Bitrix** — English.
      (`assets/js/lead-form.js` already states this contract at the top of the file. Keep it.)

### B. Brand lock

- [ ] **No red anywhere.** `grep -niE '#(dc2626|ef4444|e11d48|b91c1c|ff0000)|\bred\b' <file>`
- [ ] **No retired amber as a brand accent.** `#f59e0b` is allowed ONLY inside `theme-warm`
      atmosphere (glow/section tint), never as a CTA or brand accent.
- [ ] **One accent color.** Electric yellow `--color-accent` is the only accent on the page.
      No second competing accent introduced.
- [ ] **No hardcoded hex where a token exists.** New CSS uses `var(--color-*)`, not literals.
- [ ] **No lightning/bolt motif.** (Standing brand rule, easy to reintroduce by accident.)

### C. Thermal theme

- [ ] **`<body>` carries the correct theme class** — `theme-cold` / `theme-warm` / `theme-neutral`
      per the table above. Refrigeration = cold, heat appliances = warm, everything else = neutral.
- [ ] **No frost/ice outside `theme-cold`.** `grep -n 'frost\|--color-ice' <file>` on a warm or
      neutral page must return nothing.
- [ ] **No warm/ember tint on a cold page.** Mirror check.
- [ ] **Theme is locked for the whole page.** No mid-page flip from cold to warm.

### D. Contrast (accessibility, non-negotiable)

- [ ] **No yellow text on white or light gray.** Yellow is fill only.
- [ ] **Every button label passes 4.5:1** against its own fill — including hover state.
      Navy-on-yellow and white-on-navy both pass; anything new gets measured, not guessed.
- [ ] **Form inputs checked:** placeholder, label, focus ring, and error text all pass 4.5:1
      against the section background they sit on.
- [ ] **No ghost button over a photo** without a scrim behind it.

### E. CTA discipline

- [ ] **One label per intent across the whole site.** Two intents exist and only two:
      **call** and **book online**. Every call CTA uses the identical string; every booking
      CTA uses the identical string. Verify: `grep -rhoP '(?<=>)[^<>]{3,40}(?=</a>)' --include=*.html . | sort | uniq -c | sort -rn`
      > Known open violation: the call CTA currently ships as three different strings —
      > `Call (469) 224-0577`, `Call Now — (469) 224-0577`, and the
      > `CALL US NOW — (469) 224-0577` variant specified in Components above. Pick one, then
      > delete the other two from this file and from the site.
- [ ] **No CTA label wraps to a second line** at desktop width.
- [ ] **Phone number is byte-identical everywhere.** One format, no variants.

### F. Copy honesty

- [ ] **No prices.** Company rule, no exceptions.
- [ ] **No fabricated numbers.** Every figure on the page traces to something real —
      review counts, years in business, city counts, response times. If it cannot be sourced,
      it does not ship. No invented percentages ("98% first-visit fix") and no invented
      precision ("4.1× faster").
- [ ] **Claims match real operations.** Business hours, service areas, same-day availability,
      and brand coverage reflect what the company actually does today.
- [ ] **No fabricated reviews and no fake live-booking popup.** The popup ships only when
      wired to real Bitrix data.
- [ ] **Read every new sentence out loud once.** Kill AI filler, forced metaphors, and
      broken referents. Plain, functional, trustworthy.

### G. Em-dash

- [ ] **No `—` in headlines, eyebrows, buttons, nav, chips, or alt text.** It is the single
      most recognizable "written by AI" tell and these are the strings a visitor scans first.
      Check: `grep -n '—' <file>`
      > Body copy is a judgment call, not a hard fail — some em-dashes there carry real meaning.
      > Site-wide count at the time this checklist was written: 993 in HTML, 35 in this file.
      > Treat that as a backlog to clean, not a blocker on unrelated work.

### H. Layout

- [ ] **Hero fits the first screen.** Headline ≤ 2 lines, subtext ≤ 20 words, CTA visible
      without scrolling on a 1440×900 desktop and on a 390×844 phone.
- [ ] **Nav renders on one line at desktop**, height stays at 68px per Components.
- [ ] **Eyebrow restraint:** at most `ceil(sections / 3)` eyebrow labels per page.
      Count: `grep -c 'rs-label' <file>` vs `grep -c '<section' <file>`
      > Known open violation: `index.html` has 6 eyebrows across 8 sections; the cap is 3.
- [ ] **Section variety:** no layout family repeats more than twice in a row. Three consecutive
      image+text zigzags is a fail.
- [ ] **Long lists get real UI.** More than 5 items does not ship as a plain `<ul>` with
      dividers — use cards, a 2-column group, or an accordion.
- [ ] **One radius system.** New components use `--radius` or `--radius-pill`, nothing custom.

### I. Motion & performance

- [ ] **`prefers-reduced-motion` is honored.** Any page with motion must degrade to static.
      > Known gap: `assets/css/styles.css` currently has no `@media (prefers-reduced-motion: reduce)`
      > block at all. Add one before shipping any new animation.
- [ ] **Animate only `transform` and `opacity`.** Never `width`, `height`, `top`, `left`,
      `margin`, or `padding`. Check: `grep -nE 'transition:[^;]*(width|height|top|left|right|bottom|margin|padding)' assets/css/styles.css`
      (Colour and `background` transitions on hover are fine and already in use.)
- [ ] **Motion is motivated.** Each animation communicates hierarchy, feedback, or state.
      "It looked cool" is not a reason. No decorative loops, no falling snow.
- [ ] **Use `100dvh`, never `100vh`** for full-height blocks — `100vh` jumps on iOS Safari.
- [ ] **Images:** WebP/AVIF, SEO filename, descriptive alt (brand + appliance + city),
      explicit `width`/`height` so nothing shifts on load.

### J. SEO — never change silently

Any of these needs an explicit decision, not a drive-by edit:

- [ ] **URL structure unchanged**, or a redirect is in place.
- [ ] **`<title>` and meta description** present, unique, and reviewed on every touched page.
- [ ] **One `<h1>` per page.** Check: `grep -c '<h1' <file>`
- [ ] **`sitemap.xml` updated** if a page was added, removed, or renamed.
- [ ] **`llms.txt` updated** if services or pages changed.
- [ ] **Internal links from related pages** point at any new page. A page nothing links to
      does not exist.
- [ ] **Schema markup** valid on pages that carry it.

### K. Final

- [ ] **Rendered and looked at** at 1440px and 390px. Not just read as source.
- [ ] **Nothing in the DO NOT list above was reintroduced.**
