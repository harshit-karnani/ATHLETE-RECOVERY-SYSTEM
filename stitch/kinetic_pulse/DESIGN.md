---
name: Vitality High-Performance
colors:
  surface: '#fff7ff'
  surface-dim: '#dfd8e0'
  surface-bright: '#fff7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f1fa'
  surface-container: '#f3ebf4'
  surface-container-high: '#ede6ee'
  surface-container-highest: '#e8e0e9'
  on-surface: '#1d1a20'
  on-surface-variant: '#4a4450'
  inverse-surface: '#332f35'
  inverse-on-surface: '#f6eef7'
  outline: '#7c7482'
  outline-variant: '#ccc3d2'
  surface-tint: '#704ba4'
  primary: '#401973'
  on-primary: '#ffffff'
  primary-container: '#58338b'
  on-primary-container: '#caa4ff'
  inverse-primary: '#d7baff'
  secondary: '#67587c'
  on-secondary: '#ffffff'
  secondary-container: '#e8d5ff'
  on-secondary-container: '#695a7e'
  tertiary: '#725c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c5a94e'
  on-tertiary-container: '#4d3e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#eddcff'
  primary-fixed-dim: '#d7baff'
  on-primary-fixed: '#290055'
  on-primary-fixed-variant: '#58338b'
  secondary-fixed: '#eddcff'
  secondary-fixed-dim: '#d2bfe8'
  on-secondary-fixed: '#221535'
  on-secondary-fixed-variant: '#4e4063'
  tertiary-fixed: '#ffe080'
  tertiary-fixed-dim: '#e2c466'
  on-tertiary-fixed: '#231b00'
  on-tertiary-fixed-variant: '#564500'
  background: '#fff7ff'
  on-background: '#1d1a20'
  surface-variant: '#e8e0e9'
  success-green: '#84CC16'
  activity-teal: '#00aea1'
  energy-orange: '#FF7E5F'
  energy-peach: '#FEB47B'
  surface-cream: '#FFFDF8'
typography:
  display-lg:
    fontFamily: Public Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Public Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
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
  label-lg:
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
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  gutter: 16px
  container-padding-mobile: 20px
  container-padding-desktop: 40px
---

## Brand & Style
Vitality is a premium health and wellness platform designed for high-performance athletes and fitness enthusiasts. The brand personality is optimistic, energetic, and authoritative yet encouraging.

The visual style is **Corporate / Modern** with a focus on high-clarity data visualization. It utilizes a clean, "High-Fidelity" aesthetic that balances structured layouts with soft, organic elements (like progress rings and gradients) to evoke a sense of human-centered technology. The interface prioritizes readability and actionable insights, using whitespace to reduce cognitive load while maintaining a sophisticated, data-rich feel.

## Colors
The palette is rooted in a deep, sophisticated purple (`primary`) that signals premium quality and focus. A secondary muted violet handles supportive UI elements, while a warm gold (`tertiary`) is used for specific recovery-related callouts and highlights.

The system uses a warm-white "cream" background (`#FFFDF8`) instead of pure white to reduce eye strain and provide a more "wellness" oriented feel. High-visibility accents like success-green and activity-teal are reserved for performance metrics and achievement states. Gradients (Orange-to-Peach) are used sparingly for primary actions to create a "glow" effect and drive conversion.

## Typography
The system relies exclusively on **Public Sans**, a neutral and accessible typeface that provides an institutional yet modern feel. 

Typography is used to establish a strong visual hierarchy:
- **Displays:** Extra-bold with negative letter spacing for high-impact metrics and greetings.
- **Headlines:** Semi-bold to Bold for section headers and card titles.
- **Labels:** Used for metadata and overlines. Small labels often utilize increased letter spacing and uppercase styling to denote categories.

## Layout & Spacing
The layout follows a **Fixed-width grid** model on desktop, maxing out at 1280px (7xl), and a fluid single-column model on mobile. 

- **Grid:** A 12-column grid is used for desktop layouts, facilitating a "Bento Box" arrangement where features span different column widths (e.g., 5-col for primary metrics, 7-col for secondary workouts).
- **Rhythm:** An 8px base unit drives all spacing. Stacked vertical sections use `stack-lg` (32px), while internal card elements use `stack-md` (16px) or `stack-sm` (8px).
- **Safe Areas:** Mobile views maintain a 20px side margin, while desktop scales up to 40px padding.

## Elevation & Depth
The system uses **Ambient Shadows** and **Tonal Layers** to create a sophisticated sense of hierarchy without excessive borders.

- **Surface Levels:** The primary background is the warm `surface-cream`. Cards and containers use pure `#FFFFFF` to stand out.
- **Shadows:** A signature `card-shadow` (4% opacity black with 20px blur) is applied to all container elements to lift them subtly.
- **Interactive Depth:** Hover states utilize an `interactive-shadow` that increases blur/spread and adds a -2px Y-axis translation to simulate physical lift.
- **Translucency:** Mobile navigation and overlays use an 80% background opacity with a backdrop-blur (blur-md) to maintain context.

## Shapes
The shape language is **Rounded**, conveying friendliness and high-end design.

- **Containers:** Large cards and sections use a 16px (1rem) corner radius.
- **Sub-elements:** Smaller internal blocks (like stat badges) use a 12px (0.75rem) radius.
- **Buttons & Pills:** Navigation pills and primary buttons use a `full` (9999px) roundedness to create a friendly, "squishy" tactile feel that encourages interaction.

## Components
- **Buttons:** Primary buttons are pill-shaped, featuring a bold gradient from Energy-Orange to Energy-Peach with a shadow. Text is white and bold.
- **Chips/Badges:** Used for category labels (e.g., "Today's Focus"). These use a low-opacity background of the primary color (10%) with high-contrast text.
- **Metric Rings:** Circular progress indicators use a stroke-based design with a `surface-container` background track and a `success-green` foreground stroke with rounded caps.
- **Stat Cards:** Nested containers within larger cards. They utilize a `surface-container-low` background to create a "well" effect for secondary data points.
- **Activity Cards:** Horizontal list items that include a 14x14 rounded-xl icon container. The icon container's background is a 10% tint of the icon's primary color.
- **Bottom Navigation:** A mobile-only persistent bar with high translucency, providing quick access via icon + label pairs. The active state is indicated by a pill-shaped container around the icon.