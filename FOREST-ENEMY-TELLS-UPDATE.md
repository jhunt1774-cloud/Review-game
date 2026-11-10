# Forest enemy tells and Guardian transformation

Forest enemies now have distinct visual intent symbols for rakes/feints, pounces, briar flares, sweeps, overhead blows, thorn lashes, gathering rootfire, eruptions and interrupted attacks. The existing tactical briefing shows the actual defense sequence; charge and interrupted turns explicitly say that no defense is needed. Resumed partial sequences show their remaining steps.

During questions, the symbols stay subdued and static. Once defense opens, they become clearer. Gold and perfect-defense green follow the existing controller's actual clock in guided/timed modes; assisted practice stays untimed. Wide flare, sweep and eruption marks sit low near the ground. The symbols are decorative; text and existing directional controls remain authoritative.

The Guardian's root shell and bark bindings now have separate visible layers. Real damage that crosses a phase threshold sheds the corresponding layer and reveals the lighter bark or exposed Heart. One bounded 420ms animation is allowed; still and Light modes change layers immediately. New encounters, reloads and restored saves display their current phase without replaying a transition. Hidden tabs cancel the transition.

The forest Guardian now uses the existing central companion phase notice and tactical briefing rather than duplicate legacy phase banners over the party HP bars. Other campaigns keep their phase displays.

No damage, targeting, question, defense window, attack timing, reward or save-format rules changed. There are no new raster assets, animation loops, dependencies or backend services. The existing battle clock and pending attack data drive the presentation.

Validation: static/import/syntax checks and GitHub Pages packaging; browser checks for attack types, assisted and real guided-clock cues, correct/wrong answer behavior, phase shedding after actual hits, committed-strike reload without replay, still/Light/hidden-tab behavior, bounded cleanup, 768 x 600 layout and original campaign isolation. The full four-encounter quest, existing ranger/teamwork payoffs and visual regressions passed. Original campaign startup, combat, imports and save recovery also passed.

Physical Chromebook performance, player recognition of the new symbols and a timed student playthrough remain unverified. Feature branches do not deploy production automatically.
