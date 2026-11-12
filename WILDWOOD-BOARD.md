# Wildwood open-board preview

Entry: `wildwood.html` → `index.html?map=wildwood`.
The normal entry and the earlier modular preview remain separate. The original
painted game is preserved by branch `backup/painted-maps-20261110` and tag
`backup-painted-maps-20261110`. Wildwood uses `web-wizardry-wildwood-v1` for
local progress, including progress-file export and restore.

## Playable board

- A 6,000 × 4,000 camera space, with a 300 × 200 navigation grid.
- Open grass, authored woodland groves, clearings, two lakes, a winding river,
  two timber crossings, a waterfall, camp, watermill, watchtowers and ruins.
- The four existing forest quest encounters and their equipment/teacher-question
  systems remain intact. The bridge sentinel unlocks both crossings.
- Two additional optional patrols use the existing detection, pursuit, retreat,
  escape-grace, quiz-combat and saved-victory systems. The next required imp or
  wolf also patrols its clearing. Defeating the Guardian restores peace.
- Six optional caches award supplies once. Missed caches remain collectible
  after the main quest. The ranger rescue physically removes a root obstruction.
- WASD/arrows, click-to-walk and minimap-ground navigation work across open
  grass. Dirt trails are visual suggestions, not assigned walking paths.
- Trees, rocks, roots and building foundations have physical footprints. The
  renderer and collision builder use the same object descriptors. Canopies
  fade when they cover the party.

`wildwood-layout.js` owns placements and grove clusters. `wildwood-board.js`
owns terrain, footprints, scenery, interactions and the opt-in integration.
No full-map painting is used as the walkable-world authority. Existing images
are used as terrain textures or independently placed objects.

The terrain cache is 3,072 × 2,048. Offscreen objects are culled, source images
are shared, and the illustrated minimap is cached as a small WebP. The first
performance review caught an expensive full-board blurred-shadow pass; that
pass was removed before release. The three new optimized assets total about
596 KB. No backend, account save service, external fonts or runtime library
was added.

## Artwork

Created with the built-in image-generation tool, using the existing camp and
ancient tree as style references. The source images remain preserved; the game
consumes optimized WebP copies with alpha transparency.

| Asset | Saved game file | Use |
| --- | --- | --- |
| Woodland watermill | `assets/wildwood-watermill.webp` | Riverbank building and cache landmark |
| Willow tree | `assets/wildwood-willow.webp` | Lakeside tree variation |
| Mossy waterfall | `assets/wildwood-waterfall.webp` | Riverhead landmark |

Reused assets include the oak, pine, camp, Mossgate, Moonwell,
ancient tree, hollow, watchtower, shelter, stone library, walls, chest states,
runestone, ferns, rocks and terrain textures.

### Final generation prompts

**Watermill**

Create ONE production-ready standalone 2D RPG environment sprite: a beautiful small woodland watermill and ranger lodge, built from warm weathered timber and mossy stone, curved shingle roof, a large wooden waterwheel attached on the right side, small front porch with a clearly visible open doorway facing the bottom of the image, ivy, a lantern, two modest supply crates. Use the attached images ONLY as style references: lush detailed hand-painted fantasy illustration, organic warm woodland materials, mature middle-school RPG feel. Match their camera: orthographic elevated three-quarter top-down view around 45 degrees, front faces down, sunlight from upper left, no perspective horizon. One coherent building, not a scene or background map. Crisp readable silhouette with a small soft contact shadow under the footprint. True transparent background everywhere outside the object; no ground tile, no white fringe, no grass strip along an image edge, no text, no UI, no border, no people. Entire roof and wheel fully visible with ample transparent padding. High quality reusable asset.

**Willow**

Create one isolated reusable 2D RPG sprite of a mature woodland willow tree. Use attached tree ONLY as an art-style reference. Rich detailed hand-painted fantasy illustration, natural elegant branching trunk, lush broad blue-green and warm green drooping canopy, moss and a few exposed roots, sunlight upper left, elevated orthographic three-quarter top-down RPG camera around 45 degrees. Mature fantasy, not cartoon/chibi, not pixel art. Entire tree and its foliage must fit comfortably inside the frame with transparent padding on all sides. Broad asymmetric canopy with visible layered leaf clumps, graceful silhouette different from an oak or pine. True transparent PNG background, no colored or dark backdrop, no vignette, no landscape, no grass tile or rectangular ground patch, no text, no border, no people, only a small soft contact shadow under the roots. This is one game object to be placed independently on terrain, not a complete scene.

**Waterfall**

Generate one reusable isolated woodland waterfall and mossy cliff object for a high quality 2D RPG. The attached image is ONLY a style reference for detailed lush hand-painted fantasy brushwork and materials, not a tree to copy. Elevated orthographic three-quarter top-down camera 45 degrees, same scale and lighting as a fantasy RPG environment sprite. Subject: short broad irregular rocky cliff ledge overgrown with ferns and moss, clear turquoise water spilling over its center in TWO narrow natural cascades, foam and stones at the foot, small shallow irregular catch basin at the front designed to visually join a separate river below. Compact readable structure; no enormous mountain, no full landscape. The cliff rock blocks walking, the water is visibly separate, plants are attached to the ledge. Warm sunlight upper left with cool blue shadows. Entire object comfortably inside frame, generous transparent margin, actual transparent background. No backdrop, no colored matte, no vignette, no frame, no text, no people, no buildings. This must be a standalone game asset, not a map painting.

## Verification and limits

`tools/wildwood-smoke.cjs` checks free-grass keyboard movement, minimap navigation,
solid-object and water collision, sealed crossings, all destinations, real cache
searches and one-time rewards, reload, moving patrols, optional combat and valid
saves, wrong-answer player damage, all four quest fights, restored peace,
a teacher-reviewed custom question set in actual quest combat, original-save
isolation, and 768 × 600 layout. CI runs it against the packaged
`/Review-game/` Pages path after the existing regression suites.

Buildings currently have exterior interactions and solid foundations; interiors
and animated waterwheel machinery are not part of this first board. The new
waterfall sprite is static. Physical Chromebook performance and student timing
still need classroom testing. This is one new board, not a conversion of all
existing campaign regions.
