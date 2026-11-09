# Forest Path: Web Wizardry

Scenery update: [forest atmosphere and Moonwell stair landmarks](FOREST-ATMOSPHERE-UPDATE.md).

Character update: [Rowan, Ilyth, portrait scenes and camp appearances](FOREST-CHARACTER-UPDATE.md). Reward update: [equip newly earned gear after victory](FOREST-REWARD-UPDATE.md).

Adventure update: [encounter twists, teamwork, the ranger and the Guardian rescue](FOREST-ADVENTURE-UPDATE.md), plus visible chosen walking routes and a Stop Walking control.

Map update: [painted maps, story connections and traversal](MAP-TRAVERSAL-AUDIT.md) covers clear-path boundaries, safer stair controls, entrance/exit checks and map-aligned narration.

Latest development: [forest tactics, story and visual direction](FOREST-DIRECTION.md) describes the sentinel's armor-opening mechanic, enemy-intent briefing, connected river story and restoration visuals.

A single-player educational review RPG for middle school. The active version is the repository-root **index.html**, titled *The Last Light of Asterfall*. Choose **Play forest quest** for the four-encounter classroom adventure, or **Start full campaign** for the longer journey. The `forest-path/` folder and standalone exports are older versions, retained for compatibility.

## Classroom quick start

1. Open https://jhunt1774-cloud.github.io/Review-game/ in Chrome.
2. Choose **Play forest quest**. Follow the gold trail; blue stops offer optional preparations. Clear three dangers, prepare at camp, then face the Forest Guardian.
3. Choose an action, then answer with a click or **1–4**. Correct damaging actions hit enemies. Incorrect answers cause no hero attack and strengthen the incoming strike. Correct answers can still be followed by the existing enemy counterattack. Read the explanation, then click **Next question** or press **Enter**.
4. Use the displayed arrow/button to defend. Settings offers **Assisted practice · no timer**, still poses and audio controls. Sound is opt-in.
5. **Continue forest quest** resumes on the same browser profile. Settings → **Progress backup & restore** downloads/restores progress files.

The forest quest targets 10–15 minutes. Automated completion is not a student timing study; reading, mistakes and exploration affect duration. A timed classroom trial remains necessary.

## Teacher questions and difficulty

Open **Teacher mode**. Select banks and depth, review the draft, choose battle difficulty, then **Play forest quest with this set**. Existing campaign level/playtest selection and teacher tools remain available.

Import CSV/JSON sets, or extract readable PDF, DOCX and text documents using the review step. Download the CSV template for its exact format. CSV/JSON imports replace the draft; review every correct answer before assigning. Scanned PDFs need OCR elsewhere. Downloaded assignments and assigned-quest links remain supported. One separate forest save slot is available; replacing it requires confirmation.

No account or backend is required. Saves belong to the device, browser profile and website origin; school data cleanup can remove them. Download backups before switching devices. The entry point no longer loads the old optional cloud adapter; historical source remains unused.

## GitHub Pages

`node tools/build-pages.cjs` packages the existing game in `work/site/`, including artwork, audio, question sets and local PDF/Word readers. It excludes developer tools, browser profiles, Git data and original-download backups. No bundler or server is required to play.

Set repository **Settings → Pages → Source** to **GitHub Actions**. Regression checks run on pushes and pull requests. After successful checks for a push to `main`, the Pages workflow deploys that exact tested commit. Feature branches never deploy automatically. Existing branch-based publishing can continue until the source is switched.

The workflow follows GitHub's [custom Pages guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). School filters must allow the site. Test through its HTTPS address including `/Review-game/`.

## Verification

Use Node 24 and Google Chrome on Windows; no npm packages are needed. Run browser checks sequentially. They use temporary profiles and loopback ports 8137/9237 or 8138/9238. Set `CHROME_PATH` if Chrome is installed elsewhere.

```powershell
node tools/audit-checks.cjs
node tools/build-pages.cjs
node tools/browser-smoke.cjs
$env:SITE_ROOT='work/site'
$env:SITE_PREFIX='/Review-game/'
foreach ($test in Get-ChildItem tools/forest-*-smoke.cjs) {
  node $test.FullName
  if ($LASTEXITCODE) { throw 'Check failed' }
}
```

Published-package checks use the project URL prefix to catch broken asset paths. They cover the full quest, teacher imports, wrong answers, saves/reload, choices, camp healing, upgrades, tactical goals, markers and smaller-screen bounds.

See [FOREST-QUEST.md](FOREST-QUEST.md) for mechanics, [CHROMEBOOK-TRIAL.md](CHROMEBOOK-TRIAL.md) for physical-device checks, and [AUDIT-2026-11-09.md](AUDIT-2026-11-09.md) for current results and remaining work. The old audio README is preserved in [AMBIENCE-UPDATE-2026-10-24.md](AMBIENCE-UPDATE-2026-10-24.md).
