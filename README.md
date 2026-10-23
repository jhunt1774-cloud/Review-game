# Restore Teacher Playtest and current map walking

This repairs a regression from the earlier audio ZIP: it included an older October 18 game.js. The live repository still loads teacher-playtest.js, but that old controller has no GamePlaytest interface. It also lacks the current map movement, save and story integration. The restored game.js starts from the latest October 23 owner build and adds only the six sound hooks, with an optional footstep call so a stale audio script cannot break walking.

## Upload this correction

1. Extract Teacher-Testing-Restore.zip.
2. Upload ALL SIX files inside to the existing Review-game repository root and replace matching files: index.html, game.js, teacher-playtest.js, music-data.js, sound-data.js and recorded-audio.js.
3. Keep your current assets folders, map files, question banks and cloud files. This small patch relies on the sound/music assets already included in the prior soundtrack ZIP.
4. Wait for GitHub Pages to publish, then reload the game. The included index.html is copied from the current live repository, retaining its script order and teacher/cloud modules; it updates only five script version values to fetch the corrected controller and current audio maps.
5. Open Teacher mode, enter your existing teacher code, and select Open Teacher Playtest. Test an area in Map inspection mode first. Your normal adventure, assigned quests and playtest use their separate save slots again.

No local saves were cleared or edited, and no remote files were published by this task. A corrected complete soundtrack ZIP is also available if you have not installed the audio assets yet. Do not re-upload an older downloaded copy of the previous ZIP: its old game.js caused this mismatch.

## Evidence and checks

Confirmed against the live public repository: game.js contains the prior audio hook but no window.GamePlaytest; teacher-playtest.js still expects GamePlaytest. The live index references the newest owner controller hash, but the actual controller contents were replaced by the old audio file.

Checks passed using the existing game test harness with the corrected controller substituted into the latest owner build:

- Teacher-code gate; all ten world/dungeon areas; gate/puzzle toggles; every listed battle; party presets; healing; reset; continue; bug report; exit; separate normal/teacher/assignment saves.
- All ten map navigation masks; closed/open boss routes; followers across bridges; blocked diagonal corners; teleport-trail reset.
- JavaScript syntax for controller and teacher module.

These are automated simulated-DOM/navigation checks, not live browser or physical Chromebook testing. The public site has not yet been changed. If an area still walks incorrectly after this patch is uploaded, identify the area and location so that remaining ground issue can be checked against the current map.
