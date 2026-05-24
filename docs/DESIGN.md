# Daily — Design System

> **Version:** 1.0
> **Last updated:** 2026-05-23
> **Visual source of truth:** Claude Design project `app-onboarding` (`screens.jsx`, `create-reminder.jsx`, `routine.jsx`, `tabs.jsx`)
> **Target device:** iPhone 16 Pro (390 × 844 logical) — mobile-first
> **Language:** English (global app)
> **Status:** calibrated against real design tokens (not inferred)

Every UI decision must consult this file. Tokens defined here are the only source of truth — TS/TSX code **never** references hex literals; always through a CSS var or Tailwind token.

---

## 1. Principles

1. **iOS-first** — visuals and interactions inspired by iOS (system fonts, sheets, floating tab bar, haptic-like motion).
2. **Mobile-first** — desktop is responsive, but iPhone is the optimization target.
3. **Calm > dense** — generous whitespace, clear hierarchy.
4. **Floating > attached** — key elements (tab bar, FAB, cards) float with shadow rather than stick to edges.
5. **Large taps, low friction** — primary button is 54pt; presets before free inputs.
6. **Dark mode is first-class** — duplicated tokens (`LIGHT` / `DARK`), swapped at runtime.
7. **Motion with purpose** — short transitions (150-300ms) for feedback, not decoration.

---

## 2. Design tokens

### 2.1 Colors

**Raw tokens (literal colors from the design, kept as internal reference).**

These are the names from the JSX (`D.blue`, `D.ink`, etc.). In production code, expose them as CSS variables (next subsection).

| Token | Light | Dark | Usage |
|---|---|---|---|
| `blue` | `#2F6BFF` | `#4D85FF` | Primary brand color (Daily Blue) |
| `blueDark` | `#1E54D9` | `#2F6BFF` | Hover, pressed, gradients |
| `blueSoft` | `#EAF1FF` | `rgba(77,133,255,0.18)` | Selected chip background, info |
| `orange` | `#FF7A3D` | `#FF8A4D` | Accent (Daily Orange) |
| `orangeSoft` | `#FFEEE3` | `rgba(255,138,77,0.16)` | Orange chip background |
| `orangeInk` | `#7A3A14` | `#FFB58A` | Text on `orangeSoft` |
| `orangeEnd` | `#E2541A` | `#D9591F` | Gradient end point |
| `purple` | `#7C5CFF` | `#9B82FF` | "Stretch" routine, alt accent |
| `purpleSoft` | `#F2EBFF` | `rgba(155,130,255,0.18)` | Purple preset tint |
| `purpleInk` | `#5B3DBF` | `#C5B5FF` | Text on `purpleSoft` |
| `ink` | `#15171C` | `#F0F2F7` | Primary text |
| `ink2` | `#5B6271` | `#9AA3B5` | Secondary text |
| `ink3` | `#9AA0AE` | `#646B7C` | Tertiary text, placeholders, inactive icons |
| `bg` | `#F6F7F9` | `#0B0E14` | Screen background (not card) |
| `card` | `#FFFFFF` | `#171B23` | Cards, sheets, inputs, tab bar |
| `hair` | `rgba(60,60,67,0.10)` | `rgba(255,255,255,0.08)` | Subtle 1px border, dividers |
| `track` | `#E6E9EF` | `#23272F` | Progress track, vertical lines |
| `mute` | `#D8DCE5` | `#2D323D` | Inactive dot, toggle off |
| `success` | `#1FB364` | `#22C56A` | Confirmation, "done" badge |
| `tintBlue` | `#E6F4FF` | `rgba(77,133,255,0.14)` | Preset tint (Drink water) |
| `tintGreen` | `#E8F8EE` | `rgba(34,197,106,0.14)` | Preset tint (Walk) |
| `tintAmber` | `#FFF1E0` | `rgba(255,170,77,0.14)` | Preset tint (Read) |
| `tintPink` | `#FFEBEE` | `rgba(255,107,138,0.14)` | Preset tint (Meditate) |
| `tintGray` | `#F2F3F6` | `#23272F` | Neutral tint, Custom |
| `glass` | `rgba(255,255,255,0.92)` | `rgba(36,40,50,0.94)` | Notification preview (iOS-style) |
| `glassSoft` | `rgba(255,255,255,0.7)` | `rgba(36,40,50,0.55)` | Secondary mock blur |
| `glassBorder` | `rgba(0,0,0,0.04)` | `rgba(255,255,255,0.06)` | Glass surface borders |
| `glassFill` | `#F1F5FB` | `#1E2330` | Drink-water card on Home |
| `shadowAmt` | `rgba(0,0,0,0.06)` | `rgba(0,0,0,0.45)` | Light shadow |
| `shadowAmt2` | `rgba(0,0,0,0.12)` | `rgba(0,0,0,0.6)` | Heavy shadow |

