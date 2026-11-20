# Wildwood river valley

The playable chapter starts at `index.html?map=wildwood&terrain=valley` on the game server. Choose **Enter the river valley**. Use the small map to pick your next encounter, or use **Walk to a place** to explore. Use the nearby interaction button or E to search a cache or enter Rootbound Sanctuary. **Walk Wildwood.html** is the offline art comparison. When served alongside the game, it also links to the adventure.

## Route and rewards

The main trail runs from the ranger camp through Mossgate and Whispering Hollow to the sentinel on the west landing. The bridge is the only crossing. Once the sentinel falls, the player can climb to the Guardian or follow the river downstream.

| Place | Why the trail goes there | Player payoff |
| --- | --- | --- |
| Camp and Mossgate | The camp sits inside the old western gate. Its supply trail leads toward the apiary. | Rest, manage equipment and fight the first quest encounter. |
| Apiary and flower meadow | Forage grows near the beekeeper’s shelter. The meadow is a short detour off its supply path. | The apiary cache holds the Beekeeper’s smock. The meadow has a separate supply find. |
| Moonwell and sanctuary | A wet hollow leads to the well. At the signed fork a climbing path ends at a marked cave mouth. | Choose the existing spirit blessing or camp supplies, and enter the existing Rootbound dungeon. |
| Watch and river gauge | Rangers can see the upstream channel from the watch. A survey path descends to the flood gauge. | Free the ranger, search the watch cache and find the survey supplies upriver. |
| Cargo hoist | A braced jib reaches out from the lower west bank. The overlook cache sits at its loading point. | Search the dockside supplies before challenging the sentinel. |
| East bank | The waterwheel faces the channel. The road splits between the mill, the ruined courtyard and the ancient tree. | Find the Millwright’s mallet and East warden’s seal, or continue to the Guardian. |

The expanded valley is 4,560 × 3,040 world pixels. The original crossing occupies the center of the map. The camera, paths and terrain cover twice the former width and height. Three new cart roads and switchbacks loop back to established places.

| Optional route | What to do | Reward |
| --- | --- | --- |
| Western orchard road | Gather the windfalls beside the orchard bins. Carry the basket to the screw press and make cider. | Two healing potions and 10 gold. |
| Downstream timber road | Pick up a cut board from the sawbuck. Bring it to the mill’s tailrace gate. The repaired shutter opens and the outlet flows again. | 45 gold. |
| Eastern ridge switchback | Recover a polished lens from the quarry. At the beacon, read the engraving and aim the light toward its receiver. | Three forge runes and a lit beacon. |

Open **Valley errands** on the small map for clues and delivery status. Select destinations under **Walk to a place**. The western loop opens at the start. The two eastern loops open with the sentinel’s bridge. Each errand can be finished after the Guardian, and each reward is paid once.

Older valley saves keep the same slot. The first load centers saved outdoor positions within the new map, including camp and dungeon return points. Dungeon interior coordinates use their original map.

All seven cache IDs use the existing once-only reward and save systems. Equipment uses the regular inventory and camp equipment rules. The valley has its own progress slot. The teacher's question set, forest quest sequence and dungeon rules come from the existing game.

## Blender source

**Wildwood.blend** contains the editable slopes, river, bridge, fixtures, shared painted scenery, gameplay camera and movement floor. The waypost, survey gauge and rope-and-drum cargo hoist are modeled geometry in collection **03b**. The wheelhouse, apiary, cave, lookout and trees reuse the game's painted cutouts. The painting beside the scene is the Forest river valley image from Map Floor Studio. Its SHA-256 matches `assets/geography-forest.webp`.

From the repository root, use Blender 5.2 and Python with Pillow. Render into a work directory before replacing the reviewed source or preview files.

```text
blender --background --factory-startup --python-exit-code 1 --python tools/blender/wildwood.py -- --out work/wildwood-play
python tools/blender/export_game.py work/wildwood-play
python tools/blender/package_preview.py work/wildwood-play
```

The first command saves a packed scene, color render, walk mask, foreground-depth image and projected landmark coordinates. The game exporter samples the floor at the engine's native 300 × 200 resolution, splits the two banks at the deck, verifies that the sentinel can gate the crossing and exports foreground layers for character occlusion. The second Python command builds the offline art comparison. Copy the reviewed scene, WebP and HTML from the work directory into this folder.

For another map, first identify the main quest route, a sightline to its next destination and a purpose for each optional branch. Give a new prop a player-facing use before modeling it. Author approaches on walkable ground and export color, depth, floor and interaction coordinates from the same camera. Check the route with the gate closed and open, then collect the rewards, enter the side quest and reload the save in the real game.
