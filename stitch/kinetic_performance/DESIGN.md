---
name: Kinetic Performance
colors:
  surface: '#121317'
  surface-dim: '#121317'
  surface-bright: '#38393d'
  surface-container-lowest: '#0d0e12'
  surface-container-low: '#1a1b1f'
  surface-container: '#1e1f23'
  surface-container-high: '#292a2e'
  surface-container-highest: '#343539'
  on-surface: '#e3e2e7'
  on-surface-variant: '#c4c9ac'
  inverse-surface: '#e3e2e7'
  inverse-on-surface: '#2f3034'
  outline: '#8e9379'
  outline-variant: '#444933'
  surface-tint: '#abd600'
  primary: '#ffffff'
  on-primary: '#283500'
  primary-container: '#c3f400'
  on-primary-container: '#556d00'
  inverse-primary: '#506600'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#4a4949'
  on-secondary-container: '#bab8b7'
  tertiary: '#ffffff'
  on-tertiary: '#303030'
  tertiary-container: '#e4e2e1'
  on-tertiary-container: '#656464'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c3f400'
  primary-fixed-dim: '#abd600'
  on-primary-fixed: '#161e00'
  on-primary-fixed-variant: '#3c4d00'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#e4e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474746'
  background: '#121317'
  on-background: '#e3e2e7'
  surface-variant: '#343539'
typography:
  display-lg:
    fontFamily: barlowCondensed
    fontSize: 72px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: barlowCondensed
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: 0.02em
  headline-md:
    fontFamily: barlowCondensed
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  data-lg:
    fontFamily: jetbrainsMono
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.0'
  data-sm:
    fontFamily: jetbrainsMono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  label-caps:
    fontFamily: jetbrainsMono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1440px
---

## Brand & Style
This design system is engineered for elite athletic performance tracking and high-stakes sports analytics. The brand personality is aggressive, precise, and utilitarian, evoking an emotional response of urgency and focus. 

The style is **Industrial Minimalism mixed with High-Contrast Boldness**. It draws inspiration from mechanical telemetry displays and professional gym equipment. The aesthetic avoids unnecessary decoration in favor of raw data density and "sports-hardened" durability. Every element should feel like it was built to withstand high-velocity environments, using heavy borders and a systematic approach to information hierarchy.

## Colors
The palette is anchored by **Electric Citron**, a high-visibility hue designed to grab attention and signal active states or critical performance data. This is set against **Deep Charcoal**, which provides a low-glare, high-contrast foundation suitable for training environments.

- **Primary (Electric Citron):** Used for primary actions, success states, and highlighting key performance metrics.
- **Secondary (Deep Charcoal):** The primary surface color to reduce eye strain and maintain a sleek, technical look.
- **Tertiary (Graphite):** Used for elevated surfaces like cards and container backgrounds.
- **Neutral:** A range of cool grays used for non-essential data, borders, and disabled states.

## Typography
Typography is split into two functional roles: **Impact** and **Information.** 

**Barlow Condensed** is used for headlines to maximize horizontal space and reinforce the "hardened" industrial aesthetic. It should always be used in uppercase for display purposes. 

**JetBrains Mono** is the engine of the design system, used for all technical data points, telemetry, and labels. Its monospaced nature ensures that fluctuating numerical data (like heart rate or split times) remains visually stable. 

**Inter** provides a clean, neutral balance for longer descriptive text and UI body copy where readability is paramount.

## Layout & Spacing
The layout follows a **Rigid Grid** philosophy. We utilize a 12-column system on desktop and a 4-column system on mobile. Spacing is strictly based on a 4px baseline grid to ensure mathematical precision in the UI.

- **Data Density:** Information should be packed tightly but logically. Use 8px (2 units) for related elements and 24px (6 units) to separate distinct sections.
- **Reflow:** On mobile, complex data tables should pivot to a list-view or a horizontally scrollable container to maintain the monospaced integrity of the technical data.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Bold Outlines** rather than soft shadows. 

In this design system, "Higher" elements do not cast large blurs. Instead, they use a lighter shade of Deep Charcoal or a 1px solid border in a neutral-gray to define their boundaries. 

- **Level 0 (Base):** Deep Charcoal (#121212).
- **Level 1 (Cards/Containers):** Graphite (#2A2A2A) with a subtle 1px border.
- **Level 2 (Popovers/Modals):** High-contrast borders using Electric Citron or Pure White to "cut" through the background.

## Shapes
This design system utilizes **Sharp** geometry. There are no rounded corners. 90-degree angles communicate precision, stability, and an uncompromising "tool-like" nature. 

All buttons, cards, and input fields must have a 0px border radius. This allows elements to be stacked and tiled seamlessly, mimicking the look of professional rack-mounted hardware or industrial control panels.

## Components
- **Buttons:** Rectangular with high-contrast fills. The primary button is Electric Citron with Deep Charcoal text. Hover states should invert the colors or add a thick 2px inner stroke.
- **Performance Chips:** Use JetBrains Mono for the label. Backgrounds should be transparent with a 1px border. If the chip represents a "Live" state, include a pulsing square icon.
- **Data Lists:** Use alternating row stripes (Zebra striping) in very subtle gray increments to guide the eye across technical data points.
- **Input Fields:** Bottom-border only or full-framed with 1px neutral borders. When focused, the border becomes Electric Citron.
- **Telemetry Cards:** Cards should feature a "header bar" in a slightly lighter gray with the title in `label-caps`. 
- **Gauges & Charts:** All data visualizations should use Electric Citron for primary data lines. Use sharp, non-curved paths for line graphs to emphasize raw data over smoothed aesthetics.