#### CSS implementation (`styles/tokens.css`)

```css
:root {
  /* Brand */
  --color-blue: #2F6BFF;
  --color-blue-dark: #1E54D9;
  --color-blue-soft: #EAF1FF;
  --color-orange: #FF7A3D;
  --color-orange-soft: #FFEEE3;
  --color-orange-ink: #7A3A14;
  --color-orange-end: #E2541A;
  --color-purple: #7C5CFF;
  --color-purple-soft: #F2EBFF;
  --color-purple-ink: #5B3DBF;

  /* Ink (text) */
  --color-ink: #15171C;
  --color-ink-2: #5B6271;
  --color-ink-3: #9AA0AE;

  /* Surfaces */
  --color-bg: #F6F7F9;
  --color-card: #FFFFFF;

  /* Lines */
  --color-hair: rgba(60, 60, 67, 0.10);
  --color-track: #E6E9EF;
  --color-mute: #D8DCE5;

  /* State */
  --color-success: #1FB364;

  /* Habit tints */
  --color-tint-blue: #E6F4FF;
  --color-tint-green: #E8F8EE;
  --color-tint-amber: #FFF1E0;
  --color-tint-pink: #FFEBEE;
  --color-tint-gray: #F2F3F6;

  /* Glass (notification preview) */
  --color-glass: rgba(255, 255, 255, 0.92);
  --color-glass-soft: rgba(255, 255, 255, 0.7);
  --color-glass-border: rgba(0, 0, 0, 0.04);
  --color-glass-fill: #F1F5FB;

  /* Shadows */
  --shadow-amt: rgba(0, 0, 0, 0.06);
  --shadow-amt-2: rgba(0, 0, 0, 0.12);
}

[data-theme="dark"] {
  --color-blue: #4D85FF;
  --color-blue-dark: #2F6BFF;
  --color-blue-soft: rgba(77, 133, 255, 0.18);
  --color-orange: #FF8A4D;
  --color-orange-soft: rgba(255, 138, 77, 0.16);
  --color-orange-ink: #FFB58A;
  --color-orange-end: #D9591F;
  --color-purple: #9B82FF;
  --color-purple-soft: rgba(155, 130, 255, 0.18);
  --color-purple-ink: #C5B5FF;

  --color-ink: #F0F2F7;
  --color-ink-2: #9AA3B5;
  --color-ink-3: #646B7C;

  --color-bg: #0B0E14;
  --color-card: #171B23;

  --color-hair: rgba(255, 255, 255, 0.08);
  --color-track: #23272F;
  --color-mute: #2D323D;

  --color-success: #22C56A;

  --color-tint-blue: rgba(77, 133, 255, 0.14);
  --color-tint-green: rgba(34, 197, 106, 0.14);
  --color-tint-amber: rgba(255, 170, 77, 0.14);
  --color-tint-pink: rgba(255, 107, 138, 0.14);
  --color-tint-gray: #23272F;

  --color-glass: rgba(36, 40, 50, 0.94);
  --color-glass-soft: rgba(36, 40, 50, 0.55);
  --color-glass-border: rgba(255, 255, 255, 0.06);
  --color-glass-fill: #1E2330;

  --shadow-amt: rgba(0, 0, 0, 0.45);
  --shadow-amt-2: rgba(0, 0, 0, 0.60);
}
```

