# Forest Path — combined audio update

This replaces the first-set ZIP: it includes all ten earlier generated effects, four new exploration effects, and the 24 retained physical Foley recordings. You only need this combined package.

## Upload

Extract the ZIP and upload game.js, recorded-audio.js, sound-data.js and the complete assets folder into the existing game repository root, replacing matching files. Keep existing music and other game files. Keep AUDIO-CREDITS.txt for original recording provenance. The preview, inventories, credit report, screenshot and game-audio-changes.json are reference files.

This is an incremental update for the inspected local ASTERFALL-PRODUCT-CONTENT recorded-audio build. game.js contains six targeted audio-hook edits to that snapshot; game-audio-changes.json lists them exactly. The latest deployed repository has not been verified. If your repository has newer gameplay changes, merge these edits into its game.js instead of overwriting that file. index.html is not replaced.

After GitHub Pages finishes publishing, hard-refresh (Ctrl+Shift+R), then enable Sound. If old code persists, update the existing game.js, recorded-audio.js and sound-data.js script query values in your current index.html to ?v=audio-20261023-set2.

## New behavior

- Footsteps play on actual free-exploration movement, at most once every 0.4 seconds. They stop when stationary and follow existing mute/hidden-tab/browser-audio rules. Grass/soil is used in the forest/coast; stone is used in mountain/city regions and dungeons. They are quiet relative to combat. Footsteps are not added to the separate road-travel animation.
- Treasure nodes and cache loot play chest opening. Non-cache loot keeps the first set's reward chime.
- A level earned through battle or loot plays the level-up cue in place of its usual victory/reward cue, avoiding overlapping celebrations. Ordinary victory and rewards retain their existing sounds.
- First-set fire/ice/enemy-magic launch and impact, healing, victory, defeat, and reward effects remain integrated. Physical combat, music, reward calculations and save format are retained.

## Audio and generation

Four SFX v3 requests were made in this set with a displayed price of 28 credits each; the settled charge was 27 credits each, including four variations per request. Variation #1 from each is packaged; the remaining variations are available in ElevenLabs history. No retries or additional generations were made. Fixed duration 2 seconds, looping off, influence 30%, automatic prompt improvement on.

The four new MP3s are mono 32 kHz / 96 kbps, peak-limited and attenuated for headroom. Footsteps are trimmed to 0.35 seconds with short fade-outs for responsive repetition. New generated effects are subject to the user's ElevenLabs terms; they are not CC0. AUDIO-CREDITS.txt concerns only retained existing recordings.

Open audio-preview.html after extracting to review all fourteen effects. Variation #1 is a first take, not a claim that it is the best of the four alternatives. Forest and crypt ambient loops remain future work and are not generated or integrated in this package.

## Validation

Passed: all four new MP3s decode to finite non-silent samples without full-scale clipping; syntax checks; 38 mapped asset paths; fourteen generated cue mappings; footstep surface choice and cadence limit; mute/hidden/suspended suppression; execution of the real patched win function for level-up versus ordinary victory. game.js has six explicit audio edits, recorded in game-audio-changes.json.

A full live-browser campaign regression, subjective listening review, and current GitHub-deployment verification were not performed.
