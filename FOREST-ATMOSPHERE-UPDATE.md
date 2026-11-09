# Forest atmosphere and landmark update

The Moonwell stair approach now has a readable in-world sign. Before the sentinel yields, it says the stairs are sealed and points the player back to that encounter. After the sentinel victory, it identifies the Guardian grove. Small ground chevrons follow the actual walkable stair route only after it opens. The sign stays near the approach rather than appearing as another permanent screen panel.

The painted river now has a restrained cool-water tint and gentle current highlights. Its cached 300 x 200 mask excludes every walkable cell. Highlight segments are checked against that mask, so the effect cannot paint a new crossing across the river. A few leaves drift over non-walkable canopy areas; the restored grove gains warmer accents and four small lights.

Settings includes Forest atmosphere: Gentle, Still scenery, or Off. Gentle follows the existing motion preference; reduced motion uses fixed poses, Light mode omits leaves and motion, and hidden tabs draw none of the added layer. Off retains the useful stair sign. The setting is local and independent of quest progress.

No map painting, movement mask, gates, saved campaign data, encounters, questions or character rewards changed. This layer applies only to the short forest quest. It uses the existing render loop, one cached river mask and two cached sign images, with a maximum of 24 decorative accents and no new bitmap downloads or animation timers.

Validation: static/import/syntax checks and Pages packaging; browser checks for river-mask exclusion, unchanged collision cells, cached mask reuse, stair marks on walkable ground, gentle/still/light/off/hidden behavior, 768 x 600 layout and original campaign isolation. Existing map regression covers all ten painted maps, 114 destination routes, 12 sealed destinations and all five actual entrance/exit round trips. Chosen-route controls and character scenes were also checked.

The browser test harness now removes its disposable profiles after Chrome exits; accumulated profiles from earlier test runs were cleared from the project work folder after they exhausted disk space. The blocked screenshot checks then passed on rerun.

Physical Chromebook performance and timed student play remain unverified. The feature branch does not deploy the live site automatically.
