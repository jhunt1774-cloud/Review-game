MAP SMOOTHNESS UPDATE
Upload both game.js and forest-renderer.js to the root of Review-game, replacing those two files together. All existing audio and other assets stay in place. After GitHub Pages finishes publishing, refresh the game with Ctrl+F5.

Changes:
- Draw map actors on every animation frame so they stay synchronized with the scrolling terrain.
- Reuse the same camera and viewport snapshot for terrain and actors.
- Avoid rewriting unchanged map dimensions each frame.
- Preserve the current live controller, sound hooks, teacher testing, and walking boundaries.

Validation:
JavaScript syntax checks passed.
All ten navigation maps, closed/open gates, follower bridge travel, corner blocking and teleport reset passed.
Teacher testing, all ten areas, battle selection, party presets, healing, reset, continue, reports and save isolation passed in the simulated UI harness.
Renderer cadence regression passed for 60 consecutive 60Hz frame submissions, shared geometry and standalone redraw fallback.

This is a targeted fix based on the current live source. Actual frame-rate improvements and device-specific smoothness have not been measured in live gameplay. Please test continuous walking, turns, map edges, fullscreen and entering a dungeon after upload.

