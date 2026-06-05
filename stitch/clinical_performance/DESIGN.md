---
name: Clinical Performance
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002114'
  on-tertiary-container: '#069669'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Public Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Public Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Public Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max-width: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system is built for a high-performance intersection of medical precision and athletic excellence. The brand personality is authoritative yet empathetic—moving away from the sterile coldness of traditional clinics toward a high-fidelity "human performance lab" aesthetic. 

The visual style utilizes a **Modern Corporate** foundation blended with **Minimalism**. It prioritizes extreme clarity, utilizing heavy whitespace to reduce cognitive load during data-heavy sessions. The emotional response should be one of quiet confidence; the UI does not shout, but rather provides a calm, stable environment for users to monitor critical health metrics and performance gains. High-fidelity finishes, such as subtle micro-interactions and refined typography, differentiate this from standard fitness trackers, positioning it as a premium health instrument.

## Colors

The palette is anchored by **Deep Navy (#0F172A)**, providing a sense of depth and established trust. This is the primary color for typography and structural elements. **Teal (#0D9488)** and **Emerald (#059669)** serve as performance accents, used to highlight active states, progress, and achievement metrics.

The background architecture relies on **Subtle Gray (#F8FAFC)** to define boundaries without the harshness of pure white, though White (#FFFFFF) is reserved for primary card surfaces to create a clear "layering" effect. Risk accents follow standard medical conventions—Success Green, Warning Amber, and Critical Red—but are refined with sufficient saturation to remain legible against both white and navy backgrounds.

## Typography

The design system utilizes **Public Sans** for its institutional clarity and neutral tone. It is a typeface designed for legibility at small sizes, making it ideal for the dense data visualizations and medical tables required by the platform.

Headlines use semi-bold and bold weights with tight letter-spacing to create a "locked-in," professional look. Body text maintains a generous line height (1.5x) to ensure health reports and performance summaries remain accessible. For mobile, display sizes are scaled down to prevent awkward line breaks while maintaining a clear information hierarchy.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop (12 columns) and a **Fluid Grid** on mobile (4 columns). The rhythm is strictly 8px-based to ensure mathematical harmony across all components.

Spaciousness is a functional requirement here; metrics must have room to breathe to avoid visual clutter. On mobile devices, side margins are kept at 16px to maximize screen real estate for charts, while desktop views use wider 40px margins to evoke a premium, editorial feel. Content is organized into logical stacks, where related data points are grouped with 8px or 16px gaps, and distinct sections are separated by 32px or more.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers** and **Ambient Shadows**. The base canvas is the Subtle Gray surface. Primary content lives on white "Elevated Cards."

Depth is not achieved through heavy shadows, but through very soft, diffused, low-opacity blurs (e.g., 10% opacity Navy). This mimics the look of high-end physical medical devices. When a user interacts with a card or opens a modal, the elevation increases slightly via a secondary, larger shadow, while the background may undergo a subtle dimming to focus attention. Outlines are avoided in favor of subtle background color shifts to maintain a modern, "limitless" aesthetic.

## Shapes

The shape language is defined by **Soft Surfaces**. While the system-wide base roundedness is 8px (Level 2), primary containers and dashboard cards utilize a larger **24px radius** (`rounded-xl` / `rounded-2xl` equivalents) to create an approachable, friendly silhouette that softens the clinical nature of the data.

Smaller elements like input fields, buttons, and status tags follow the standard 8px radius to maintain a sense of precision. This contrast between large, pillowy containers and sharp, precise internal elements reinforces the "Clinical yet Warm" brand narrative.

## Components

### Buttons
Primary buttons use the Deep Navy background with White text for maximum authority. Secondary buttons use a Teal ghost style or subtle gray fill. Transitions should be smooth (200ms) with a slight scale-down on press to feel "tactile."

### Cards
Cards are the heart of the design system. They must be White (#FFFFFF) with a 24px corner radius and a subtle 1px border (#E2E8F0) or soft ambient shadow. Cards should have a consistent internal padding of 24px.

### Data Visualization
Charts should use Teal and Emerald for positive trends and Navy for baseline data. Lines should be slightly rounded (2px stroke width) and use soft area gradients (fills) below the line to create depth.

### Inputs & Fields
Text fields use the Subtle Gray background with a 1px Navy border that appears only on focus. Labels should always be visible (never placeholder-only) to meet medical accessibility standards.

### Chips & Badges
Status chips use high-contrast combinations: light tinted backgrounds with dark text (e.g., Light Red background with Critical Red text) for instant scannability of health risks.