**Hard rule:** TS/TSX never reads hex literals. Always use `var(--color-blue)` or (via Tailwind v4 `@theme`) `bg-blue` / `text-ink`.

### 2.2 Typography

**Family:**
```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display',
             'Segoe UI', system-ui, sans-serif;
```

System fonts (no download). On iOS it becomes SF Pro automatically.

**Scale (extracted from real components):**

| Token | Size | Weight | Letter spacing | Real usage |
|---|---|---|---|---|
| `text-brand` | 40 / 2.5rem | 700 | -1.2 | "Daily" wordmark (Welcome, Done) |
| `text-display` | 30 / 1.875rem | 700 | -0.8 | Onboarding screen titles (S2, S3, S4) |
| `text-title` | 28 / 1.75rem | 700 | -0.7 | Flow titles (CR, RT headers) |
| `text-h2` | 22 / 1.375rem | 600 | -0.4 | In-screen heading, principal input |
| `text-h3` | 20 / 1.25rem | 500 | -0.2 | Large input, big number |
| `text-body-lg` | 17 / 1.0625rem | 500 | 0 | Default input, primary button |
| `text-body` | 15 / 0.9375rem | 400 | 0 | Subtitle, body |
| `text-action` | 16 / 1rem | 500 | 0 | Ghost button, link |
| `text-meta` | 14 / 0.875rem | 500 | 0 | Cancel, action, microcopy |
| `text-caption` | 13 / 0.8125rem | 500 | 0 | Step counter, labels |
| `text-micro` | 12 / 0.75rem | 500 | 0 | Chip labels, captions |

**Numbers** in UI context (counters like "Step 1 of 5"): add `font-variant-numeric: tabular-nums`.

### 2.3 Spacing

Multiples of 4 system, plus a few intermediates used in the design (10, 14, 22):

| Token | Pixels | Real usage |
|---|---|---|
| `space-1` | 4 | Minimal inner gap |
| `space-2` | 6 | Dot gaps, micro spacing |
| `space-3` | 8 | Gap between chips |
| `space-4` | 10 | Gap between grid cards (RT1) |
| `space-5` | 12 | Inner chip padding |
| `space-6` | 14 | Preset card padding |
| `space-7` | 16 | Default input padding |
| `space-8` | 20 | Lateral padding in RT screens |
| `space-9` | 22 | Inter-section padding |
| `space-10` | 24 | Default lateral screen padding |
| `space-11` | 28 | Onboarding lateral padding |
| `space-12` | 32 | Block spacing |
| `space-16` | 64 | Screen padding-top (below status bar) |
| `space-18` | 70 | Onboarding padding-top |
| `space-30` | 120 | Hero padding-top (Welcome) |

**Lateral padding:**
- Onboarding: **24-28px** (S2-S4 use 24, Welcome uses 28).
- Create flows: **24px** lateral, 20px on RT1 grid.

### 2.4 Radius

Values used in the design:

| Token | Value | Usage |
|---|---|---|
| `radius-xs` | 2 | Progress line |
| `radius-sm` | 10 | Small tint icon box |
| `radius-md` | 12 | Tint icon box, badges |
| `radius-base` | 14 | Default input, reminder preset card |
| `radius-lg` | 16 | Primary button, large input |
| `radius-xl` | 18 | Routine preset card, back chip |
| `radius-2xl` | 20 | Sheet, time picker card |
| `radius-3xl` | 24 | Tab bar, sheet container |
| `radius-full` | 9999 | Dots, pills, avatars |

### 2.5 Shadows

iOS-style. Note shadows are **colored** when they come from a brand color (typical iOS):

```css
/* Primary button (shadow follows the button color) */
--shadow-primary: 0 6px 18px rgba(47, 107, 255, 0.20);  /* blue + alpha 0x33 */
--shadow-orange: 0 6px 18px rgba(255, 122, 61, 0.20);

/* Floating tab bar */
--shadow-floating: 0 2px 10px var(--shadow-amt);

/* Selected preset card */
--shadow-selected: 0 6px 18px rgba(47, 107, 255, 0.12);  /* blue + 0x1F */

/* Logo (elevated, with brand glow) */
--shadow-hero: 0 12px 36px rgba(47, 107, 255, 0.22);  /* blue + 0x38 */
```

