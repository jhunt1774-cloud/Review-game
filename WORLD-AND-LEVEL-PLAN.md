# Asterfall world and level plan

One connected country supports one journey: restore its light, reopen its roads, then use the Sunforge to rebuild its villages.

The master map locates all ten existing zones. Its roads and region boundaries are the reference for future level design. The current game still loads individual local maps; this update connects them with deliberate entrances and short transitions rather than replacing them with one enormous collision map.

## Story route

| Region | Purpose | Required route | What carries the journey forward |
| --- | --- | --- | --- |
| Forest Path | Recover the Emerald Heart | Mossgate → Whispering Hollow → Rootbound Sanctuary → Ancient Crossing → Amber Hollow → Forest Guardian | The Keeper’s oath protects the party; restored forest water sustains the Heart. The Heart lights the mountain climb. |
| Frostpeak Pass | Win the Storm Key | Frostpeak Ascent → Icefang Hollow → Expedition Works → Broken Watchtower → Storm Summit | Restart the prism works, defeat the Colossus and escort the expedition home. The drake’s key opens Asterfall. |
| Asterfall Beacon | Restore the First Flame | Asterfall Gate → Rune Library → Clockwork Conservatory → Beacon Causeway → Nightroot | Recover the city’s knowledge and living machinery. Restoring the Beacon reveals the coastal road. |
| Sunken Coast | Restore the lantern road | Wreckshore → Tideglass Cavern → Lantern Haven → Lantern Cliffs → Drowned Lantern | Restart the tide clock and defeat the Tidewarden. The restored lantern guides the highland supply road. |
| Ashen Highlands | Rebuild the country | Cinder Meadow → Obsidian Watch → Broken Bell → Sleeping Sunforge | Recover the forge key, ring the warning bell and awaken the Sovereign’s forge. |

## Design each level from the country

- Preserve the neighboring landscape at every entrance: forest switchbacks lead into mountain foothills; the pass descends toward city gates; city terraces descend to coastal roads; the shore road climbs into the highlands.
- Give each level one arrival, one clear story task and one onward connection. Place optional treasure and contracts on branches.
- Show the destination before asking the player to enter it. Keep gateways visible and use E to cross.
- Put the onward road beside the cleared regional finale. Victory returns to that trail; the player continues through the road marker.
- Explain the immediate task in one short line. The world map holds the larger goal and each destination’s purpose.
- Keep main story fights in order. Optional battles, equipment, contracts and exploration may be completed freely and cannot seal regional gates.
- Use the same progression flags for the compass, local objective text, world atlas and travel availability.

## Exploration on all ten replacement maps

- Build each area with room for several optional destinations, connecting paths, and at least one loop or shortcut where the terrain supports it. Give each branch a reason to visit, such as a landmark, a clue, a useful item, or an encounter.
- Include several optional quests and spread discoverable items across the map. Mix choices, puzzles, rescues, and changes to the environment with trail finds, supplies, gear, and relics. Use River Valley's tailrace satchel as one example of an action that changes what players can find.
- Put clues in scenery, dialogue, and field notes. Let curious players discover rewards by following the clue or noticing the landmark. Keep optional quests and items available after the story objective wherever the area's state allows it.
- Use the paintings as art and layout references. Build terrain, landmarks, and foreground props as separate Blender assets and derive walking and collision from the modeled floor before exporting to the browser.
- Play the main route and its optional branches before calling a map ready. Check that paths are readable, discoveries open at the right time, and quest outcomes and one-time rewards survive save and resume.

## Local encounter beats

Each region contains its four existing main encounters. Each is a level-development unit: approach, visible landmark, encounter, consequence, onward path. Required destination maps expand the middle of the region rather than appearing as unrelated bonus boards.

Rootbound: Three Lights → Keeper → return with oath.
Amber Hollow: apiary sluice → Amberwood Keeper → return to the forest route.
Expedition Works: brace the passage → free miners → prism lock → Colossus → escort home.
Clockwork: dormant engine → Glasswarden → return to the Beacon route.
Lantern Haven: tide clock → Tidewarden → return to the coastal road.

Supplies, support stations, hidden memorials, extra guardians and elite fights remain optional.

## Map coordinates and expansion

WORLD-LAYOUT.json records ten named zone locations, approximate development bounds, nine connecting roads and the ordered campaign. Coordinates are percentages of the atlas painting, not local movement coordinates. The bounds are planning areas, not exact cuts of the individual paintings.

The atlas is the geographical reference for new maps. Existing maps retain their tested walk surfaces, entrances, equipment and saved discoveries. Future redesigns can now use consistent horizon direction, neighboring terrain, approach roads and narrative handoffs.

Implementation is in journey-guide.js. Change its arc, purposes, positions and roads together with this plan when expanding the campaign.

## What is finished

The map is installed as an interactive World map screen. It shows the current zone, next story stop, restored places and places ahead. A small gold arrow follows reachable local path segments, with a diamond at the story target. The arrow updates after milestones and guides the expedition escort to the exit.

Using E at a destination crosses directly with a short transition. Completing a regional finale returns to its trail; E at the onward road enters the next region. Earlier progress and out-of-order completed encounters retain credit.

This is a connected campaign foundation. The existing levels have not all been repainted or physically stitched into one continuously streamed world.

