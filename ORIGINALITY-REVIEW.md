# Question bank originality review — October 19, 2026

## Findings and scope

The course-linked bank contained 31 sets and 124 questions. The earlier build script shows individually written review items, rather than an imported official assessment. However, that alone does not prove that every item is independently expressed or legally cleared. It retained branded lesson titles, one-to-one lesson source links, and lesson-associated contexts including licensed characters, nectar collection and named tools. General short definitions and programming facts are not themselves proof of copying.

All 124 course-linked items were replaced with newly composed prompts, four answer choices, and explanations. New contexts include parcel kiosks, weather sensors, museum exhibits, screen state, timers, counters, diagrams and delivery systems. No official puzzle text, puzzle answer, screenshot, character or branded lesson title is included in the replacement bank. The builder reads only the independently authored local data, not curriculum pages or lesson metadata. Internal EXPRESS_SETS / expressLesson names and numeric IDs remain solely for compatibility; the visible teacher menu now reads Programming Skills.

The shipped questions.js, cs-bank.js and teacher extras were scanned for Code.org source references and lesson/character markers; no other Code.org-linked question bank was identified there. This is not a comprehensive comparison of all those questions against every external curriculum. Historical source files, research files and previously delivered archives are not current release inputs and have not been represented as legally cleared.

## Legal basis and limits

The U.S. Copyright Office distinguishes unprotected ideas, methods and systems from their protected expression: https://www.copyright.gov/circs/circ33.pdf . Shared concepts such as loops, variables and Boolean decisions can be taught using independent wording and examples.

Code.org's current terms contain curriculum-license restrictions, including noncommercial restrictions: https://code.org/terms-of-service . Those permissions should not be treated as authorization to sell copied or adapted curriculum material. The replacement bank is intended as independent concept practice, rather than a redistribution under that curriculum license. No affiliation or endorsement is claimed.

This editorial review reduces identified content dependencies. It is not a legal opinion, a comprehensive plagiarism search, a warranty of noninfringement, or a guarantee that AI-authored text will itself qualify for copyright protection. Commercial release review can evaluate the final product and its marketing separately.

## Files and compatibility

- Game scripts: express-sets.js and express-ui.js; index.html supplies fresh versioned references.
- Import exports: 31 individual skill sets and one complete bank, each in JSON and CSV. All 124 items include a correct answer and explanation.
- Legacy Lesson-01 through Lesson-31 exports in the current source directory were also replaced to prevent accidentally reimporting the old content.
- The prior builder entry point now delegates to the independent builder, preventing a routine rebuild from restoring the old bank.
- Personal and course banks remain excluded from the separate commercial-release build. The independently authored bank is provided separately; this change does not automatically distribute private teacher content in a sale edition.

## Important snapshot limitation

Existing teacher drafts, downloaded files and student assignment URLs may contain old question snapshots. A game update does not rewrite them. Create a fresh assignment from Programming Skills or import the revised files, review it, and share a newly generated link. Retire old exports/links when using this revised bank. Do not redistribute earlier course-branded question archives as the audited replacement.

The full 124-question file imports successfully, but may exceed the game's 12,000-character student-link limit if shared as one assignment. Share selected skill sets or smaller combinations. Each of the 31 individual sets passed a student-link round trip.

## Verification

Source and packaged-build checks passed: 31 sets / 124 unique prompts; supported question schema; four distinct choices; valid correct indices; neutral-content checks; matching JSON exports; full-bank JSON and CSV imports through the actual teacher file handler; set selection, combining, individual removal and deduplication; generation scope; and 31 individual-set share-link round trips. Existing teacher-setup and import-feedback tests passed. The commercial build's question isolation checks passed. No live-browser verification was performed in this session.
