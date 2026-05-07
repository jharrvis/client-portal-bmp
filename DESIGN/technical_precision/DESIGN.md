---
name: Technical Precision
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fd'
  surface-container: '#ededf8'
  surface-container-high: '#e7e7f2'
  surface-container-highest: '#e1e2ec'
  on-surface: '#191b23'
  on-surface-variant: '#434654'
  inverse-surface: '#2e3038'
  inverse-on-surface: '#f0f0fb'
  outline: '#737685'
  outline-variant: '#c3c6d6'
  surface-tint: '#0c56d0'
  primary: '#003d9b'
  on-primary: '#ffffff'
  primary-container: '#0052cc'
  on-primary-container: '#c4d2ff'
  inverse-primary: '#b2c5ff'
  secondary: '#006c47'
  on-secondary: '#ffffff'
  secondary-container: '#82f9be'
  on-secondary-container: '#00734c'
  tertiary: '#851800'
  on-tertiary: '#ffffff'
  tertiary-container: '#b02300'
  on-tertiary-container: '#ffc6b9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001848'
  on-primary-fixed-variant: '#0040a2'
  secondary-fixed: '#82f9be'
  secondary-fixed-dim: '#65dca4'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005235'
  tertiary-fixed: '#ffdad2'
  tertiary-fixed-dim: '#ffb4a3'
  on-tertiary-fixed: '#3d0600'
  on-tertiary-fixed-variant: '#8b1a00'
  background: '#faf8ff'
  on-background: '#191b23'
  surface-variant: '#e1e2ec'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-data:
    fontFamily: monospace
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-margin: 16px
  gutter: 12px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style
The brand personality is authoritative, reliable, and hyper-functional. Designed for technical users and network administrators, the interface prioritizes clarity of data and speed of interaction over decorative elements. The emotional response should be one of "total control" and "instant insight."

The design style is **Corporate / Modern** with a strong emphasis on **Minimalism**. It utilizes a "Utility-First" visual language: high-contrast ratios for readability, structured information density for technical metrics, and a clean, flat aesthetic that removes all non-essential visual noise. As a mobile PWA, the style leverages touch-friendly interaction patterns while maintaining the sophisticated feel of a professional desktop monitoring tool.

## Colors
The palette is rooted in industry-standard functional colors to ensure instant recognition of system status.

*   **Primary (Corporate Blue):** Used for navigation, primary actions, and brand identification.
*   **Success (Green):** Specifically reserved for "Uptime," "Connected" states, and healthy throughput metrics.
*   **Error (Red):** Used exclusively for critical alerts, outages, and billing failures.
*   **Warning (Orange):** Indicates latency spikes, nearing data caps, or scheduled maintenance.
*   **Neutral Grays:** A sophisticated range of Cool Grays is used to create UI layering without relying on heavy shadows. Backgrounds use a very light tint to reduce eye strain during long monitoring sessions.

## Typography
**Inter** is utilized for its exceptional legibility and systematic feel. The type scale is optimized for high information density.

*   **Data Hierarchy:** Numeric data (IP addresses, bandwidth speeds, usage stats) should utilize a slightly tighter tracking or a monospace fallback for tabular alignment.
*   **Case Usage:** Sentence case is preferred for all headings and body text to maintain a professional tone. All-caps is reserved strictly for small labels and table headers to provide structural contrast.
*   **Weight:** Use Medium (500) and Semi-bold (600) to highlight critical status updates within body text.

## Layout & Spacing
The design system employs a **fluid grid** optimized for mobile-first PWA delivery. 

*   **Grid:** A 12-column system is used for desktop, collapsing to a single column on mobile. 
*   **Rhythm:** A 4px baseline grid ensures vertical consistency. 
*   **PWA Considerations:** Large touch targets are prioritized, with a minimum height of 48px for all interactive elements. Content margins are kept tight (16px) to maximize the screen real estate for technical charts and data tables.

## Elevation & Depth
This design system avoids heavy shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**.

*   **Level 0 (Background):** Neutral base gray (#F4F5F7).
*   **Level 1 (Cards/Surface):** Pure white with a 1px border (#DFE1E6). This creates a "flat-stack" appearance.
*   **Interaction:** On hover or active state, elements utilize a subtle 4px blur shadow or a primary color border-glow to indicate focus.
*   **Depth:** Depth is primarily communicated through color-blocking rather than physical shadows, maintaining a clean, technical aesthetic.

## Shapes
A **Soft (0.25rem)** roundedness is applied across the system. This provides a modern, professional feel that is less aggressive than sharp corners but avoids the "consumer-grade" playfulness of fully rounded pill shapes.

*   **Components:** Buttons, input fields, and small cards use the base 0.25rem radius.
*   **Containers:** Larger dashboard sections or modal overlays may use a larger 0.5rem (rounded-lg) radius to create a soft visual containment.

## Components
*   **Buttons:** Primary buttons are solid Corporate Blue with white text. Secondary buttons use a transparent background with a 1px border. Icon-only buttons are used for utility actions in data rows.
*   **Status Chips:** Small, high-contrast badges with background tints (e.g., Light Green background with Dark Green text) to indicate "Online," "Offline," or "Pending."
*   **Technical Data Tables:** High-density rows with alternating subtle gray backgrounds. Must support horizontal scrolling on mobile.
*   **Input Fields:** Clear, labeled containers with a 1px border that turns Corporate Blue on focus. Error states trigger a Red border and a small helper icon.
*   **Usage Graphs:** Simplified line charts using the Primary color for data and Neutral grays for axes, optimized for touch-scrubbing.
*   **Navigation:** A persistent bottom navigation bar for the PWA, utilizing icons with clear text labels for "Dashboard," "Network," "Billing," and "Support."