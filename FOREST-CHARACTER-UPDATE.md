# Forest character and visual update

## What changed

Rowan, the trail ranger, now has an original painted portrait and transparent map sprite. Rowan appears bound at the existing rescue location and stands near camp after rescue. Discovery dialogue explains the root trap; camp dialogue changes after the sentinel and after restoration. Guardian arrival and the existing rootfire intervention now show Rowan's identity. The ending thanks the party only if the ranger was rescued.

Ilyth, Keeper of the Moonwell, now has an original painted portrait, discovery dialogue and an echo at camp when the player chooses the spirit blessing. The Guardian briefing and ending acknowledge that choice. A restrained static glow shows party shielding while the blessing is present; an outline marks the blessed runestone. Supplies and spirit protection remain mutually exclusive.

Portrait cards appear in existing dialogs and optional camp details. No extra required conversations, party slots, questions, save fields or combat powers were added. Existing game rules own rewards and intervention timing. The full campaign keeps its original scenes.

## Assets and performance

- assets/forest-rowan-portrait.webp: 384 x 384, 25,224 bytes
- assets/forest-ilyth-portrait.webp: 384 x 384, 54,016 bytes
- assets/forest-rowan-map.webp: 171 x 256, 11,254 bytes; alpha retained

Total new raster payload: 90,494 bytes. The map sprite reuses the existing renderer image cache. Portrait images have fixed dimensions. Added effects use static outlines and shadows, with no animation loops or network services. Assets are bundled in the relative-path Pages package.

## Validation

Static/import and syntax checks; Pages packaging; browser checks for discovery portraits and cancel behavior, rescue and exclusive boon flags, camp dialogue, Guardian arrival/support, ending, save validation and original campaign isolation; 768 x 600 dialog bounds; existing actual combat payoff and full-motion/reduced-motion/light-mode visual suites. A complete forest quest run also checks the integrated route and four encounters.

Physical Chromebook performance and a timed student playthrough remain unverified. Production is unchanged until the feature branch is merged.

## Artwork prompts and method

Generated using the built-in image tool. Final assets were encoded as small WebP files using Chrome; originals remain preserved outside the repository.

Rowan portrait prompt: A polished illustrated fantasy RPG dialogue portrait for an existing middle-school adventure set in a mossy forest. One adult human trail ranger, practical and quietly confident, warm brown skin, short dark curls with a silver streak, weathered moss-green hood resting down, leather shoulder armor, bronze compass clasp, subtle scratches from escaping roots. Chest-up three-quarter portrait, centered and readable at 96px. Hand-painted storybook game art with rich earthy colors and cool forest rim light, mature natural facial proportions. Subtle dark emerald woodland vignette. No text, border, UI or weapons. Square production portrait.

Ilyth portrait prompt: A single polished illustrated fantasy RPG portrait of an ancient Moonwell spirit. Chest-up centered three-quarter view. An ageless androgynous face sculpted from pale blue-green living stone and moonlit water, quiet silver eyes, branching willow crown, translucent leaf-shaped cloak, gold mineral fissures and a moon-shaped brow marking. Calm, watchful and dignified, never cute or childlike. Hand-painted fantasy storybook art, mature natural proportions, cool teal and silver palette, restrained amber details, dark emerald woodland and moonwell vignette. Readable at 96px. No text, border, UI, extra characters or weapons. Square production portrait.

Rowan map sprite prompt: Use the Rowan portrait as character design reference. Generate one full-body NPC with the same face and outfit, relaxed but alert with a simple walking staff and both boots visible. Three-quarter view facing slightly right, subtly viewed from above. Painterly fantasy RPG art simplified to remain readable at 60px tall; mature proportions, not chibi. Transparent background, no scenery, no background shadow, border or text; one centered character with a small transparent margin.
