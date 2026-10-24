ASTERFALL MAP REPAIR — October 24, 2026

UPLOAD
Upload index.html, authored-floors.js, navigation-floors.js and integrated-map-art.js into the root of Review-game, replacing those four files together.
Upload assets/asterfall-coherent-city.webp into the existing assets folder.
Wait for GitHub Pages to publish, then refresh with Ctrl+F5.
Asterfall-preview.png, ART-PROMPT.txt and this README are for your review; uploading them is optional.

WHAT CHANGED
Rebuilt Asterfall as a grounded city: connected streets, a sunken cistern, individual roofed buildings, and two raised courtyards with clear stair approaches.
Resurveyed the walking ground and interaction positions to match the replacement artwork. The pool, roof and central garden are blocked; destinations connect along the streets.
Retained all three optional patrols and their caches, the locked beacon precinct, and the conservatory entrance/return connection.
Hidden finds draw from the existing prop artwork rather than pasting pieces of the obsolete city over the new map.
Existing destination IDs, rewards and saved completion flags are retained. Old walking positions can snap to a nearby new street.
The other nine maps' physical floor records are unchanged.
Game controller, audio files and the prior smoothness fix are not replaced by this map-only update.

VERIFIED
JavaScript syntax.
All ten maps: navigation, closed/open boss routes, follower travel, diagonal corner blocking and teleport reset.
Teacher testing: all areas, battles, presets, heal/reset/continue/reports, normal/teacher/assignment save isolation.
Asterfall: three active patrols and searchable caches; every pre-gate destination reachable; beacon still locked; water/roof/garden collision; safe nearby relocation from an old position; conservatory return anchor.
Native canvas: real pickup prop rendering and distance fade; old wall patches omitted.
Artwork and walking overlay inspected as images. Live browser/device playtesting remains to be done after upload.

ART
Created with the built-in image-generation tool, then converted to browser-compatible WebP. The final prompt is saved in ART-PROMPT.txt. A first candidate was rejected because it retained confusing stacked terraces.
