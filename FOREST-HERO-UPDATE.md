# Forest hero identity and portrait update

The four existing heroes now have painted dialogue portraits consistent with their sprite identities. The forest quest uses illustrated role buttons instead of the role dropdown, with clear descriptions of each hero's existing contribution. All four heroes still travel together; selection chooses the named hero and map leader.

Switching roles updates an untouched default name, while preserving a name the player has typed. The existing identity confirmation, roster, appearance selector, camp restrictions and save format remain authoritative. Older saves can still adopt an identity at camp. Alternate companions are not assigned the original hero's face.

Chosen-hero profiles show a brief personality and role description. Arrival scenes include speaker portraits and optional short exchanges under Around the party. Dialogue uses current names, including player names. In short-story mode the speaker portrait appears on the optional conversation header; full-story mode uses the existing speaker line. Combat action menus show the current hero's portrait without adding a new menu or modifying damage, skills, rewards or enemy behavior. The original campaign keeps its existing picker and presentation.

## Assets

| File in assets/ | Size | Dimensions |
| --- | ---: | --- |
| forest-hero-thorin.webp | 29,726 bytes | 320 x 320 |
| forest-hero-brom.webp | 23,098 bytes | 320 x 320 |
| forest-hero-lira.webp | 23,888 bytes | 320 x 320 |
| forest-hero-seren.webp | 31,958 bytes | 320 x 320 |

Total new raster payload: 108,670 bytes. Images have fixed layout dimensions and use the same local assets in selection, story and combat. No image animation, extra render loop, external font, account or backend was added.

## Validation

Static/import/syntax checks and relative-path Pages package; browser checks for illustrated selection, default and custom names, confirmation and reload, map leader, named dialogue, combat portrait, camp restrictions, alternate companion handling, original campaign isolation and 768 x 600 selection/menu layout. The full forest quest and existing visual and supporting-character regressions passed. Original campaign startup, combat, imports and progress recovery also passed.

Physical Chromebook performance and student session timing remain unverified. Feature branches do not deploy the production site automatically.

## Artwork method and exact prompts

Built-in image generation used each existing painted-trial sprite sheet as the character/costume reference. Chrome encoded 320px WebP copies for production; generated originals remain preserved.

### thorin

Reference: assets/hero-thorin-painted-trial.webp

Create one production dialogue portrait for an illustrated woodland fantasy RPG aimed at middle-school players. Thorin, an adult dwarf vanguard with long swept-back chestnut brown hair, braided chestnut beard, strong brows, sturdy nose, chain mail and weathered brown leather shoulder straps. Resolute but compassionate, not angry. Small edge of a plain axe haft behind one shoulder. Use the attached sprite sheet only as a character-identity and costume reference. Translate the character into mature natural facial proportions, NOT chibi, no enlarged cute eyes. Chest-up three-quarter portrait, centered, face readable at 64 pixels, rich hand-painted fantasy storybook textures with soft forest rim light, dark emerald woodland vignette backdrop. Match a painterly woodland ranger portrait series. One character only, square framing, no text, no UI, no border, no action pose, no sprite sheet.

### brom

Reference: assets/hero-brom-painted-trial.webp

Create one production dialogue portrait for an illustrated woodland fantasy RPG aimed at middle-school players. Brom, an older dwarf defender with swept-back silver-gray hair, a full silver-gray beard, strong brows, weathered face, rounded steel shoulder plates and a deep blue tunic. Patient, steady and quietly reassuring. Small edge of a plain hammer haft behind one shoulder. Use the attached sprite sheet only as a character-identity and costume reference. Translate the character into mature natural facial proportions, NOT chibi, no enlarged cute eyes. Chest-up three-quarter portrait, centered, face readable at 64 pixels, rich hand-painted fantasy storybook textures with soft forest rim light, dark emerald woodland vignette backdrop. Match a painterly woodland ranger portrait series. One character only, square framing, no text, no UI, no border, no action pose, no sprite sheet.

### lira

Reference: assets/hero-lira-painted-trial.webp

Create one production dialogue portrait for an illustrated woodland fantasy RPG aimed at middle-school players. Lira, an adult elf ranger with long chestnut brown hair in loose practical braids, pointed ears, brown leather ranger coat with light fur trim and a green leaf clasp. Perceptive, resourceful and quietly determined. Quiver tips visible behind a shoulder. Use the attached sprite sheet only as a character-identity and costume reference. Translate the character into mature natural facial proportions, NOT chibi, no enlarged cute eyes. Chest-up three-quarter portrait, centered, face readable at 64 pixels, rich hand-painted fantasy storybook textures with soft forest rim light, dark emerald woodland vignette backdrop. Match a painterly woodland ranger portrait series. One character only, square framing, no text, no UI, no border, no action pose, no sprite sheet.

### seren

Reference: assets/hero-seren-painted-trial.webp

Create one production dialogue portrait for an illustrated woodland fantasy RPG aimed at middle-school players. Seren, an adult elf mage and healer with long white-silver hair in two practical braids, pointed ears, blue traveling robes with pale trim and a green leaf clasp. Thoughtful, calm and courageous. A subtle cyan staff light at the edge, not covering the face. Use the attached sprite sheet only as a character-identity and costume reference. Translate the character into mature natural facial proportions, NOT chibi, no enlarged cute eyes. Chest-up three-quarter portrait, centered, face readable at 64 pixels, rich hand-painted fantasy storybook textures with soft forest rim light, dark emerald woodland vignette backdrop. Match a painterly woodland ranger portrait series. One character only, square framing, no text, no UI, no border, no action pose, no sprite sheet.
