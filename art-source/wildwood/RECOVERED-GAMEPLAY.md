# Gameplay recovered for Wildwood

The history review covered the changed-file lists for all 187 commits reachable from the 30 GitHub branches and the painted-map backup tag on November 20, 2026. Earlier uploads often share the same commit title, so the review followed file history and original item IDs. The stabilization branch outside the current development ancestry changes documentation and the classroom workflow. The main loss of gameplay between the campaign and Wildwood came from the shorter forest quest exposing only a small set of destinations.

| Historical feature | Where it belongs in the valley |
| --- | --- |
| Four illustrated class relics in [the October 17 version](https://github.com/jhunt1774-cloud/Review-game/blob/c3de5b4/loot.js) | Clear Mossgate to search the arch for the Runebreaker sigil. Clear the sentinel to recover the Aegis stone at its landing. Rescue Rowan or light the ridge beacon to locate the Starfall feather at the ranger watch. After choosing either forest blessing, find the Moonwell tear at the well. All four use their original artwork, item IDs, rewards and combat actions. |
| The optional [Amber Hollow expedition](https://github.com/jhunt1774-cloud/Review-game/blob/cfe6554/side-adventures.js) | Finish pressing the orchard apples. The press keeper opens the road into the painted hollow. Its shelter, guarded cache, secret room and keeper award the Apiarist axe, Ranger’s amber bow, Honeycomb guard coat and Amberdrop charm respectively. The mechanism controls access to the inner vault. |
| The [supply wagon encounter](https://github.com/jhunt1774-cloud/Review-game/blob/1ec1d05/encounter-objectives.js) | Inside Amber Hollow, keep the wagon intact for three enemy turns or defeat the Roadstalker. Choosing **Brace the wagon** spends an action to repair and protect it. The crew awards the Wagonkeeper’s charm. Reading time does not advance the encounter. |
| The [restored caravan post](https://github.com/jhunt1774-cloud/Review-game/blob/d334385/world-consequences.js) | Saving the wagon brings the historical painted caravan to the west orchard. The crew holds two healing potions for the party. The painting stays after the first delivery. |
| The [ranger’s trail of clues](https://github.com/jhunt1774-cloud/Review-game/blob/d73d348/forest-discoveries.js) | **Field notes** carry this idea into the valley. They describe what to look for at each landmark. Meeting a condition adds a destination to the walking menu. The earlier four-stop Heartwood Den hunt remains in the full campaign. |

Rowan's rescue uses a seated figure painted from the existing Rowan illustration and the forest reference. A single root catches the ranger's boot. Saving Rowan clears that footprint, moves Rowan to camp and reveals the buried quiver. The nearby lookout satchel opens independently.

## Applying the same approach to later levels

These are design candidates for the other painted maps. Their historical encounters and props already exist in the campaign.

| Level | Player decision | Change the player should see afterwards |
| --- | --- | --- |
| Frostpeak | Let the lost expedition journal identify a supply route and an injured climbing party. Spend supplies to help on the ascent or risk the mine first. | Reuse the expedition station and field medic so the return climb offers a recovery stop. |
| Clockwork Conservatory | Reuse the three-relay encounter. Players can exploit the rotating weakness and spend the next action restoring a relay, or keep attacking the custodian. | Light each repaired branch of the garden and open a maintenance route behind the last relay. |
| Lantern Haven | Reuse the tide encounter. Securing two crates costs an action, so the party must choose when to salvage and when to defend. | Return the cargo to the quartermaster and reuse the historical ferry to connect previously cleared landings. |

For each level, identify a landmark the player can already recognize, a choice that changes play there, and evidence of that choice on the return journey. Test the alternate outcome, the old-save entry point, and leaving and coming back. The Wildwood browser check is in `tools/wildwood-history-smoke.cjs`.