**General pattern:** colored shadows use the base color + alpha `0x33` (~20%). Neutral shadows use `--shadow-amt`.

In dark mode, black shadows are heavier (alpha goes from `0.06` to `0.45`) because the background is dark.

### 2.6 Motion

| Token | Duration | Easing | Usage |
|---|---|---|---|
| `motion-fast` | 150ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Hover, pressed |
| `motion-dot` | 250ms | `ease` | ProgressDots (width) |
| `motion-base` | 300ms | `ease` | Progress bar fill, general transitions |
| `motion-page` | 320ms | `cubic-bezier(0.32, 0.72, 0, 1)` | Page transitions |
| `motion-spring` | — | spring (stiffness 300, damping 30) | Button press, FAB |

**Respect `prefers-reduced-motion`:** reduce to 50% or replace with crossfade.

---

## 3. Components

> Every component below mirrors the original JSX. Use these measurements; **don't improvise**.

### 3.1 PrimaryButton

```
height: 54px
radius: 16
background: --color-blue (or --color-orange for variants)
color: white
font: text-body-lg (17px / 600 / letter-spacing -0.2)
shadow: 0 6px 18px <color>33 (colored shadow)
horizontal padding: 0 (text centered)
```

**Pressed:** scale 0.97, shadow halved.
**Loading:** inline 16px spinner instead of label.

### 3.2 GhostButton

```
height: 54px (matches primary for alignment)
background: transparent
color: --color-ink-2
font: 16 / 500
```

Used as a secondary action below the primary (e.g., "I already have an account").

### 3.3 Input

**Default variant (S2 Sign up):**
```
height: 52px
radius: 14
background: --color-card
border: 1.5px solid --color-hair (default) | --color-blue (focused)
padding: 0 16px
font: text-body-lg (17 / 400)
color: --color-ink
```

**Label:**
- Above the input, 13px / 500 / `--color-ink-2`.
- 4px left padding, 6px margin-bottom.

**"Hero input" variant** (S3 Name, CR1 Title):
```
height: 64px
radius: 16
border: 1.5px solid --color-blue (always focused — it's the screen's primary action)
padding: 0 20px
font: 20-22px / 500
```

**Animated caret:** 2px wide bar, height = `fontSize + 4`, color `--color-blue`, `blink 1s infinite`.

```css
@keyframes blink {
  0%, 50% { opacity: 1; }
  50.01%, 100% { opacity: 0; }
}
```

### 3.4 Chip / Preset Card

**Small chip (S5 quick chips):**
```
height: 32-36px
radius: 16-18
padding: 8px 14px
font: 12-13 / 500
```
- Default: `bg: --color-card`, `border: 1.5px solid --color-hair`, `color: --color-ink-3`.
- Selected: `bg: --color-card`, `border: 1.5px solid --color-blue`, `color: --color-ink` or `--color-blue`.

**Preset card (CR1 type, RT1 routine):**
```
padding: 14-16px
radius: 14 (CR) | 18 (RT)
background: --color-card
border: 1.5px solid --color-hair (default) | --color-blue (selected)
shadow (selected): 0 6px 18px rgba(47, 107, 255, 0.12)
```

Structure:
- Tint icon box: 32-40px, radius 10-12, appropriate tint background (`--color-tint-*`), 16-20px emoji centered.
- Label: 12-14 / 500, below (CR1 column) or beside (RT1 row).

### 3.5 ProgressDots (Onboarding)

```
total: 4 (S2-S5)
inactive dot: 6×6, radius 3, background --color-mute
active dot: 22×6 (pill), radius 3, background --color-blue
gap: 6
transition: width 250ms
```

### 3.6 ProgressBar (Flow steps)

```
height: 4
radius: 2
background: --color-track
fill: --color-blue (CR) | --color-blue or custom accent (RT)
transition: width 300ms
```

### 3.7 Flow Header (CRHeader / RTHeader)

Pattern for multi-step flows (create reminder, create routine):

