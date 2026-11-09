# Painted map and traversal audit — November 9, 2026

Continues the existing game on `codex/map-traversal-alignment-20261109`, based on f321866. No map assets were regenerated or replaced. The active ten paintings were compared with the 300×200 navigation masks, actual destination anchors, gate states and return connections.

## Findings and fixes

- All ordinary destinations already had physical routes. The larger problems were raster-edge catches during keyboard movement, invisible ground limits, small disconnected mask specks, outdated foreground image patches and story/connection metadata left over from earlier maps.
- **Clear paths** is now the default map view. It lightly separates usable ground from scenery and outlines the actual navigation boundary. Sealed ground uses a warmer edge. **Settings → Map ground → Original painting** removes the guide. This view uses the same navigation mask as movement; it does not invent roads or widen floors over water/cliffs. Its one-map 300×200 overlay is cached rather than recomputed each frame.
- Keyboard movement can make a small, collision-checked adjustment along an angled edge. A raster corner may need a short sideways step before continuing forward; that step is allowed only when a safe forward continuation exists within one grid cell. The original continuous collision, diagonal-corner and gate checks still apply. This is local assistance, not automatic pathfinding while holding a direction.
- On the Amber Hollow stair probe, the same held north input previously stopped after **0.15** map units; it now advances **over 15**, with every movement step checked against the real floor. Deliberate turns and walls still require a direction change or click-to-walk.
- Tiny unreachable floor specks are discarded from the active navigation grid. Old off-path saves still use the existing nearest-reachable-ground recovery. Secret and boss areas remain governed by their original progression flags.
- Nearby clicks at an edge can select connected ground within 1.6 map units. Remote water/scenery clicks remain rejected. The destination marker now shows where the route actually ends, rather than the original off-ground click. Failure messages distinguish unusable scenery from a disconnected route.
- Foreground occlusion now copies the **current cached terrain**, including its repairs and ground guide, and matches the terrain's dimmed/restored lighting filter. It no longer pastes differently colored fragments from an older painting over the current map. No extra full-sized image cache is introduced.
- Entrance markers receive small ground-level threshold cues. Destination-route metadata and integrated entrance positions are synchronized to current authored anchors. The Frostpeak entrance is the northwestern cave mouth, not the outdated middle-terrace checkpoint.
- The forest route/preparation panel can be collapsed while walking. Existing controls, keyboard interaction, optional rewards and saved progress remain available.

## Story follows the paintings

The forest still visibly has a flowing river. Its short story no longer claims that the river has stopped or that the Guardian is beyond the east end of the bridge. Mossgate and camp are on the west bank; Whispering Hollow is a circular western landing; the short-quest sentinel guards the west bridge approach; the Guardian is in the northwestern grove above the Moonwell stairs. The former “canopy shortcut” is labelled **Moonwell stair shortcut**, matching its real destination at the northern stair approach. Existing save keys and shortcut behavior are retained.

Full-campaign narration also follows the current outdoor paintings: the Frostpeak summit is a northern court, the Rune Library is northwest, the southern Asterfall relay is a court rather than a raised causeway, Tideglass is a shore landing rather than an invisible cave, and the Drowned Lantern is reached across the western coastal causeway. Highland directions distinguish the great upper chasm bridge from the final northwestern forge approach. Combat rules, rewards and encounter IDs are unchanged.

| Connection | Surface landmark | Side-area exit |
| --- | --- | --- |
| Rootbound Sanctuary | West-bank trail north of the forest bridge | Southern sanctuary arch |
| Amber Hollow | Southeastern forest terrace beyond the bridge | Southeastern stairs |
| Lost Expedition Works | Northwestern Frostpeak cave mouth by the upper waterfall | Northwestern mine passage |
| Clockwork Conservatory | Western Asterfall garden path | Southwest glasshouse entrance |
| Lantern Haven | Eastern coastal passage beyond the upper landing | Southeastern harbor passage |

## Verification

`node tools/map-traversal-smoke.cjs` audits **10 maps, 114 visible destination routes and 12 sealed destinations**. It checks continuous route steps, no seal bypass, disconnected-speck cleanup, canonical entrance positions, safe keyboard assistance, edge-click targeting, blocked deep water, overlay caching, map-view settings and small-screen bounds. It also uses the real contextual controls to enter and leave all five side areas, walking from each arrival to its exit and verifying a safe return position.

`node tools/map-survey.cjs` produces labelled collision-over-painting survey images and JSON under the checkout's parent work directory. It is a diagnostic tool, not part of the published game. The all-map regression is included in classroom CI and runs against the packaged `/Review-game/` site.

The nine forest suites cover the complete quest, questions/imports, choices, saves, camp, tactics, keyboard controls, layouts and visual lifecycle. The original-campaign suite covers imports, backup recovery and Mossgate/Guardian victories. Screenshots are reviewed at desktop and 768×600 sizes. Physical school Chromebook performance, school browser policies and a timed student playthrough remain unverified. The paintings retain perspective ambiguity; the new guide and click-to-walk option help, but this is not a claim that every decorative stair or roof has become traversable.
