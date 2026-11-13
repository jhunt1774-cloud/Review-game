# Atlas-guided world replacement

Status: audit and asset production begun; existing maps remain playable. This document is a scope record, not a completion claim.

## Shared requirements
Build independent terrain, scenery and collision geometry. Match battle-scene lighting, palette and brushwork; use the overall world atlas to keep regional geography coherent. Large open ground with multiple routes, optional roaming enemies, readable pursuit and escape. Preserve teacher content, correct-answer attacks, incorrect-answer damage, progression and separate backups. No backend.

## Region inventory
- Forest Path / Emerald Road: southwestern woodland, river terraces, pale ruined stone, camp and Guardian heart. Side areas: Rootbound Crypt and Amber Hollow.
- Frostpeak Pass: northern mountain ascent, snowy ridges, spring, watchtower, summit. Side area: Lost Expedition Works / Frostmine.
- Asterfall Beacon: central fortified city, library, fountain, vault and Beacon causeway. Side area: Clockwork Conservatory.
- Coast: southeastern cliffs, harbor, shipwrecks and lighthouse. Side area: Lantern Haven.
- Ashen Highlands: northeastern golden volcanic uplands, obsidian watch, quarry, foundry and Sunforge.

## Production gates
1. Inspect each existing map and associated battle scene; record entrances and return destinations before relocating anything.
2. Produce matching reusable terrain and object kits; inspect transparency, scale and silhouettes.
3. Assemble representative playable sections and inspect in-game views against references.
4. Expand each region with connected open exploration, collision footprints and optional patrol routes sampled from reachable ground.
5. Verify exits, quests, saves, teacher lessons, elusion and combat on the packaged Pages path.

## Asset generation
Built-in image generation. First asset: forest ruined courtyard surround, style reference assets/battle-forest-ruins-hd.webp. Elevated orthographic view, pale weathered limestone, ivy, flowers, moss and ferns, open center and two entrances, true transparent background. Source and optimized files to be recorded after inspection. No 3D meshes have been produced yet.

## First playable landmark
Forest courtyard generated with the built-in image tool from battle-forest-ruins-hd.webp; source assets/forest-courtyard-v2.png, optimized assets/forest-courtyard-v2.webp. Alpha checked: center fully transparent, approximately 58% fully clear pixels. Placed in the eastern Wildwood ruin with independent wall footprints and open entrances. All existing quest/cache route probes pass; no browser runtime errors. This is an initial integration, not completion of the world conversion. Courtyard camera framing and full collision traversal still require refinement.

## Recovered bridge integration
The bridge geometry is sourced from C:/AI Workspace/lowpolly forest.blend. A separate headless Blender process renders the plank, post and railing objects using a new procedural weathered timber material; the source blend is never saved or modified. The game consumes assets/recovered-timber-bridge.png. This uses an actual recovered mesh through a lightweight pre-rendered asset, not runtime 3D. The low-poly scene trees were visually reviewed and rejected as a poor match for the requested battle art. Unreal-only packs are not yet exported or integrated. Physical Chromebook verification remains outstanding.