```
back chip: 36×36, radius 18 (full pill), bg --color-card, border 1px hair
step counter (center): "Step X of Y", 13 / 500 / --color-ink-3, tabular-nums
cancel (right): "Cancel", 14 / 500 / --color-ink-2
lateral padding: 24px
margin-bottom (after header): 22-24px

then:
progress bar (height 4)
margin-bottom 24

then:
title 28 / 700 / -0.7, --color-ink, mb 6
subtitle (optional) 15 / 400 / 1.4 line-height, --color-ink-2
```

### 3.8 Logo (Daily mark)

Concept mark: **concentric blue ring + orange dot at "2 o'clock".**

```jsx
// Default size: 84-96px
<div style="
  width: size, height: size, borderRadius: size,
  background: --color-card,
  shadow: 0 12px 36px var(--color-blue)/0x38, inset 0 0 0 1px var(--color-hair)
">
  <div style="
    width: size*0.56, height: size*0.56, borderRadius: 50%,
    border: size*0.08 solid var(--color-blue)
  "/>
  <div style="
    absolute, top: size*0.18, right: size*0.20,
    width: size*0.16, height: size*0.16, borderRadius: 50%,
    background: var(--color-orange),
    shadow: 0 2px 6px var(--color-orange)/0x66
  "/>
</div>
```

Implement as a parameterizable `<Logo size={N}>` component.

### 3.9 Tab Bar (Bottom, Floating)

⚠️ **Not a traditional iOS tab bar** (not stuck to the bottom edge). It's **floating with margins**:

```
margin: 14px 16px 36px (top / lateral / bottom)
height: 64
radius: 24
background: --color-card
border: 1px solid --color-hair
shadow: 0 2px 10px var(--shadow-amt)
padding-top: 4
display: flex, justify around
```

**Each tab:**
```
flex column, align center, gap: 3px
color: --color-blue (active) | --color-ink-3 (inactive)
icon: 24×24 SVG, fill currentColor (outline inactive / filled active)
label: 11-12 / 500
```

**4 tabs:** Today, All, Stats, You.

**Icons (all 24×24 viewBox, stroke 1.8):**
- Today: calendar with day filled
- All: bullet list (3 dots + 3 lines)
- Stats: 3 ascending bars
- You: avatar (head + shoulders)

Outline when inactive, filled when active.

### 3.10 Card (generic)

```
background: --color-card
radius: 16-18 (16 for inputs/items, 18 for preset cards)
border: 1px solid --color-hair (light); none (dark — see screens.jsx line 533)
padding: 14-20px
```

In **dark mode**, cards drop the border (the bg contrast already separates them visually). In light, the `hair` border is essential for definition.

### 3.11 Tint Box (icon container)

Small box with type/category color:

```
size: 32-40px (square)
radius: 10-12
background: --color-tint-blue | --color-tint-green | --color-tint-amber | --color-tint-pink | --color-purple-soft | --color-tint-gray
content: emoji or icon, 16-20px, centered
```

Tints by type (routine):
- 💧 Drink water → `tint-blue`
- 🧘 Stretch → `purple-soft`
- 📖 Read → `tint-amber`
- 🚶 Walk → `tint-green`
- ✦ Meditate → `tint-pink`
- ＋ Custom → `tint-gray`

### 3.12 Notification preview (glass)

Appears in S5 (permission primer). Mock of an iOS notification with **frosted glass effect**:

```
background: --color-glass
backdrop-filter: blur(20px)
border: 0.5px solid --color-glass-border
radius: 18
padding: 12-14px
```

Use real `backdrop-filter` where supported; fallback to opaque `--color-card`.

### 3.13 Sheet (Bottom)

When needed (quick create, picker):
- Slides up from the bottom with a top handle (40 × 4px, `--color-mute`).
- Background: `--color-card`.
- Radius: `24` on the top corners only.
- Backdrop: 40% opacity black overlay.
- Drag-to-dismiss enabled.

---

## 4. Layout patterns

### 4.1 Standard screen (onboarding / flows)

