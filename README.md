# Forest and crypt ambience — October 24, 2026

Two new twelve-second looping ambience tracks. Both selected variation-#1 takes are saved in ElevenLabs Assets, verified through the connected library, and backed up unchanged in original-downloads/. Four variations per request remain in Sound Effects History. This task generated two request groups/eight variations, with no retries.

## Install

Extract the ZIP. Upload recorded-audio.js, index.html and assets/ambience/ to the existing game repository root, replacing matching files. Keep all current gameplay, teacher, map, save and existing sound/music files. The other files in this ZIP are previews, backups and records; you may keep them locally.

index.html was taken from the live public repository at the time of this update; only the recorded-audio.js cache key was changed. recorded-audio.js retains the live audio integration and appends the ambience module. No game.js, movement masks, teacher scripts or save code are included or replaced. This update assumes the preceding corrected audio/game build is installed.

After GitHub Pages publishes, reload the game and enable Sound. Forest ambience plays during world exploration in region 0; crypt ambience plays during dungeon-world exploration, using the game's existing dungeon flag (so it also covers the other dungeon interiors). Neither plays during battles, road animations, title/result screens or other outdoor regions. Same-scene updates do not restart a loop.

Ambience is deliberately quiet and follows the existing Effects slider and master Sound toggle. It continues if only music is turned off. Hidden tabs and suspended audio are silenced; returning/re-enabling sound resumes the correct ambience. Assets load lazily only after sound is enabled. At most two ambience buffers are cached. Cancelled scene loads cannot start late; failed files can retry after toggling sound.

The MP3s are stereo 32 kHz / 96 kbps and normalized to a -25 LUFS target with a -3 dBTP target. They keep the generator's loop cycle intact and total 290,392 bytes. Original downloads and optimized game versions are both retained. Their exact durations, hashes and paths are in ambience-inventory.json. These generated assets are subject to the user's ElevenLabs account terms; they are not CC0.

Open ambience-preview.html after extraction to listen to the game versions. No subjective listening review or full live-game campaign test is claimed.

## Verified spending and saved assets

- Daily budget: 1,000 credits.
- Starting balance: 39,488. Final observed balance: 39,168.
- Used today in this chat: 320 credits (160 for each request, including its four variations).
- Remaining within today's budget: 680 credits.
- No Suno use, retries, paid extras or account setting changes.
- Forest saved asset ID: r95PB1zZacdvG6f8eHrN. Name begins Quiet temperate forest ambience for a fantasy RPG.
- Crypt saved asset ID: JqRGOLpQsjrvu8cFiEGk. Name begins Quiet ancient stone crypt ambience for a fantasy R.

## Checks

Both optimized loops decode to finite, non-silent, unclipped stereo samples. Automated checks passed for enable-before-fetch, forest/crypt routing, Effects volume routing, same-scene deduplication, two-buffer cache, stopping in battle/title/other regions, mute/hidden/suspend/resume, cancellation races and failed-file retry. The test loads the actual campaign audio class with the new module. Existing live audio code is retained verbatim before the appended module. Teacher/game controller and collision code are untouched. Remote deployment has not been performed.
