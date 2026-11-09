# Forest adventure update — November 9, 2026

Built on the existing map-alignment branch, with the current heroes, questions, artwork, combat and saves. The short quest gains more distinct encounters and clearer payoffs without adding a currency, account, backend or extra progression menu.

## Encounters and teamwork

- At half health, the Mossgate imp changes to **Briar flare**, with a jump defense and a readable tell. A fire weakness hit disrupts it by 35%, using the existing enemy-opening rule. Enemy HP and base damage are unchanged.
- At half health, Thornfang changes to **Cornered feint**. It pursues the healthiest living hero instead of the most injured one and uses a parry defense. Brom's taunt still takes priority. The change is announced and shown in the intent briefing.
- Existing armor exposure, Hunter's Mark, rally and opening bonuses now produce a **Team Combination** cue when consumed by a real hit. Their existing damage math is retained. The acting hero is highlighted briefly; these effects do not create another attack or award extra XP.
- The Guardian's real health-phase transitions announce the broken binding with a companion reaction. Restoring a save midway through a phase does not replay a phase change.

## Discoveries and distinct rewards

Rescuing the ranger still supplies the established two starting focus. It now also earns one **Ranger distraction** per Guardian attempt: the first rootfire eruption that is not interrupted deals 25% less damage before defense. Previewing the attack does not spend the help. Committing it does; the adjusted pending attack and a validated boolean flag preserve the result across reload. An interrupted eruption does not use it. Retrying or resetting the encounter refreshes it. A wrong answer still strengthens the incoming strike under the existing rules.

In the short quest, **Moonfang bow** replaces its rarely reached third-hit bonus with **Trailmark**: its first successful damaging hit each battle sets an opening. The next teammate weakness hit gains 25% damage and restores one shared focus, capped at three. This reuses the established opening effect; a wrong answer or zero-damage support action does not trigger it. It cannot stack multiple opening charges. The player must equip the bow through the existing camp equipment controls. The full campaign retains Moonfang's original Rhythm Shot trait.

Victory reward cards explain practical uses for Mossbite's existing finisher, Moonfang's new setup and Bridgeguard's existing first-hit ward. No new loot IDs or reward payouts are introduced.

## Guardian rescue and walking

The final successful hit frees the Guardian. Its existing artwork returns to a standing idle pose, roots release, the heart and atmosphere gain a gentle restored glow, and the celebration reads **Guardian Freed**. Defeated/zero-HP labels are hidden during that scene. The recap acknowledges the ranger's actual participation. The existing result controls and celebration timing remain; no extra mandatory cutscene is added.

The fullscreen positioning dock no longer receives an opaque panel background. Questions and feedback retain their own readable cards while the battlefield, effects and rescued Guardian remain visible behind them. The finale headline fits above the party health bars.

Chosen click-to-walk routes now have a solid blue trail distinct from the gold story guidance. **Stop walking** and Escape cancel the route; WASD/arrows still take over. The destination marker tracks the actual route endpoint, and starting another walk replaces stale arrival text. The route shape is cached and drawn within the existing map render loop. It does not alter navigation or allow shortcuts across barriers. Modal dialogs and text fields retain Escape handling.

## Verification and limits

The focused payoff check exercises real hits and counters: imp/wolf tactics and taunt; Trailmark and a teammate's actual opening consumption; wrong-answer and repeat protection; exact ranger reduction, preview/commit, reload and retry; phase transitions; reduced motion and hidden-tab cleanup; the standing Guardian; companion recap; and original-campaign equipment isolation.

The route-guide check covers route cache reuse, collision-valid segments, endpoint markers, Stop/Escape, modal protection, keyboard takeover, arrival feedback, title cleanup and small-screen controls. Existing forest, all-map and original-campaign checks remain part of validation. No new bitmap downloads or animation loop were added. A timed student playthrough and an actual school Chromebook trial remain necessary to judge pacing, input feel and performance.

Local results: all eleven forest browser suites passed, including the full four-encounter quest with 23 correct answers and one mistake. The ten-map check passed 114 destination routes, 12 sealed destinations and real round trips through all five side areas. Original-campaign imports, backup recovery, assignment roundtrip and Mossgate/Guardian victories passed without runtime exceptions. The final visibility change is additionally checked in the payoff and full-motion visual suites against the packaged `/Review-game/` site.
