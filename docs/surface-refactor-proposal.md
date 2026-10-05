# Surface refactor proposal

Centralize surface appearance in Surface so one recipe controls backgrounds,
borders, highlights, blur, shadows, glow, and visual states across components.
Components retain native behavior, content, geometry, and specialized animations.
This proposal records source findings and decisions required before implementation.

## Current differences

- [Surface](../src/lib/surface/surface.svelte) uses a transparent neutral variant,
  6% tint for soft, and 11% tint for opaque filled panels. Text color inherits.
- [Button](../src/lib/button/button.svelte) and
  [Pill](../src/lib/pill/pill.svelte) use 3% neutral, 16% soft, and 88% filled tint,
  with an additional 85% opacity mix. Filled also changes content color, border,
  and highlight. Their small shadows differ from Surface's panel shadow.
- [Checkbox](../src/lib/checkbox/checkbox.svelte) and
  [Switch](../src/lib/switch/switch.svelte) use 4% light and 16% dark tint when
  unchecked, switching to 88% primary tint when checked.
- [TextInput](../src/lib/text-input/text-input.svelte) and
  [TextArea](../src/lib/text-area/text-area.svelte) duplicate light/dark recipes,
  focus rings, invalid borders, and disabled styling. Neither exposes filled.
- [SurfaceProps](../src/lib/surface/types.ts) only supports div, section, and span.
  Native attributes, events, and custom styling are intentionally excluded by the
  current [gallery contract](../src/routes/surface/+page.svelte).

## Proposed ownership

Surface owns paint recipes and their visual state changes. Consumers determine
whether a control is checked, pressed, focused, invalid, or disabled and preserve
the native element, bindings, events, form behavior, and keyboard interactions.
Avoid disabled hover effects and duplicate focus rings.

Separate surface paint from optional layout so components can retain their own
padding, dimensions, alignment, and radius without overriding paint recipes.
Keep recipe values private; agree any necessary public controls before adding them.

## Component migration

| Components                    | Proposed reuse                                                      | Behavior retained                                                                            |
| ----------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Button and Pill               | Surface roots for neutral, soft, and filled paint                   | Button/link semantics, sizing, content, deletion, and Pill swoosh                            |
| TextInput and TextArea        | Surface shells with focus and invalid treatments                    | Native controls, bindings, attributes, icons, and resizing                                   |
| Checkbox and Switch           | Soft unchecked and filled checked surfaces                          | Native checkbox semantics, check animation, and thumb movement                               |
| Dialog                        | Surface panel replacing its handmade background, border, and shadow | Modal lifecycle, focus restoration, backdrop, transitions, and content scrolling             |
| TreeView                      | Shared selected-row and action-hover paint                          | Selection, indentation, expansion, focus geometry, and row transitions                       |
| Progress and Spinner          | Shared paint values for tracks, fills, and highlights               | Native progress pseudo-elements, seeking, indeterminate animation, and spinner gradient/mask |
| Popover                       | Already composes Surface; verify revised appearance                 | Native popover lifecycle, anchoring, scrolling, and transitions                              |
| PillGroup and PillChoiceGroup | Receive shared recipes through Pill                                 | Group layout, selection, form reset, and keyboard behavior                                   |

Progress pseudo-elements and Spinner gradients cannot simply become child Surface
components. Agree a way to consume paint values from the same authoritative recipe
without copying formulas or replacing native progress semantics.

## Decisions before implementation

1. Define neutral, soft, and filled consistently. A strong filled treatment near the
   existing 88% tint is proposed; decide opacity and content color together.
   Background-tinted Dialog and Popover panels must remain opaque and readable.
   Validate contrast in both modes; the existing mixes do not prove accessibility.
2. Decide whether Surface can render button and anchor roots with correctly typed
   native attribute/event forwarding. Preserve disabled links and form submission.
   This changes the current deliberately limited Surface contract.
3. Agree how consumers supply geometry, attachments, and transition integration.
   Svelte component boundaries prevent existing scoped root styles and native
   action/transition directives from transferring unchanged to Surface components.
4. Define shared hover, pressed, focus, invalid, and disabled paint, including focus
   originating from child controls. Retain forced-color and reduced-motion behavior.
5. Agree distinct control and panel shadow strengths in the same recipe. Surface's
   current boolean shadow cannot preserve both existing levels by itself.
6. Decide how specialized renderers consume the shared paint values. Preserve one
   source for those formulas and include any required files in the CLI registry.

## Review sequence and verification

The [component screenshots](surface-refactor-screenshots/) record the current light
theme appearance. Each crop shows all available variants, or representative states
when no variant prop exists. These are baselines for review, not a proposed redesign.

First agree the Surface contract and review its recipe matrix in light and dark
themes. Migrate Pill as the first consumer, then proceed one component at a time
with human approval between steps. Update registry dependencies when components
begin importing Surface, keeping the dependency graph acyclic.

For implementation, run applicable checks, lint, and build/packaging verification.
Review rendered variants and meaningful interaction states, native forms and
bindings, keyboard/focus behavior, SSR/hydration, contrast, forced colors, and
reduced motion. Distribution changes also require tarball inspection and clean
npm/CLI Svelte and SvelteKit consumers.

This documentation change has no runtime or visual changes. Independent code and
rendered review remain required for implementation; static checks cannot grant
visual approval.
