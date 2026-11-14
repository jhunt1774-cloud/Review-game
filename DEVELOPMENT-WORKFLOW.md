# Forest Path development and review

## Source of truth

Start new work from current `main`. The repository-root `index.html` is the active game. Keep the original campaign, short forest quest, optional modular/Wildwood modes, teacher imports and existing save slots. The `forest-path/` folder and standalone HTML are legacy exports; do not develop a replacement copy there.

Use one new feature branch and one pull request per coherent change. Describe acceptance criteria before changing behavior. Never rewrite, delete or force-push existing branches or move `backup/painted-maps-20261110` or `backup-painted-maps-20261110`. Existing historical branches are already incorporated into the audited main; they are not a queue of features to merge again.

## Verify and hand off

Run the existing Windows / Node 24 / local Chrome checks sequentially as defined in `.github/workflows/classroom-checks.yml`. The forest, map, modular and Wildwood suites must use `SITE_ROOT=work/site` and `SITE_PREFIX=/Review-game/` after building. The original campaign suite currently serves source rather than the packaged site; report that distinction.

Every handoff uses `DEVELOPMENT-COMPLETION-REPORT.md`, including exact commit, test evidence, known limitations, branch, PR and preview URL availability. Run relevant checks after edits; expand to the full suite for gameplay, import, save or shared-rendering changes. Retain a physical school Chromebook check for performance and school policy behavior.

## Review package, without publication

After successful CI, the proposed workflow addition uploads `work/site` as `forest-path-review-<full commit SHA>`, retained for seven days. Open the matching Actions run and download that artifact. It is a static review package, not a hosted preview URL. Check the SHA in the artifact name against that run's tested checkout: push runs use the branch commit; PR runs normally test GitHub's synthetic merge commit, which can differ from the PR head. Record both when relevant. Run the package through a local static HTTP server and open its `index.html`; ES modules/document readers may not work from a `file:` URL. No application backend or account is needed. An adult review computer can serve it to a Chromebook on an allowed local network, subject to school policy. Do not upload student saves or private question banks to public artifacts.

There is currently no separate hosted PR preview. Do not substitute the live student URL for one. A future preview host requires an explicit choice of hosting/access policy and must remain separate from production, use project-relative paths, and identify its commit. This audit adds no external service, credentials, preview deployment or production change.

## Approval and production

Present the tested result and obtain user approval before merging. Existing Pages automation publishes successful **push checks on main**, using that checked SHA. Merging into main is therefore a release action, not just branch organization. Do not push to main as part of development. Verify successful Pages deployment and the live version after an approved release; successful CI by itself is not a deployment.

Recommend requiring the classroom check and a review on main through GitHub protection settings, after the owner chooses the policy. The audit did not change repository settings. Also consider a production environment approval gate; do not claim it exists without checking.

Preserve static hosting and local imports: no account, backend, remote document-processing dependency or loss of device-save support. Teachers must review imported answers. Do not equate library loading with extraction accuracy or Chrome emulation with real Chromebook validation.