```
┌─────────────────────────┐
│   Status bar (system)   │  ← safe-area-inset-top
├─────────────────────────┤
│   padding-top 64-70px   │  ← generous top breathing room
│                         │
│   [ProgressDots or      │
│    Flow Header]         │
│                         │
│   Title (28-30 / 700)   │
│   Subtitle (15 / 400)   │
│                         │
│   Main content          │  ← 24px lateral padding
│                         │
│   (flex spacer)         │
│                         │
│   [PrimaryButton] CTA   │  ← padding 0 24px 14px bottom
└─────────────────────────┘
   safe-area-inset-bottom
```

### 4.2 Home (with tab bar)

```
┌─────────────────────────┐
│   Status bar            │
├─────────────────────────┤
│   PageHeader            │  ← greeting + date
│                         │
│   Scrollable cards /    │
│   list                  │
│   ...                   │
├─────────────────────────┤
│   [Floating Tab Bar]    │  ← 14px gap before, 36px after
└─────────────────────────┘
```

### 4.3 Multi-step flow

Each step is **its own route** (distinct URL) — native back works, intermediate state in Zustand or URL params. The header (Step X of Y + progress bar) is a shared layout between steps.

---

## 5. Accessibility

- **Contrast**: semantic tokens meet WCAG AA — audit with a tool at the end of Phase 1.
- **Touch targets**: minimum 44 × 44pt. Primary button is 54pt — fine. Smaller chips need expanded tap area via padding or pseudo-element.
- **Visible focus**: `outline: 2px solid var(--color-blue); outline-offset: 2px` for keyboard navigation (desktop).
- **ARIA**: labels on icon-only buttons, `aria-current="page"` on active tab, `aria-live="polite"` on toasts.
- **Reduced motion**: respect it; drop progress-dot/bar `transition: width`, replace with instant swap.
- **VoiceOver**: test before beta on a real iPhone.
- **`<html lang="en">`** — global app.

---

## 6. Iconography

**Origin:** the tab bar icons are **inline SVG** in the original code (not from a library). Reason: fine-grained control over outline/filled states.

**Implementation recommendation:**

Keep tab icons as inline SVG (4 icons × 2 states = 8 SVGs, copy from `tabs.jsx`).

For other icons (fields, indicators, actions), use **`lucide-react`** with `strokeWidth={1.8}` (same as the design) — consistent visual weight.

**Standard sizes:** 16, 20, 24, 32px.

**Color:** `color: currentColor` in the SVG, let the parent decide.

---

## 7. Content (microcopy)

**Language:** English (global market).

**Tone:** close, direct, low formality. Short subtitle sentences.

**Strings from the design (already in English, keep as-is):**

| Screen | Copy |
|---|---|
| Welcome tagline | "One small thing, every day." |
| Welcome primary CTA | "Get started" |
| Welcome secondary | "I already have an account" |
| Sign up title | "Create your account" |
| Sign up subtitle | "So your reminders follow you everywhere." |
| Name title | "What should we call you?" |
| Name subtitle | "We'll use this on your morning greeting." |
| Time title | "When should we remind you?" |
| Time subtitle | "Pick a time that fits your routine." |
| Notifications title | "Turn on reminders" |
| Notifications subtitle | "Daily lives in your notifications, not your screen time." |
| Done | "You're all set" |
| Home greeting | "Morning, [Name]" / "Afternoon, [Name]" / "Evening, [Name]" |
| Reminder created | "Reminder created" |
| Reminder created sub | "First ping Tuesday morning." |
| Routine added | "Routine added" |
| Routine added sub | "First ping Monday at 8:30 AM." |
| Just remind me (RT4 skip) | "Just remind me" |
| Just remind me sub | "No counting, no goal." |
| Toast undo | "Undo" |
| Toast view | "View" |

**Microcopy rules:**
- Close and casual ("You're all set" instead of "Setup complete").
- Specific errors with action ("Email already in use. Want to sign in?" not "Error").
- Empty states invite action ("How about your first reminder?" not "No items found").
- **Time format:** 12-hour with AM/PM for English (US-style). For future locales, derive from `Intl.DateTimeFormat`.
- **Date format:** "Friday, May 29" — long weekday + month name + day. Don't reinvent; use `date-fns` `format('EEEE, MMMM d')`.

