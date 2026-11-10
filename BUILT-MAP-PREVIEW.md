# Built forest preview

Open `map-prototype.html` on the same static host as the game. It redirects to
`index.html?map=modular`. The ordinary entry remains the existing painted game.

The preview reuses the four-encounter forest quest, party, combat, equipment,
question banks, and teacher question selection. Its save slot is
`web-wizardry-built-map-v1`, separate from `web-wizardry-forest-v1` and the full
campaign. Progress-file import/export accepts the new slot. The preview header
links back to the original game.

Terrain is assembled from existing grass, path and water textures. Separate
painted trees and rocks have explicit footprints baked into the navigation grid.
Canopies draw in actor depth order and fade when they conceal the party. River
geometry controls both its visible banks and its collision cells. The bridge
uses the existing sentinel progression lock. Rescuing the ranger removes the
nearby root obstruction from both rendering and collision. The small location
map uses the new terrain, and story directions describe the new crossing.

This is a first forest layout, not a replacement for all ten existing boards.
Movable boulders, additional region layouts, bespoke edge/decor assets, and
student timing/physical Chromebook testing remain future work. There is no new
backend or account-save service.

## Preserved version

Before the experiment, commit `6998346f735314981347ea596ee41a0fbe5200a1`
was preserved on GitHub under branch `backup/painted-maps-20261110` and annotated
tag `backup-painted-maps-20261110`. Neither ref should be moved. The working
feature branch is `codex/built-map-prototype-20261110`.

## Verification

- `node tools/audit-checks.cjs`
- `node tools/build-pages.cjs`
- `node tools/browser-smoke.cjs`
- `node tools/forest-fast-play-smoke.cjs`
- `node tools/built-map-smoke.cjs`

The prototype browser test verifies save isolation/reload, every destination,
water and object collision, closed/open bridge routes, ranger root removal,
patrol presence, a 768px viewport, and actual walking/combat through all four
encounters. It also runs against the packaged `/Review-game/` Pages path in CI.
