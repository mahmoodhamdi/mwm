# MWM Brand Identity Guide

## Brand Overview

**MWM** (MWM Software Solutions) is a software development company specializing in building integrated digital solutions including web platforms, mobile apps, APIs, and automation tools.

## Logo

The MWM logo consists of:

1. **Icon Mark**: Code brackets `< >` with a central circuit node and connection lines — representing software development, connectivity, and technical precision
2. **Wordmark**: "MWM" in bold Inter/sans-serif with the two M's in brand blue and the W in neutral
3. **Tagline**: "SOFTWARE SOLUTIONS" in spaced uppercase

### Logo Files

- `public/logo.svg` — Full horizontal logo (dark background version)
- `public/logo-dark.svg` — Full horizontal logo (light background version)
- `public/logo-icon.svg` — Icon mark only (social media, app icon)
- `public/favicon.svg` — Favicon (blue gradient background with white icon)
- `public/og-image.svg` — Open Graph social sharing image (1200x630)

### Usage Rules

- Minimum clear space: half the icon width on all sides
- Minimum size: 120px wide for horizontal logo, 32px for icon
- Never stretch, rotate, or modify the logo proportions
- Always use on solid backgrounds — never on busy images

## Color Palette

### Primary Colors

| Name         | Hex       | Usage                                              |
| ------------ | --------- | -------------------------------------------------- |
| Sky Blue 500 | `#0ea5e9` | Primary brand color, CTAs, links, highlighted text |
| Sky Blue 400 | `#38bdf8` | Accent, gradients, hover states                    |
| Sky Blue 600 | `#0284c7` | Gradient end, pressed states                       |
| Sky Blue 700 | `#0369a1` | Dark gradient end                                  |

### Neutral Colors (Dark Theme)

| Name      | Hex       | Usage                                   |
| --------- | --------- | --------------------------------------- |
| Slate 900 | `#0f172a` | Primary background                      |
| Slate 800 | `#1e293b` | Card backgrounds, secondary backgrounds |
| Slate 700 | `#334155` | Borders, dividers                       |
| Slate 400 | `#94a3b8` | Secondary text, subtitles               |
| Slate 200 | `#e2e8f0` | Primary text on dark                    |
| Slate 50  | `#f8fafc` | Headings, emphasized text on dark       |

### Neutral Colors (Light Theme)

| Name     | Hex       | Usage                |
| -------- | --------- | -------------------- |
| White    | `#ffffff` | Primary background   |
| Gray 50  | `#f9fafb` | Secondary background |
| Gray 200 | `#e5e7eb` | Borders              |
| Gray 700 | `#374151` | Primary text         |
| Gray 900 | `#111827` | Headings             |

### Semantic Colors

| Name    | Hex       | Usage                         |
| ------- | --------- | ----------------------------- |
| Success | `#22c55e` | Success states, confirmations |
| Warning | `#f59e0b` | Warnings, caution             |
| Error   | `#ef4444` | Errors, destructive actions   |
| Info    | `#3b82f6` | Informational messages        |

## Typography

### Font Families

- **English**: Inter (primary), system sans-serif fallback
- **Arabic**: Cairo (primary), Arabic system fonts fallback
- **Code**: JetBrains Mono, monospace

### Type Scale

| Level   | Size    | Weight  | Usage                      |
| ------- | ------- | ------- | -------------------------- |
| Display | 48-64px | 800     | Hero headings              |
| H1      | 36-48px | 700-800 | Page titles                |
| H2      | 28-36px | 700     | Section headings           |
| H3      | 20-24px | 600     | Card titles, subsections   |
| Body    | 16px    | 400     | Paragraph text             |
| Small   | 14px    | 400-500 | Captions, badges, metadata |
| Tiny    | 12px    | 500     | Labels, tags               |

## Spacing & Layout

- **Base unit**: 4px
- **Section padding**: 64-80px vertical
- **Container max-width**: 1280px with 16-24px horizontal padding
- **Card border-radius**: 12-16px
- **Button border-radius**: 8-12px (rounded-xl for CTAs, rounded-full for pills)

## Gradients

### Primary Gradient (Hero sections)

```css
background: linear-gradient(to bottom right, #0ea5e9, #0284c7);
```

### Dark Background Gradient

```css
background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, rgba(14, 165, 233, 0.08) 100%);
```

### Card Glow Effect

```css
box-shadow:
  0 0 80px rgba(14, 165, 233, 0.1),
  0 25px 50px rgba(0, 0, 0, 0.3);
border: 1px solid rgba(14, 165, 233, 0.2);
```

## Bilingual Design

- **Default locale**: Arabic (RTL)
- **RTL support**: All layouts mirror for Arabic using Tailwind RTL plugin
- **Arabic font**: Cairo — matches Inter's modern geometric feel
- **Direction switching**: `dir="rtl"` on `<html>`, automatic via `next-intl`
- **Always test both directions** for every component

## Dark Mode

- **Default**: Dark mode (matches the tech/developer audience)
- **Implementation**: `class` strategy via `next-themes`
- **Transition**: Smooth 200ms transition on theme switch
- **Both themes** must maintain the brand blue as primary color

## Iconography

- **Style**: Lucide React icons — consistent stroke-based design
- **Stroke width**: 2px default
- **Size**: 20-24px for UI, 40-48px for features, 60-80px for hero sections
- **Color**: Inherit from parent or use brand blue for emphasis

## Components Style Guide

### Buttons

- **Primary**: Sky blue gradient background, white text, rounded-xl
- **Secondary/Outline**: Transparent with sky blue border and text
- **Ghost**: No border, sky blue text, subtle hover background

### Cards

- **Background**: Slate 800 with subtle border (Slate 700 at 40% opacity)
- **Hover**: Slight scale (1.02), increased border opacity, glow shadow
- **Content**: Title in white, description in Slate 400

### Navigation

- **Desktop**: Horizontal with centered links, CTA button right-aligned
- **Mobile**: Hamburger menu sliding panel
- **Active state**: Sky blue text color
- **Sticky**: Backdrop blur with semi-transparent background

## Motion & Animation

- **Framework**: Framer Motion
- **Entry animations**: Fade up with 0.5s duration, staggered children
- **Hover effects**: Scale 1.02-1.05, 200ms ease
- **Page transitions**: Subtle fade, no jarring movements
- **Respect `prefers-reduced-motion`** for accessibility
