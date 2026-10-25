# Shared surface recipes

Theme now owns one surface paint recipe. Surface and Button consume it through a
typed helper; the remaining components are queued for separate review.

## Theme composition

[Theme](../src/lib/theme/theme.svelte) composes four internal components:

- [Colors](../src/lib/theme/colors.svelte) owns palette inputs and light/dark tokens.
- [Surfaces](../src/lib/theme/surfaces.svelte) owns global paint classes and states.
- [Fonts](../src/lib/theme/fonts.svelte) owns Material Symbols declarations.
- [Styles](../src/lib/theme/styles.svelte) owns resets, body defaults, and scrollbars.

Theme retains its palette and children API and remains opt-in. The default-only
CLI Theme composes these same files; copied palette tokens remain editable locally.

## Typed helper

Import [surface](../src/lib/theme/surface.ts) from `bref-ui`; its
SurfaceBaseProps type is exported from `bref-ui/types`. Optional options are variant
(default neutral), color (default foreground), shadow, and hover. Variant and Color
reuse the existing unions; shadow and hover accept small, medium, or large.
Shadow also accepts true for medium and false for none. SurfaceProps extends
SurfaceBaseProps with layout, element, scrolling, and children props.

```svelte
<script>
	import { Theme, surface } from 'bref-ui';
</script>

<Theme />
<button class={surface({ variant: 'filled', color: 'primary', shadow: 'small', hover: 'medium' })}>
	Save
</button>
```

The helper returns composed classes such as `surface surface-filled surface-primary`.
It adds no markup or CSS automatically. Native elements keep their attributes,
events, bindings, and form behavior; element styles supply geometry and typography.
TypeScript validates helper options, while handwritten class strings remain unchecked.
CLI copies include `theme/surface.ts`; the copied UI barrel exports components only.

## Shared appearance and states

Neutral is transparent. Soft uses a 16% tint with 85% opacity and backdrop blur.
Filled uses solid tint and background-colored content, with foreground text for
background-tinted panels. Hover shading moves filled colors toward foreground.
Small, medium, and large shadows distinguish controls from elevated panels.

Hover is opt-in. Native hover, pressed, focus-visible, disabled, and aria-disabled
states share the recipe. Composite controls can signal state with
`data-surface-pressed`, `data-surface-focused`, `data-surface-invalid`, and
`data-surface-disabled`, each set to `true`. Invalid borders survive hover;
disabled surfaces receive no hover treatment. Reduced motion and forced colors are
handled in the same recipe.

Surface retains its layout API and uses color for the shared paint selection.
Its shadow accepts the shared sizes, with true mapping to medium; Button uses
small shadow and medium hover. Surface content color
now follows the recipe. Button neutral is transparent, and filled is fully opaque.

## Remaining migrations

| Components              | Proposed reuse                                   | Behavior retained                                                          |
| ----------------------- | ------------------------------------------------ | -------------------------------------------------------------------------- |
| Pill                    | Shared neutral, soft, and filled paint           | Sizing, deletion, content, and swoosh                                      |
| TextInput and TextArea  | Surface shells with focus and invalid treatments | Native controls, bindings, attributes, icons, and resizing                 |
| Checkbox and Switch     | Soft unchecked and filled checked paint          | Native semantics, check animation, and thumb movement                      |
| Dialog                  | Shared panel paint                               | Modal lifecycle, focus restoration, backdrop, transitions, and scrolling   |
| TreeView                | Shared selected-row and action-hover paint       | Selection, indentation, expansion, and row transitions                     |
| Progress and Spinner    | Shared paint values for specialized renderers    | Native progress pseudo-elements, seeking, gradients, masks, and animations |
| Popover and pill groups | Inherit shared paint through Surface and Pill    | Existing lifecycle, layout, selection, and form behavior                   |

Proceed one component at a time after human approval. Specialized renderers still
need an agreed mechanism to consume track and fill paint without duplicating formulas.

## Verification and review

Independent review and human visual approval remain pending.

- Check and lint pass; check reports zero errors and warnings. Build, registry
  validation, package generation, and publint pass.
- Chromium checks pass for matching helper/Button paint, keyboard activation,
  disabled hover and links, external links, icon naming, native attribute/style
  forwarding, form submission, Surface scrolling and nesting, palette updates,
  invalid/hover/pressed states, reduced motion, and forced colors.
- Production hydration, narrow gallery layout, and SSR without JavaScript pass.
- All 108 default color/variant pairs across light/dark and base/pressed states
  meet 4.5:1 text contrast. Custom palettes and arbitrary parent backgrounds still
  require validation; palette inputs are preserved.
- Tarball contents include helper declarations and every Theme child. Clean Svelte
  and SvelteKit consumers check and build through npm and CLI copies; invalid
  helper options are rejected by TypeScript. CLI preview, dependencies, type
  rewriting, repeated installation, cancellation, and overwrite approval pass.
