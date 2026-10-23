# Forest Path / Web Wizardry — Suno soundtrack and combined audio upload

Seven music tracks are ready for review in music-preview.html. This package also retains the fourteen generated sound effects, twenty-four physical Foley recordings and exploration hooks from the previous combined audio update. It is an incremental game update, not a standalone game.

## Soundtrack

| Scene | Track |
| --- | --- |
| Forest / title | Woodland Trail (existing user track) |
| Mountains | Frostpeak Ascent |
| Asterfall city | Asterfall Remembered |
| Rootbound Crypt | Roots Beneath the Stone |
| Coast | Tides of the Sunken Coast |
| Regular battle | Steel and Resolve |
| Chapter boss | Oath Against the Darkness |

Six new v6 requests created two candidates each. The first candidate of each theme is included for review. Woodland Trail was already present and was reused. Alternatives remain in the Suno account. The tracks were requested as instrumentals with the lyrics editor empty; no imitation of named artists or soundtracks was requested.

## Install

If you already installed Forest-Path-Combined-Audio.zip: upload ONLY music-data.js, recorded-audio.js and assets/music-suno/ from this package to your repository root, replacing matching files. Your existing game.js, sound-data.js and effect files already contain the preceding update.

If you have not installed that earlier package: also upload game.js, sound-data.js and the rest of this package's assets folder. Retain your existing other game files. game.js is the prior six-edit audio-hook version based on the local ASTERFALL-PRODUCT-CONTENT build; game-audio-changes.json lists those edits. If your deployed game.js is newer, merge those edits into it instead of overwriting newer gameplay.

After GitHub Pages finishes publishing, hard-refresh (Ctrl+Shift+R) and enable Sound. If scripts stay cached, update the existing music-data.js and recorded-audio.js query values in your current index.html to ?v=suno-20261023. If you also install the prior gameplay hooks, similarly refresh the game.js and sound-data.js query values. This package does not replace index.html, campaign.js, save data, assignments, or your site links.

## Integration and optimization

Tracks live in assets/music-suno/ with content-hash URLs in music-data.js. Old music assets can stay in the repository; they are no longer referenced by this music map. The sole music-routing code change sends dungeon exploration to crypt instead of city. Battle/boss priority, scene crossfades, music/effects controls, hidden-tab silence and the prior two-buffer music cache remain in the existing engine.

Seven game loops total 16,951,412 bytes (about 16.2 MiB). Each is stereo 32 kHz / 128 kbps MP3, with leading/trailing silence trimmed, a one-second equal-gain end-to-start crossfade rotated into the loop, and -19 LUFS / -2 dBTP normalization targets. Their duration, exact cuts, source links and hashes are in music-inventory.json. Loop editing reduces transition gaps; a subjective musical-loop listening review has not been completed. Tracks load on demand after sound is enabled, rather than all at page load. Device memory/performance has not been measured.

Suno downloads are kept unchanged in the task's working files; this deliverable contains the processed game versions. All seven were obtained using the official Suno Unlock & Download action while the user account showed Pro. The Suno music and generated effects are not CC0. AUDIO-CREDITS.txt describes earlier CC0 assets; its old music listings are historical and do not describe these replacement Suno tracks. SUNO-CREDITS.md records current usage and provenance.

## Validation

Passed: all seven encoded tracks decode to finite non-silent samples with decoded mono peaks below full scale; JavaScript syntax; all seven real music scene routes; boss priority; no same-track restart; all seven music files and all 38 effect assets resolve locally; gameplay matches the prior combined audio package and only the dungeon music selector changed in recorded-audio.js.

Live end-to-end gameplay, listening through a complete campaign and the latest deployed GitHub revision remain unverified. Use music-preview.html to review the loops and effects-preview.html for the existing generated effects before publishing.
