---
name: Kinetic Grid
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
  on-surface-variant: '#c6c9ad'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#90937a'
  outline-variant: '#464934'
  surface-tint: '#b8d300'
  primary: '#ffffff'
  on-primary: '#2c3400'
  primary-container: '#d3f02a'
  on-primary-container: '#5d6b00'
  inverse-primary: '#576500'
  secondary: '#c8c6c5'
  on-secondary: '#303030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#ffffff'
  on-tertiary: '#303030'
  tertiary-container: '#e4e2e1'
  on-tertiary-container: '#656464'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d3f02a'
  primary-fixed-dim: '#b8d300'
  on-primary-fixed: '#191e00'
  on-primary-fixed-variant: '#414c00'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1b1b1c'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e4e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-xl:
    fontFamily: Oswald
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Oswald
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  headline-md:
    fontFamily: Oswald
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.1em
  data-display:
    fontFamily: Oswald
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Oswald
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  grid-base: 8px
---

## Brand & Style
The design system is engineered for high-performance athletic environments and data-intensive sports tracking. It evokes an adrenaline-fueled, "heads-up display" (HUD) emotional response, prioritizing speed of legibility and technical precision.

The style is a fusion of **Neo-Brutalism** and **Technical Minimalism**. It utilizes heavy 2px strokes, aggressive typography, and a "gritty" aesthetic that mirrors the intensity of a high-end training facility. Every interface element should feel like a piece of calibrated equipment—functional, durable, and uncompromising.

## Colors
The palette is built on a foundation of high-contrast, dark-mode surfaces to minimize eye strain in low-light gym environments while maximizing the vibrance of active data.

- **Primary (Electric Citron):** Used exclusively for critical calls to action, active states, and performance highlights. It must pierce through the dark background.
- **Secondary (Deep Graphite):** Utilized for structural elements, secondary buttons, and container backgrounds that sit atop the primary surface.
- **Surface (Deep Charcoal):** The base layer of the application, providing a dense, immersive environment.
- **Grid Lines:** A subtle but present #333333 is used for technical textures and container borders to maintain the "grid" architecture.

## Typography
Typography is treated as a structural component. **Oswald** provides a condensed, impactful verticality for headlines and telemetry data, mimicking the look of digital scoreboards.

**Inter** is used for body copy to ensure maximum legibility at smaller sizes during movement. **Space Mono** is introduced for labels and technical metadata to reinforce the "instrumentation" feel. Use uppercase extensively for headers and labels to project authority and urgency.

## Layout & Spacing
The layout follows a **Fixed-Grid HUD** philosophy. Elements are locked into a strict 8px square grid, creating a sense of rigid, military-grade organization.

- **Desktop:** 12-column grid with 2px solid borders between major sections.
- **Mobile:** Single column with 16px horizontal margins.
- **Technical Textures:** Backgrounds should feature a subtle 32px repeating dot or line pattern in #1e1e1e to simulate a drafting board or digital display.
- **Spacing Rhythm:** Use multiples of 8px for all padding and margins to maintain mathematical consistency.

## Elevation & Depth
In this design system, depth is communicated through **Tonal Layering and Borders**, not shadows. 

Avoid drop shadows entirely. Instead, use "Step-Up" elevation:
1. **Level 0 (Base):** Deep Charcoal (#121212).
2. **Level 1 (Containers):** Deep Graphite (#1e1e1e) with a 2px solid border (#333333).
3. **Level 2 (Active/Interactable):** Electric Citron (#e2ff3b) for borders or high-contrast fills.

For a true HUD effect, use "Inset" styles for input fields to make them appear carved into the hardware.

## Shapes
The shape language is strictly **Sharp**. 0px border radii are applied to all buttons, containers, and input fields. This reinforces the industrial, gritty aesthetic and ensures that elements align perfectly with the technical grid. 

Small 45-degree "clipped corners" may be used on primary action buttons or high-level status badges to add a customized, engineered feel.

## Components
- **Buttons:** Primary buttons use a solid Electric Citron fill with black text. Secondary buttons use a transparent background with a 2px solid Deep Graphite border and white text. Hover states should "invert" or switch to a high-contrast state instantly (no easing).
- **Cards:** Defined by a 2px border (#333333) and a header bar in Deep Graphite. Content within cards must adhere to the 8px grid.
- **Data Readouts:** Large Oswald font numbers paired with small Space Mono labels. Use Electric Citron for "at-target" or "record-breaking" metrics.
- **Inputs:** Solid #1e1e1e background with a 2px bottom-border only. On focus, the border changes to Electric Citron.
- **Progress Bars:** Thick, rectangular bars. The background track is #2a2a2a, and the "fill" is Electric Citron, using a segmented "cell" style rather than a smooth gradient.
- **Telemetry Chips:** Small, rectangular badges with black text on Electric Citron or white text on Deep Graphite.