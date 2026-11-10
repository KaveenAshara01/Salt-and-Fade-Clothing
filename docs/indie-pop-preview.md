# Indie-pop styling experiment

The existing luxury layout, imagery and logo are preserved. The experiment is scoped to `html[data-style='indie-pop']` in `frontend/src/indie-pop.css`.

To return to the previous appearance, change `INDIE_POP_ENABLED` to `false` in `frontend/src/theme.js`. Set it to `true` to enable the experiment again. Vite reloads automatically during development; rebuild for production.

The treatment adds acid-yellow and pink accents, lavender editorial panels, heavier italic campaign type, pill-shaped filters and CTAs, and a decorative poolside asterisk. Existing animation and reduced-motion settings are preserved. No product information or API behavior changes.

## Warm vintage palette revision

The supplied old-versus-new references steer this treatment toward warm, saturated vintage colour rather than pastel/neon indie-pop: cherry #b93234, teal #086d68, marigold #f4c344, orange #ec7028, blue #1666a5, violet #45335f, and ivory #fffaf0. Layout, photographs, original logo geometry/colours, and animation behavior are unchanged. The earlier experiment's CSS is retained in `docs/design-checkpoints/indie-pop-pastel.css`.