**Greeting logic:**
- Local time 5am-11:59 → "Morning, [Name]"
- 12pm-5:59pm → "Afternoon, [Name]"
- 6pm-4:59am → "Evening, [Name]"

---

## 8. Assets

### 8.1 Daily logo

Already defined (§3.8). Render programmatically in React; generate PNG variants (192, 512) only for the PWA manifest. PWA icon background: `--color-blue` (`#2F6BFF`).

### 8.2 PWA icons

Generate from the `<Logo size={512}>` component rendered to canvas:
- 192×192 (any + maskable)
- 512×512 (any + maskable)
- Apple touch icon 180×180

Tool: [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator).

### 8.3 iOS splash screens

Needed for a polished look on install. Generate via PWA Asset Generator from the logo.

### 8.4 Favicon

32×32 PNG + ICO. Could be just the blue ring (no orange dot) to read well at small sizes.

---

## 9. Implementation checklist

When starting a new component/screen, verify:

- [ ] Uses only CSS vars (`var(--color-*)`) or Tailwind tokens — zero hex literals.
- [ ] Works in light and dark mode.
- [ ] Touch targets ≥ 44pt (or expanded via padding).
- [ ] Has a loading state (skeleton or inline).
- [ ] Has an empty state (if applicable).
- [ ] Has an error state (if applicable).
- [ ] Animates transitions with `motion-*` tokens.
- [ ] Respects `prefers-reduced-motion`.
- [ ] ARIA labels on text-less interactions.
- [ ] Tested at 390 × 844 (iPhone 16 Pro logical).
- [ ] Microcopy in English, consistent tone.
- [ ] Visually matches the original JSX from `app-onboarding`.

---

## 10. Reference: expected component mapping

JSX (design) → React (production) mapping:

| Original JSX | React component |
|---|---|
| `PrimaryButton` | `<Button variant="primary">` |
| `GhostButton` | `<Button variant="ghost">` |
| `Logo` | `<Logo size={N} />` |
| `ProgressDots` | `<ProgressDots idx={N} total={M} />` |
| `CRHeader` / `RTHeader` | `<FlowHeader step={N} total={M} title="" sub="" />` |
| `TabBar` | `<TabBar active="today" />` |
| `TabIcon` | `<TabIcon kind="today" active />` |
| `PageHeader` | `<PageHeader title="" sub="" />` |
| `Field` (inline in S2) | `<Input label="" type="" />` |
| `Quick` (inline in CR1) | `<TypeCard icon="" label="" tint="" selected />` |
| Preset card RT1 | `<RoutinePresetCard preset={preset} selected />` |
| TimeCard CR2 | `<TimePicker />` (sheet or inline) |
| WeekdayPicker RT2 | `<WeekdayPicker value={[]} onChange={...} />` |

---

## 11. Screens mapped in design

Full inventory of what's visually ready:

**Signup (7 screens)** — in `screens.jsx`:
`S1_Welcome` · `S2_SignUp` · `S3_Name` · `S4_Time` · `S5_Notifications` · `S6_Done` · `Login`

**Home (1 screen with 4 tabs)** — in `screens.jsx` + `tabs.jsx`:
`Home` (today) · `AllPage` · `StatsPage` · `YouPage`

**Create reminder (8 screens)** — in `create-reminder.jsx`:
`CR1_Title` · `CR2_When` · `CR3_Schedule` · `CR3b_Custom` · `CR3c_CustomTimes` · `CR4_Message` · `CR5_Review` · `CR6_Created`

**Create routine (5 screens)** — in `routine.jsx`:
`RT1_Pick` · `RT2_Days` · `RT3_Times` · `RT4_Goal` · `RT5_Done`

**Total currently:** 25 screens.

**Pending (to be designed):**
- Reminder detail / edit.
- Routine detail / edit.
- "How to install" (PWA install tutorial).
- Forgot password.
- Empty / error states for lists.

---

*Significant visual changes require updating this file before any code commit. When in doubt, open `screens.jsx` (the visual source of truth) or consult this document.*
