# DESIGN.md — ACDC Home Services (acdcdfw.com)

> Source of truth for visual design. Claude Code: read this before touching any
> page or `assets/css/styles.css`.
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
