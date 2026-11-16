# Teacher question sets

Open Teacher mode with the existing teacher code, then choose **Computer science sets**.

- Filter by suggested grade, topic, name, or built-in/saved library. Filters never change the assignment. Selections remain checked when changing filters.
- Preview questions and correct answers, add a set, or select several sets and add them together. Overlapping questions appear once. The assignment limit remains 500 questions.
- **Remove from assignment** keeps the library original. Questions shared with another contributing set, or present independently before adding a set, are retained. Editing a set question makes it an independent question.
- **Review assignment questions** opens the existing review/editor. **Activate current assignment** uses the existing teacher-game launch with the complete draft. The existing forest/Wildwood launch and student-link controls remain available in the share step.
- Built-ins are defined by the existing authored question banks and programming course data. They have no delete control and cannot be deleted through the library API. Suggested grades are starting points, not a new curriculum alignment claim.
- Saved/imported copies can be deleted only after a confirmation dialog. Deleting a saved copy leaves assignment questions and previously shared links intact. Saving creates a separate copy, including when its name matches another set.

## Import

Choose **Import a set** and select a CSV or JSON file. A valid file opens an answer preview; it does not replace the draft. Choose **Add this set to assignment** and/or **Save a copy to library**. Download the existing CSV template for an example.

CSV requires unique headers `subject,question,A,B,C,D,correct,explanation`, equal column counts on every row, and an A–D answer key. Quote fields containing commas or newlines. JSON accepts an exported version-1 lesson or a question array; `correct` is an integer from 0 to 3. Each question needs a supported subject, question text, four nonempty answers, and an explanation (a default is supplied when omitted). Limits remain 400 KB per CSV/JSON file and 500 questions; existing text limits also apply. Validation errors identify the question or CSV row when possible, and leave the assignment unchanged.

The existing PDF/DOCX/TXT reader remains available with its review, append, and explicit replacement actions.

## Storage and compatibility

No Firebase, accounts, network import service, or new backend is introduced. Existing teacher drafts, local library snapshots, class folders, student links, save slots, question banks, and game code are retained. Older library snapshots receive stable local identities without a startup storage rewrite. Built-ins no longer consume the 30 saved-set slots. Older saved copies of built-ins remain saved copies; the protected source originals are always available.

Set membership and names travel in the question's existing `standardMeta` object, preserving membership in saved/exported assignment snapshots. A storage write must succeed before a library save/deletion is committed in memory. Existing teacher backup/export controls remain the way to move materials between devices.

## Validation

Passed locally on Windows/Chrome:

- `node tools/audit-checks.cjs`: CSV parsing, blocked-storage startup behavior, script syntax and paths.
- `node tools/build-pages.cjs`: static deployment package and relative paths.
- `node tools/teacher-sets-smoke.cjs`: grade/topic filters, multi-selection, overlap-safe removal, built-in protection, legacy snapshots, import preview and malformed-file rejection, 500-question limit, storage failure, confirmation/cancel, deletion/reload, student links, activation, and desktop/390px layout.
- `node tools/browser-smoke.cjs`: original campaign startup, imports, save recovery, and victories in encounters m0 and m3.
- `node tools/forest-classroom-smoke.cjs`: correct/wrong answers, HP loss, pending-strike recovery and no duplicate damage.
- `node tools/forest-choices-smoke.cjs`: exact teacher wording in actual combat, linked assignments, choices, save validation and compact layouts.
- `node tools/forest-fast-play-smoke.cjs`: default opening, navigation, combat entry, rewards, party features, full-story fallback and small-screen layout.

Teacher management, choices and fast-play checks were also run against `work/site` under the `/Review-game/` project prefix. The management check is included in the existing GitHub Actions classroom workflow. This is targeted regression coverage; the entire map/art regression collection was not rerun locally.
