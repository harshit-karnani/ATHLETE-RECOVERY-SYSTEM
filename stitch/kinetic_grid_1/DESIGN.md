---
name: Kinetic Grid
colors:
  surface: '#131316'
  surface-dim: '#131316'
  surface-bright: '#39393c'
  surface-container-lowest: '#0e0e11'
  surface-container-low: '#1b1b1e'
  surface-container: '#1f1f22'
  surface-container-high: '#2a2a2d'
  surface-container-highest: '#353438'
  on-surface: '#e4e1e6'
  on-surface-variant: '#dbc1b2'
  inverse-surface: '#e4e1e6'
  inverse-on-surface: '#303033'
  outline: '#a38c7e'
  outline-variant: '#554337'
  surface-tint: '#ffb783'
  primary: '#ffb887'
  on-primary: '#4f2500'
  primary-container: '#fb923c'
  on-primary-container: '#673200'
  inverse-primary: '#944a00'
  secondary: '#b3d17a'
  on-secondary: '#243600'
  secondary-container: '#385005'
  on-secondary-container: '#a5c36d'
  tertiary: '#c7c8c8'
  on-tertiary: '#2f3131'
  tertiary-container: '#abacac'
  on-tertiary-container: '#3f4041'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcc5'
  primary-fixed-dim: '#ffb783'
  on-primary-fixed: '#301400'
  on-primary-fixed-variant: '#713700'
  secondary-fixed: '#ceee93'
  secondary-fixed-dim: '#b3d17a'
  on-secondary-fixed: '#131f00'
  on-secondary-fixed-variant: '#364e03'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131316'
  on-background: '#e4e1e6'
  surface-variant: '#353438'
typography:
  display-xl:
    fontFamily: Oswald
    fontSize: 72px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Oswald
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Oswald
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Oswald
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-technical:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1440px
---

## Brand & Style

This design system is engineered for the high-stakes environment of professional sports analytics and athletic performance tracking. It adopts a "Locker Room Luxury" aesthetic—combining the raw, gritty utility of professional training facilities with the precision of elite data science. 

The visual direction is grounded and aggressive, utilizing a "Brutalist-Lite" approach that favors structural integrity over decorative softness. It avoids all forms of translucency or organic blurs in favor of flat, high-contrast surfaces and tactical grain. The UI should evoke a sense of urgency, discipline, and uncompromising accuracy, positioning the user as a high-performance operator.

## Colors

The palette is optimized for low-light, high-focus environments. 

- **Base Layers:** The foundation uses `Deep Slate` (#0a0a0c) and `Charcoal` (#111114) to create a void-like depth that minimizes eye strain and allows data to pop.
- **Action & Visibility:** `Safety Orange` (#fb923c) serves as the primary action color, used for critical CTAs and active states. `Volt Green` (#d9f99d) is reserved for performance indicators, success states, and "go" signals.
- **Accents:** Use pure white (#ffffff) for primary text to maintain maximum legibility against the dark void. 
- **Texture:** Apply a subtle 3% monochromatic noise/grain overlay across all background surfaces to simulate the tactile feel of matte athletic equipment.

## Typography

Typography is a primary structural element in this design system. 

- **Headlines:** Use `Oswald`. Its condensed, vertical nature mimics collegiate sports branding and scoreboard displays. Headlines should always be uppercase to maintain an authoritative, commanding presence.
- **UI & Body:** `Hanken Grotesk` provides a sharp, contemporary sans-serif feel that ensures high readability for dense performance metrics and technical data.
- **Data & Mono:** `JetBrains Mono` is used for all numerical data, timestamps, and technical labels, reinforcing the "analytics platform" identity.

## Layout & Spacing

The layout follows a rigid **12-column fixed grid** on desktop and a **4-column grid** on mobile. 

- **Rhythm:** All spacing must be multiples of 4px. Use generous gutters (16px/24px) to prevent data-heavy layouts from feeling cluttered.
- **Dividers:** Use high-contrast 1px or 2px dividers (#27272a) to create clear zones of information. 
- **Alignment:** Elements should feel "locked" into the grid. Use hard-edged containers with no soft margins to reinforce the precision of the brand.

## Elevation & Depth

This design system rejects shadows in favor of **Tonal Layering** and **Heavy Outlines**.

- **Level 0 (Background):** Deep Slate (#0a0a0c) with grain texture.
- **Level 1 (Cards/Containers):** Charcoal (#111114) with a 2px solid border (#27272a).
- **Active State:** Elements in focus or active states receive a 2px solid border of Safety Orange (#fb923c).
- **Depth:** Depth is created through value contrast, not light source simulation. Higher-priority items use lighter charcoal shades or high-visibility borders to "push" forward.

## Shapes

The shape language is strictly **Sharp (0px)**. 

Every UI element—from buttons to cards to input fields—must have 90-degree corners. This evokes the industrial feel of weight racks, digital scoreboards, and tactical equipment. Angled accents (45-degree chamfers) can be used sparingly on decorative elements or "tab" indicators to add a dynamic, aggressive edge.

## Components

- **Buttons:** Primary buttons use a solid Safety Orange fill with Black text. Secondary buttons are "Ghost" style with a 2px White or Safety Orange border. All buttons are rectangular and uppercase.
- **Data Chips:** Small, rectangular tags with a background of #27272a and JetBrains Mono text. Use Volt Green text for positive growth and Safety Orange for critical alerts.
- **Input Fields:** Flat Charcoal backgrounds with a 2px bottom-border only in the default state. Upon focus, the border becomes a full 2px Safety Orange frame.
- **Cards:** No shadows. Use a 2px #27272a border. Card headers should use a contrasting background color (e.g., #1c1c21) to separate them from the card body.
- **Progress Bars:** Use a "Segmented" approach. Instead of a smooth fill, progress is shown via individual vertical blocks to emphasize incremental gains and precision.
- **Dividers:** Use heavy, high-visibility rules. Horizontal rules at 1px, but vertical section breaks can be 2px or 4px to create strong "zones."