# Forest encounter, story and visual direction — November 9, 2026

This pass continues `codex/forest-classroom-polish-20261109` on a separate branch, `codex/forest-tactical-story-20261109`. It preserves the existing four-hero combat, shared focus, round rotation, skills, teamwork, equipment, tactical goals, defense timing, enemy counterattacks, teacher content and full campaign.

## Mechanics

The short-quest sentinel now braces against non-hammer attacks (25% less damage, in addition to existing arrow resistance). Hammer weakness remains unchanged while braced. A **correct Guarding strike** opens the armor for the next two damaging hits. Those hits gain 25% damage and bypass arrow resistance; hammer weakness still applies. The guard retains its original light attack, focus gain and next-hit protection. This creates a defensive setup alternative to immediate hammer damage, using existing actions and resources.

The optional `sentinelOpening` save field accepts only integers 0–2. Old saves without it work. Correct damaging hits consume one opening; a guarding hit then establishes two new follow-ups. Wrong answers and zero-damage support actions do not consume an opening. Reload preserves it; a new encounter, retry or escape reset clears it. No duplicate rewards or new currencies are introduced.

Channel focus is unavailable at full shared focus in the short quest. Its displayed gain reflects remaining capacity; stale button handlers and answer execution also enforce the check. Full-campaign behavior is retained.

## Readable decisions

A compact, expandable enemy-intent briefing replaces the short quest's secondary insight panel. It shows predicted targets, correct/incorrect incoming damage before defense, current armor/weakness, focus, stagger, Power Strike and active team effects. Predicted intent is labelled separately from a committed incoming strike; the interface explains that healing, taunting, shields and weakness hits can change it. Targeted heroes have a text label as well as a colored border. The existing optional tactical goal remains available.

The briefing is positioned in the upper clear area rather than over the enemy. It has bounded height and scrolling when expanded. Screenshots are inspected at desktop and 768×600 sizes. The question and defense controls retain their existing layout and keyboard controls.

## Story and visuals

The short quest has a complete story, revised against the painted map: the west-bank paths lead the companions through a frightened creature, a cornered hunter and a sentinel whose protective command has been corrupted. The Guardian has been containing the corruption, and the finale frees it while returning the Emerald Heart to the tree. Companion names respect the existing custom-hero substitution. The larger Beacon campaign's story is unchanged.

Preparations explain the existing exclusive choice: take the stranded scouts' spare medicine, or leave the kit with them and carry the spirit's ward. The ranger remains a separate rescue. The ending acknowledges whether the ranger was rescued without claiming an unearned reward.

Cleared landmarks gain cached vegetation/water-recovery accents, and the world status follows the returning river. The Guardian's existing three phases gain static binding roots, fracture marks and a luminous heart ring; the sentinel ground marker distinguishes braced/open armor. These reuse existing art with small local vector/canvas additions. No image downloads, animation loops, external services or new bitmap assets were added. Still poses, reduced motion and Light settings retain the existing bounded effects behavior.

## Verification and limits

`node tools/forest-direction-smoke.cjs` checks actual guarding and follow-up turns, wrong-answer protection, exact armor multipliers, save/reload, the focus cap and stale click protection, story opening, three phase treatments, small-screen briefing bounds, recovery-art caching and original-campaign isolation. It runs against the built static game at `/Review-game/` with the existing browser harness.

The existing full-quest playthrough still reaches all four victories with 23 correct answers and one mistake. The other regression suites cover teacher/linked questions, choices, recovery, rewards, keyboard navigation, visual lifecycle and original-campaign combat/imports. This pass does not establish physical Chromebook performance or human completion time; a real 10–15-minute student trial remains necessary. Production is unchanged until the reviewed branch is merged and deployed.
