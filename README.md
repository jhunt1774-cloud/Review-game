# Forest Path / Web Wizardry audio update

This is an incremental update for the existing recorded-audio version of the game. It contains 24 EXISTING CC0 recordings, not newly generated ElevenLabs sounds. ElevenLabs generation requests made by this task: 0. Credits spent by this task: 0.

## Upload

1. Extract the zip.
2. In your existing game repository, replace sound-data.js and recorded-audio.js with these files and upload the included assets/audio-v3 folder, preserving its folder structure. Keep your other game files and music.
3. Retain AUDIO-CREDITS.txt for recording provenance. The inventory, plan, listening page and this README are optional reference files.
4. After GitHub Pages finishes publishing, hard-refresh the game (Ctrl+Shift+R), then enable Sound. If cached audio code persists, update the existing recorded-audio.js script query in your current index.html to ?v=audio-20261023. This package deliberately does not replace your current index.html.

Compatibility: the inspected index loads campaign.js, sound-data.js, then recorded-audio.js. If your repository lacks that sequence or uses a newer audio engine, compare it before applying. The actual GitHub repository/latest deployed revision was not identified. This is not a complete standalone game.

## Changes and existing coverage

The audio mapping and all 24 short mono 24 kHz / 16-bit PCM WAVs are packaged together. These are already trimmed, normalized and faded by the prior project; total 605,948 bytes and 12.60 seconds. No additional lossy transcode was needed. Their IDs and hash-based audio URLs are retained, preserving existing cue integration and browser caching.

Successful block defense now routes to the existing block-impact wood recording instead of duck-impact cloth. Missed defenses, timing, save data, music scene routing and sound controls are unchanged by the one-line code change.

Existing coverage: axe/blade swings, bow release, wood/body/metal impacts, parries, air/glass spell layers, cloth dodge/duck, jump, water healing, coins and wooden chimes. twigs-break is present in the mapping but is not called by the inspected recorded-audio cue groups.

Open audio-preview.html to audition each original recording. It can be opened locally after extracting; use the published game to verify actual gameplay playback.

## ElevenLabs connection and budget

The connected tool successfully returned three pre-existing sword-effect library entries. This confirms read access to that library, not generation availability or quota. Available tools do not expose authenticated daily remaining usage, reset time, an enforceable daily cap or a reliable per-effect maximum charge. The capability request returned that no additional tool exists. Monthly credits must not be substituted for the user's daily allowance.

Only temporary preview URLs were available for those three effects. They are not packaged as permanent production assets. No paid sound generation, retries or account setting changes were performed.

generation-plan.json contains prioritized prompts and target durations for later work. P1 replaces the generic spell/heal layers; P2 improves outcome and reward cues; P3 adds exploration audio requiring additional game hooks. Durations are creative targets, not cost estimates. Do not run this plan until remaining daily allowance, maximum request cost and a reliable cap are verified. No automated generation script is included.

## Verification

Passed: JavaScript syntax; loading the actual campaign audio class with packaged mappings and integration in a mocked audio environment; all 24 mapped files exist; all WAVs parse as mono 24 kHz 16-bit PCM with nonzero data; all 23 cue groups emit mapped buffers; block/dodge/parry routing; missed-defense suppression; mute, hidden-tab and suspended-context suppression.

No live-browser listening, end-to-end campaign test, actual Chromebook performance measurement or current deployed-repository verification was performed. Existing music is not included or changed.

Source snapshot: C:/Users/jhunt/Documents/Codex/ASTERFALL-PRODUCT-CONTENT. sound-data.js matches the local outputs/forest-path copy (SHA256 8743f47e4a63a561a36a6072eb82d2cd0e4c3ee952739acf0fc96b857af3360b). Exact packaged WAV hashes and durations are in audio-inventory.json. Credits are copied from the existing project without re-auditing their external source pages.
