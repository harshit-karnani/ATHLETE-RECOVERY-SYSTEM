---
name: High-Performance Athletic System
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c6c9ab'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#909378'
  outline-variant: '#454932'
  surface-tint: '#b8d300'
  primary: '#ffffff'
  on-primary: '#2c3400'
  primary-container: '#d2f000'
  on-primary-container: '#5d6b00'
  inverse-primary: '#576500'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#ffffff'
  on-tertiary: '#16343b'
  tertiary-container: '#c8e8f1'
  on-tertiary-container: '#4b6971'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d2f000'
  primary-fixed-dim: '#b8d300'
  on-primary-fixed: '#191e00'
  on-primary-fixed-variant: '#414c00'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#c8e8f1'
  tertiary-fixed-dim: '#acccd4'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#2e4b52'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Barlow Condensed
    fontSize: 72px
    fontWeight: '800'
    lineHeight: '1.0'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Barlow Condensed
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Barlow Condensed
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Barlow Condensed
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
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
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1280px
---

## Brand & Style

The design system is engineered for high-performance environments, evoking the adrenaline and precision of elite sports. It targets an audience that values efficiency, speed, and a "premium-active" lifestyle. 

The aesthetic is a fusion of **High-Contrast Bold** and **Modern Corporate**. It prioritizes extreme legibility under movement, utilizing heavy-weighted typography and a punchy, vibrant accent against a dark, recessive background. The emotional response is one of energy, discipline, and technological superiority—moving away from "hacker" aesthetics toward a refined, world-class athletic interface.

## Colors

The palette is anchored by the high-visibility **Electric Citron**, used exclusively for primary actions, critical status indicators, and branding moments. This is contrasted against **Deep Charcoal**, which provides a low-fatigue, premium canvas.

- **Primary (Electric Citron):** A high-energy neon used to draw immediate focus.
- **Surface (Deep Charcoal):** Layers of dark grey are used to create hierarchy without breaking the immersion of the dark environment.
- **Typography:** Pure white (#FFFFFF) for maximum contrast on body text, and Electric Citron or high-grey for auxiliary information.

## Typography

The typographic strategy balances raw power with technical clarity. Headlines utilize **Barlow Condensed** in heavy weights and uppercase transforms to mimic the "stadium" feel of professional athletics. These are tightly tracked and leading is kept minimal to maintain a dense, energetic block of text.

**Geist** serves as the body face, providing a sophisticated, "engineered" feel that ensures readability for long-form data or instructions. It provides a premium, developer-grade precision that distinguishes this design system from consumer-grade apps.

## Layout & Spacing

This design system uses a **Fluid Grid** model with a strict 4px baseline rhythm. This ensures that even in dense, data-heavy views, the layout feels intentional and structured.

- **Desktop:** 12-column grid with 16px gutters.
- **Mobile:** 4-column grid with 16px margins.
- **Rhythm:** Spacing between related elements should stay within the 4px/8px/12px range to maintain a "tight" performance feel. Larger 32px+ gaps are reserved for separating major content sections.

## Elevation & Depth

In a high-performance dark mode, elevation is conveyed through **Tonal Layers** rather than heavy shadows. 

1. **Base (Level 0):** Deep Charcoal (#121212).
2. **Raised (Level 1):** Slightly lighter charcoal (#1A1A1A) with a 1px subtle inner stroke to define edges.
3. **Overlay (Level 2):** Modest backdrop blurs (12px-20px) are used for navigation bars and modals to maintain context of the underlying data.

Shadows, if used, are sharp and low-spread, functioning more like "rim lighting" to separate elements rather than creating soft ambient depth.

## Shapes

The shape language is **Soft (Level 1)**. Elements feature a 4px (0.25rem) base radius. This small radius retains the aggressive, precise feel of the brand while avoiding the "dangerous" look of sharp 0px corners. 

Interactive elements like buttons use the base radius, while larger containers like cards may scale up to 8px. Pill-shaped elements are avoided to maintain the architectural, high-performance aesthetic.

## Components

### Buttons
Primary buttons are filled with **Electric Citron** with black text, using the `label-sm` font style for high-impact calls to action. Ghost buttons use a 1px Electric Citron border with no fill.

### Input Fields
Inputs use a Deep Charcoal background with a subtle 1px border. Upon focus, the border transitions to Electric Citron. Labels are always positioned above the input in `label-sm` style.

### Cards
Cards are the primary container for performance metrics. They should have a background of `#1A1A1A` and no border, relying on the contrast against the `#121212` base to define their shape.

### Data Visualization
Charts and graphs should use Electric Citron for the primary data line. Secondary data lines use white or semi-transparent grey. Avoid gradients unless they signify a specific metric "glow" or intensity.

### Chips & Tags
Small, rectangular tags with the base 4px radius. Use them for status (e.g., "LIVE", "SYNCED") with Electric Citron text and a subtle dark-grey fill.