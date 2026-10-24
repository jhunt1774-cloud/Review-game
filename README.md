# Complete ambience update — October 24, 2026

This cumulative update includes forest, crypt, mountain and coast ambience. You can skip the earlier Forest-Crypt-Ambience ZIP; this includes its files and the two new loops. All four selected takes are saved in ElevenLabs Assets and backed up unchanged in original-downloads/. The optimized files are in assets/ambience/.

## Install

Extract the ZIP. Upload index.html, recorded-audio.js and the complete assets/ambience/ folder into the existing game repository root, replacing matching files. Keep the other files locally as backups and records. Wait for GitHub Pages to publish, then reload and enable Sound.

The page is copied from the current live repository, with ONLY the recorded-audio.js version query changed. The live audio script is retained, with ONLY the ambience track list and region choice expanded. No game.js, teacher tools, walking code, collision data, question banks or save code is included or replaced.

Forest plays in outdoor world region 0; mountain in regions 1 and 4 (Frostpeak and Highlands); coast in region 3. City region 2 has no added ambience. Dungeon-world scenes use the crypt loop through the existing dungeon flag. Battles, title/results and road animations stop ambience. Effects volume and the master Sound toggle control it. Music can be disabled while environmental effects continue. Hidden tabs/suspended audio stop it; returning or enabling sound restarts the proper loop. Same-scene updates do not restart playback. Loads are lazy after sound is enabled, and cancelled loads cannot start late. Failed files can retry after toggling sound. There are at most four cached ambience buffers, one per supplied environment (approximately 12 MB of decoded audio combined).

All four optimized tracks are twelve-second looping stereo MP3s at 32 kHz / 96 kbps. Loudness target -25 LUFS, true-peak target -3 dBTP, mixed quietly at gain .18 into the Effects bus. Combined optimized size: 580,784 bytes. Open ambience-preview.html to hear the four loops. Their exact paths, durations and hashes are in ambience-inventory.json.

## Spending and backups

| Requests on October 24 | Credits |
| --- | ---: |
| Forest and crypt | 320 |
| Mountain and coast | 320 |
| Total today | **640** |
| Remaining in 1,000-credit daily task budget | **360** |

Account balance: 39,488 before today's ambience work; 39,168 before this pair; 38,848 after it. Each request cost 160 credits and included four variations. Four request groups / sixteen generated variations today; selected variation #1 from each is saved to Assets, downloaded and integrated. No retries or additional generations. Other variations remain in Sound Effects History. No Suno credits were used.

Verified saved Assets IDs:
- Forest: r95PB1zZacdvG6f8eHrN
- Crypt: JqRGOLpQsjrvu8cFiEGk
- Mountain: d1iYzH95W0QQ1n8XM7q9
- Coast: oX3cfq6BF48nNr4r7z0p

Original downloaded MP3s are retained in original-downloads/. These generated sounds are subject to the user's ElevenLabs terms, not CC0.

## Checks

Passed: both new game files decode to finite, non-silent, unclipped stereo samples; JavaScript syntax; all four ambience choices and Highlands routing; quiet Effects-bus connection; same-scene deduplication; bounded four-buffer cache; battle/title/city stop; mute/hidden/suspend/resume; cancelled-load race; failed-file retry. Regression checks passed for all fourteen existing generated effect cue mappings and all seven music routes using the actual campaign audio class. index.html differs from the live snapshot only in the recorded-audio.js version query.

No live end-to-end gameplay or physical Chromebook test was performed, and no remote deployment was made. A subjective listening review of the first takes is not claimed. This is an incremental update over the corrected audio/game build; it is not a standalone game.
