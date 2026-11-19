# Shared combat motion

Alden keeps his separately authored sword and stride sheet. The rest of the roster and enemies use their existing registered pose sheets as the source for continuous body deformation. The same pass supports painted alternates, equipped gear, phase-specific art and newly registered enemy sheets. It adds anticipation, torso lean, compression, extension and recoil to the supplied poses. The underlying weapon poses and silhouettes still come from each existing atlas.

- The vanguard, defender, ranger and caster use different motion amplitudes. Existing attack actions retain their individual projectile, skill, sound and hit effects.
- Enemy wind-up and release sample the defense controller's progress. The original defense windows, projectiles and damage callbacks remain authoritative, including for alternate attacks and bosses. Hurt and recovery reuse the same renderer.
- Only active combatants get a temporary snapshot of their current frame, limited to 320 pixels on its longest edge. The canvas draws up to 18 strips at roughly 30 updates per second. No new image downloads, pixel readbacks or permanent atlases are required for the shared pass.
- Still poses, an unavailable canvas and the archived standalone build use their original presentation.

Run `node tools/forest-body-motion-smoke.cjs` in Chrome to exercise current roster and enemy art entries. For future frame-by-frame upgrades, [Alden's asset pipeline](HUMAN-WARRIOR-ANIMATION.md) shows how to replace a specific motion with bespoke limb and weapon animation. Review especially long weapons and broad wings in the arena, where artwork close to the portrait boundary can clip under deformation.
