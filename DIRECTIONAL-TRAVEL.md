# Directional party and bridge correction

All four heroes have new four-direction exploration walking sheets: north, south, east, west. Battle poses remain the established combat sheets. Exploration uses a single-file formation sampled along the leader's walked trail, so followers trace bends rather than cutting across them. Sprite feet are anchored using each frame's alpha bounds.

Road collision boundaries are tightened. The Forest Path crossing uses the painted bridge deck coordinates and a narrower crossing corridor. Old off-road saved positions fall back to the last landmark.

The complete package includes prior open exploration, boss passages, scrolling forest camera, Sunken Coast, readable questions, and the optional Chromebook visual trial. New required assets: thorin-walk-directions.webp, brom-walk-directions.webp, lira-walk-directions.webp and seren-walk-directions.webp. New script: party-trail.js.

Upload ALL contents to the repository root, replacing matching files. Wait for Pages publishing to succeed. Test normal exploration by turning with WASD/arrows; the ?visualtest=1 encounter is a battle-effects measurement and does not demonstrate map walking.

Verification: frame sheets visually inspected, follower turn geometry and all four directions checked, bridge crossing route and narrowed boundary tested, normal encounter and entire campaign progression tested with simulated UI/storage. Live sprite alignment and road collision need checking on actual classroom devices.
