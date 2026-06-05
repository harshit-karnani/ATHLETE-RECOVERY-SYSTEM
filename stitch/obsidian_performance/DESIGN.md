---
name: Obsidian Performance
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#bacac5'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#859490'
  outline-variant: '#3c4a46'
  surface-tint: '#3cddc7'
  primary: '#57f1db'
  on-primary: '#003731'
  primary-container: '#2dd4bf'
  on-primary-container: '#00574d'
  inverse-primary: '#006b5f'
  secondary: '#ffb2b9'
  on-secondary: '#67001f'
  secondary-container: '#891933'
  on-secondary-container: '#ff97a3'
  tertiary: '#ffd1aa'
  on-tertiary: '#4b2800'
  tertiary-container: '#ffac5a'
  on-tertiary-container: '#744000'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#62fae3'
  primary-fixed-dim: '#3cddc7'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005047'
  secondary-fixed: '#ffdadc'
  secondary-fixed-dim: '#ffb2b9'
  on-secondary-fixed: '#400010'
  on-secondary-fixed-variant: '#891933'
  tertiary-fixed: '#ffdcc0'
  tertiary-fixed-dim: '#ffb875'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#6b3b00'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  container-max: 1440px
---

## Brand & Style

The brand personality is high-octane, technical, and premium. It targets power users and professionals who require high-performance tools and a focused, low-strain environment. The emotional response is one of precision, exclusivity, and immersive focus.

The design system utilizes a **Glassmorphic** style layered over a **Minimalist** foundation. It leverages deep obsidian tones to create a sense of infinite depth, while semi-transparent surfaces and vibrant performance-driven accents guide the eye toward critical data and actions. The aesthetic is "Technical Luxury"—clean, purposeful, and visually arresting.

## Colors

The palette is built on a "True Dark" foundation to ensure maximum panel contrast and OLED efficiency.

*   **Primary (Performance Teal):** Used for primary actions, success states, and active data streams. Optimized for high luminosity against dark backgrounds.
*   **Secondary (Vital Coral):** Used for critical alerts, secondary highlights, and interactive accents to provide a warm counterpoint to the cool base.
*   **Neutral:** A range of slate grays used for secondary text and structural borders.
*   **Surface:** Glass surfaces are defined by low-opacity white fills (`rgba(255,255,255,0.03)`) to create the "frosted" look without washing out the deep background.

## Typography

This design system uses **Geist** for its primary typeface, offering a technical, developer-friendly aesthetic that remains highly readable at all sizes. Headlines are tight and impactful, utilizing negative letter spacing to feel "locked in."

**JetBrains Mono** is used for labels, data points, and metadata. This monospaced choice reinforces the performance/technical nature of the system, ensuring that numerical data aligns perfectly in dashboards and tables. All text should default to white (#FFFFFF) for primary content or Slate 400 (#94A3B8) for secondary content.

## Layout & Spacing

The layout follows a **Fluid Grid** model based on a 12-column structure for desktop and a 4-column structure for mobile. A strict 4px baseline grid governs all internal component spacing to maintain mathematical rigor.

*   **Desktop:** 64px outer margins with 24px gutters. Elements should snap to column widths to maintain the technical feel.
*   **Mobile:** 20px outer margins. Glass cards typically span full width to maximize content area.
*   **Rhythm:** Vertical rhythm is aggressive; use generous whitespace between sections (80px+) to allow the glass effects to "breathe" against the obsidian background.

## Elevation & Depth

Depth is achieved through **Glassmorphism** rather than traditional shadows. 

1.  **Z-Index 0 (Background):** Solid #0A0A0B.
2.  **Z-Index 1 (Cards/Panels):** `backdrop-filter: blur(20px)` with a subtle `1px` solid border of `rgba(255, 255, 255, 0.1)`.
3.  **Z-Index 2 (Popovers/Modals):** `backdrop-filter: blur(40px)` with a slightly brighter border (`rgba(255, 255, 255, 0.2)`) and a very soft, large-radius black shadow to occlude the layers below.

Avoid using drop shadows on base-level components; let the background blur and thin borders define the boundaries.

## Shapes

The shape language is **Soft (1)**. This subtle rounding (4px for base, 8px for large) strikes a balance between the precision of a "sharp" technical UI and the approachability of a modern premium product.

*   **Buttons & Inputs:** 4px radius.
*   **Cards & Modals:** 8px radius.
*   **Selection Indicators:** Sharp corners or 2px radius to emphasize a "digital" feel.

## Components

*   **Buttons:** Primary buttons use a solid Teal (#2DD4BF) fill with black text. Secondary buttons are "Ghost" style with a 1px white border at 20% opacity and white text.
*   **Inputs:** Fields are dark with a 1px border. On focus, the border glows Teal with a subtle outer shadow (glow effect).
*   **Glass Cards:** Use as the primary container. Always include a `backdrop-filter` and a top-weighted subtle gradient border to simulate a light source from above.
*   **Chips:** Small, monospaced text inside a high-contrast pill. Use Teal for "Active" and Coral for "High Priority."
*   **Data Visualizations:** Use thin, 2px stroke weights for charts. Use the Primary Teal for main data trends and Coral for anomalies or targets.
*   **Progress Bars:** Thin 4px tracks. The filled portion should have a slight outer glow in the corresponding accent color.