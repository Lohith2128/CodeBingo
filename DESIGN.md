# Design Brief

## Overview
Production-grade multi-language code editor IDE. Deep navy/charcoal base with electric cyan accents. Glassmorphism panels, zero decoration, industrial aesthetic for developers.

## Tone & Direction
Industrial/utilitarian with precision neon accent. Brutalist UI (no skeuomorphism), monospace typography hierarchy, dark-first design language. Emphasizes clarity, focus, and zero visual distraction during code editing.

## Color Palette

| Token              | OKLCH Values  | Usage                                |
|--------------------|---------------|--------------------------------------|
| Background         | 0.13 0 0      | Deep navy page background            |
| Foreground         | 0.93 0 0      | Primary text, code content           |
| Card               | 0.16 0 0      | Editor and panel backgrounds         |
| Primary (Accent)   | 0.65 0.2 200  | Active states, buttons, highlights   |
| Secondary          | 0.24 0 0      | Elevated surfaces, sidebar           |
| Muted              | 0.24 0 0      | Disabled states, secondary text      |
| Destructive        | 0.62 0.21 22  | Errors, warnings in output console   |
| Success            | 0.70 0.15 100 | Successful execution indicator       |
| Border             | 0.26 0 0      | Subtle panel borders                 |

## Typography

| Role      | Font             | Weight | Size  | Leading |
|-----------|------------------|--------|-------|---------|
| Display   | Space Grotesk    | 500    | 20px  | 1.2    |
| UI Text   | Space Grotesk    | 400    | 14px  | 1.5    |
| Code      | JetBrains Mono   | 400    | 13px  | 1.6    |
| Mono UI   | JetBrains Mono   | 400    | 12px  | 1.5    |

## Structural Zones

| Zone          | Treatment                                      | Rationale                       |
|---------------|------------------------------------------------|---------------------------------|
| Sidebar       | `bg-sidebar` + `border-r` cyan/20 opacity      | Fixed 220px, language list      |
| Editor        | `bg-card` + `border` subtle                    | Center focus, Monaco editor     |
| Output Panel  | `glass-panel` effect, monospace console        | Right 30%, dark terminal style  |
| Buttons       | `bg-accent` + hover `glass-hover` shadow       | Cyan highlight, smooth hover    |
| Toolbar       | `bg-secondary/80` + `backdrop-blur-sm`         | Glass effect above editor       |

## Spacing & Rhythm
Tight grid: 4px base unit. 16px (4 × 4) for section padding, 8px for component gaps, 12px for panel internal spacing. Consistent vertical rhythm in console output.

## Component Patterns
- **Language selector**: List with hover states, active item highlighted in accent cyan. No pills/badges; clean text with left border indicator.
- **Buttons**: Flat background, no shadow by default. On hover: `glass-hover` shadow + slight opacity increase.
- **Output console**: Monospace, dark background, scrollable. Error lines in red destructive color, success in teal.
- **Code block**: Line numbers on left edge, syntax highlighting per language. Hard edge (radius 0) for code areas.

## Motion & Animation
**Smooth 0.3s cubic-bezier(0.4, 0, 0.2, 1)** for all state changes:
- Panel fade-in on load
- Language switch slide-in from left
- Button hover: opacity + soft glass shadow
- Console output fade-in per line
- No bounces, no delays. Execution indicator: pulse-glow for 2s during code run.

## Differentiation
Glassmorphism precision: translucent surfaces with pinpoint borders (cyan/20 opacity), never blurred chaos. Monospace hierarchy for both code and UI labels (Space Grotesk for UI, JetBrains Mono for code). Zero tutorials or learning UI.

## Signature Detail
Cyan accent at L 0.65 with H 200° — electric, cutting through deep navy. Appears only on active states, button hovers, and focus rings. Sparingly applied, never as background. Glass panels with cyan border blur create a "cut-glass" effect distinct from soft neumorphism.

## Constraints
- No rounded corners on code blocks (radius 0). Soft 12px radius only on UI panels and buttons.
- Backdrop blur (sm on toolbar, md on modals) is max effect; no full-page blur overlays.
- Icons monochromatic, matching text color. Accent cyan only on action triggers (Run button, active language).
- Output console: fixed-width monospace, no text wrapping; horizontal scroll on overflow.

