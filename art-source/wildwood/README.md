# Wildwood forest crossing

Open **Walk Wildwood.html** directly in a browser. Walk from the tent to the fork. The uphill branch ends at the Rootbound cave. The east branch crosses the stream on the timber bridge. “View original painting” shows the Forest river valley picture from Map Floor Studio. This standalone art study has no campaign save, combat, or dungeon transition.

**Wildwood.blend** contains the editable slopes, river, bridge planks, arch ribs, masonry piers, shared painted scenery, gameplay camera, and a separate movement-floor collection. The source painting is packed into the file as a reference image beside the scene. The tree and landmark cutouts are designed for the gameplay camera. Rotate the view to inspect the terrain and bridge geometry. Use F12 to render the player view. **Wildwood.webp** is the finished camera render.

## Rebuild the study

From the repository root, run the following with Blender 5.2 and a Python installation with Pillow. Supply the full Blender executable path if it is outside your command search path.

```text
blender --background --factory-startup --python-exit-code 1 --python tools/blender/wildwood.py -- --out work/wildwood-blender
python tools/blender/package_preview.py work/wildwood-blender
```

Blender writes a packed scene and three aligned images from one orthographic camera. The color render supplies the background. The floor image records open ground, obstacles and the bridge deck. The foreground image records the projected foot of each painted object so a traveler can pass behind it. Packaging compresses the color render, checks landmark connectivity, verifies that cutting the deck closes access to the east bank, and embeds all browser assets in one offline HTML file. The browser draws one animated traveler over the baked scene and idles when movement stops.

For the next area, identify its original painting and the route's two landings or endpoints first. Place the forks, slopes, waterways and encounter clearings in world coordinates before dressing them. Render all three images after any change to the camera or terrain, and check movement through the normal player view. Campaign integration still requires aligning quest triggers, gate state, dungeon entrances and saved positions to that area's floor.

## Art sources

The reference is the existing project asset `assets/geography-forest.webp`. Its SHA-256 matches the Forest river valley image embedded in the supplied Map Floor Studio file. Painted trees, camp, cave, runestone, rocks, ground textures and Lira's walking frames are reused from the game's asset library. The terrain, bridge geometry and scene arrangement were created for this study. No external models or textures were added.
