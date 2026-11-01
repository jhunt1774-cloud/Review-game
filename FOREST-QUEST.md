# Wake the Emerald Heart — focused forest adventure

This update adds a complete forest quest to the existing game. Choose **Play forest quest** on the title screen; **Start full campaign** retains the larger Asterfall journey.

## What changed

- Four connected encounters: Mossgate, Whispering Hollow, the bridge sentinel and the three-phase Forest Guardian. Required campaign dungeon detours remain part of the full campaign, while this mode follows a shorter forest route.
- The bridge encounter sits at the painted bridge approach instead of the distant eastern terrace. Brisk movement, a wider camera view and a **Follow gold trail** button reduce wandering. The trail follows the existing walkable navigation grid, including corners and gates.
- After Mossgate, choose **two healing potions** from the supply cache or **a shield against the Guardian’s first strike** from the Moonwell spirit. Choosing one closes the other. Rewards cannot be collected repeatedly.
- Rescue the ranger along the route to learn the Guardian’s axe → hammer → fire phases and begin that battle with two focus. Sharing a potion also restores up to 40% of each hero’s maximum HP; cutting the roots is free.
- Optional discoveries and camp use an explicit **E / Search / Visit camp** action. Passing them does not open a dialog. Marked locations are interactive; unmarked painted scenery remains decorative.
- Whispering Hollow unlocks instant return to camp and return to the same trail position. The bridge victory unlocks a canopy shortcut to the Guardian’s approach. These shortcuts preserve inventory and earned progress.
- Gold identifies the next goal, blue identifies optional preparations, and green checks identify completed sites. Opened supply chests look searched; the sentinel’s roots disappear after its defeat. The route panel shows four-encounter progress and preparations.
- The Guardian victory includes a forest-specific conclusion and a recap of choices and question results. Players can explore the warmer, restored forest and glowing ancient tree or reopen their recap. The full campaign remains available from the title screen.
- Camp goals and shop dialogue stay focused on this quest. Full campaign contracts and the missing-courier task are not offered in short-quest camp UI. Existing equipment, upgrades, skills, healing, audio controls and reward systems remain available.

## Forest polish pass

The route panel now lists optional preparations with their exact benefits and a 0/2 readiness count. Choose one to follow a blue side trail; **Resume main trail** returns guidance to the gold story route. Arrival prompts explain E / Search, claimed and declined choices are labelled, and optional preparation navigation never grants a reward by itself. Keyboard Enter activation is protected against accidentally triggering the newly focused resume button.

The title card shows saved encounter progress, the practice set name when applicable, and a restored-forest message after completion. The ranger healing option is disabled when the party is already healthy, so a potion cannot be wasted for no healing.

`node tools/forest-polish-smoke.cjs` checks keyboard route selection, contextual E interaction, readiness/choice labels, potion protection, save-note persistence, and the expanded route panel on a smaller screen. The full forest smoke check also navigates through these controls and tests returning to the main route.

## Recovery and Guardian readiness

The map now shows party health, fallen allies and available potions. **Heal [hero] · 1 potion** targets the ally with the lowest percentage of health, reusing the existing potion amount and cost. It is disabled when everyone is healthy or no potions remain.

Camp recovery appears prominently above the party controls. Rest heals all four heroes without spending a potion and still respects the existing limit of one rest per cleared encounter. Equip rewards before resting. The route panel gives a readiness reminder after the bridge, and the Guardian arrival screen shows each hero’s HP. **Visit camp before the Guardian** lets you heal and change equipment, then return to a safe approach without losing bridge progress or triggering the battle immediately. No new save fields are required.

`node tools/forest-recovery-smoke.cjs` checks exact potion cost and targeting, fallen-hero recovery, full-health protection, rest limits and refresh, smaller-screen panel bounds, Guardian readiness across reload, a safe camp round trip, retained boss bonuses and unchanged full-campaign UI.

## Questions and saves

The default quest uses the existing HTML/CSS questions. In Teacher mode, review a valid set and choose **Play forest quest with this set**. When an assignment link is open, the title-screen forest quest uses that assignment’s questions. Unrecognized imported questions keep their wording and correct answer; existing answer shuffling is retained.

The short quest uses its own local `web-wizardry-forest-v1` save and rolling backup. It does not write over normal campaign, assigned campaign or teacher campaign saves. Starting a new forest quest, including one with a different question set, asks for a second confirmation if a short quest already exists. There is one short-quest slot, not a new slot for each assignment. Progress download/restore supports it. Reload and Continue preserve preparations, cleared encounters and the ending. Existing full campaign saves retain the original map anchors and story prerequisites.

No Firebase configuration or service was added. The older `forest-path/` copy and standalone export were preserved unchanged; this feature is in the repository-root game.

## Validation

Run from the repository root with Node. Browser checks require Google Chrome on Windows, use fresh temporary profiles under `work/`, and bind loopback only. The two forest browser checks share ports 8138/9238 and must run one at a time. The older audit browser check uses 8137/9237.

- `node tools/audit-checks.cjs`: CSV validation, blocked storage initialization, storage isolation, 115 local entry-script paths and classic JavaScript syntax.
- `node tools/browser-smoke.cjs`: original campaign startup, assignment roundtrip, imports, backup preservation/recovery, Mossgate and Guardian playtest victories with no runtime exceptions.
- `node tools/forest-adventure-smoke.cjs`: full forest quest through real map walking and all four battles; one wrong answer; all four heroes act; spirit choice, ranger rescue, camp return, return to trail, canopy shortcut, save reload, Guardian shield/focus, final recap, restored map, Continue, unchanged original campaign save and restored original bridge location.
- `node tools/forest-choices-smoke.cjs`: alternate supplies choice, duplicate reward prevention, exclusive boon, invalid restore rejection, reviewed teacher and linked questions used in actual combat, audio startup, no inactive roaming enemies, sealed boss gate and 768×600 route panel bounds.

The automated runs use still poses, assisted defense and programmatically selected answers. They verify working mechanics, not a student's completion speed. The design targets a short classroom adventure, but a real 10–15-minute student trial and a physical older-Chromebook frame-rate/memory test are still needed. The existing Standard/Light visual trial remains available. No new bitmap assets or decoded-image cache growth were added by this feature beyond reusing existing chest, rune and ranger art.

## Implementation

`forest-adventure.js` contains the mode, map presentation, interactions and scoped rule adapters; `forest-adventure.css` provides the new route and ending UI. Small controller hooks in `game.js` handle the separate slot, mode validation, encounter setup, movement, shortcuts and ending. `index.html` loads the new module before the game controller. Mode changes invalidate cached terrain and restore campaign anchors, which is covered by the browser playthrough.
