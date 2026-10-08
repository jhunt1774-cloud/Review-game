# Forest Path — Web Wizardry

Open `index.html` in a current Chrome or Edge browser. Keep the folder together. No installation, account, internet connection, backend, or build step is required. For a Chromebook, extract the ZIP in Files and open the HTML file with Chrome. If local-file opening is restricted by a school policy, serve the folder from an approved static web host.

`forest-path-standalone.html` is the same game in one file with all styles, scripts, and artwork embedded. Use this version as the transfer candidate for Canva Code. Canva import/publishing has not been tested in this delivery; preview it there and check saving and animations before publishing. This package is browser-native and has no framework or external dependencies.

## Playing

Start begins a new journey. If a save exists, Start asks for a second click before replacing it. Continue loads your device-local save. Click an answer, or press 1–4. Read the explanation, then click Next question or press Enter. Correct answers rotate through the living party and trigger their attacks. Wrong answers let the enemy attack one living hero. Fallen heroes skip their turns.

Clear three encounters and the Forest Guardian. Victory gives XP, gold, and a named treasure and fully heals the party. Every 120 cumulative XP raises the party level, maximum HP, and attack power. A defeated party can retry the current encounter without losing earlier rewards. Saves occur after each resolved turn and encounter transition. Closing during an animation resumes the last resolved turn. Saving is local to the browser and origin; moving to another host or clearing browser data will not transfer the save. If storage is blocked, a status message says so and the current tab remains playable.

## Editing

## Teacher mode and assigned practice

From the title screen choose **Teacher mode** and enter the teacher code **2373**. The prompt appears each time you enter Teacher mode; it does not save an unlocked session. Student play, loading assigned quests, and continuing assigned quests do not require this code. This local convenience lock deters casual access; downloadable client-side code is inspectable, so it is not secure authentication against determined users. Use HTML basics, CSS basics, CSS selectors, or CSS layout presets, or pick a subject and specific topics yourself. Question depth ranges from basics to applied concepts to advanced; each level includes easier questions. Battle difficulty independently controls enemy strength. The original Start/Continue adventure retains its 20-question library and original balance, with its own saved journey.

**Generate focused practice** accepts descriptions such as “CSS class and ID selectors” or “HTML basics” and a count of 1–40. This offline generator uses built-in templates and a reviewed question library. It does not connect to an AI service or generate arbitrary topics. It varies examples, values, and answer ordering where supported; if a topic cannot supply the requested number of distinct questions, it reports the smaller number. Review the question list and optional editing section before assigning it.

**Import questions / assignment** accepts a downloaded assignment JSON, a JSON array of question objects, or CSV. Download the CSV template to see the headers. Use `HTML` or `CSS` in subject, four answer columns A–D, and a correct-answer letter A–D. Quote CSV fields that contain commas. JSON question objects use `topic`, `text`, `answers` (four strings), `correct` (0–3), and `explanation`. Importing questions adds them to your current selection; uncheck the library option to use only imported questions. Importing a full assignment restores its settings.

Save setup preserves your prepared question set locally. **Download assignment** creates a small JSON file for students. They open the game, choose **Load assigned quest**, and select that file. Assigned quests have their own **Continue assigned quest** save and cannot replace the original adventure save. Play this assignment also lets you try the setup yourself. Changing a topic does not remove imported questions; remove or edit those in the optional section.

Both project and standalone versions include these controls. Actual Canva HTML import, file input, downloads, and local storage behavior remain unverified. Test them in your Canva preview before classroom publication. The teacher mode verification report separates JavaScript checks from browser checks.

## Source files

- `questions.js`: 20 HTML/CSS questions, answer choices, correct index, and explanations.
- `characters.js`: hero names, stats, original artwork viewports, and the animation renderer.
- `game.js`: encounters, damage, rewards, progression, and save validation.
- `teacher.js`: topic library, assignment setup, CSV/JSON import/export, and validation.
- `generator.js`: offline guided question generation.
- `styles.css`: responsive wood-and-parchment UI and combat effects.
- `assets/hero-sheet.webp`: lossless optimized original supplied fantasy sheet. Four heroes are rendered directly from this image without regenerating them.
- `assets/forest.webp`: background derived from the supplied mockup using the built-in image generation tool. Prompt: remove all characters and interface from the mockup, retaining its colorful fantasy forest, castle, mountains, waterfall, stream, rocks, sky, and open dirt path.
- `assets/enemies.webp`: new enemy sheet made with the built-in image generation tool. Prompt: four chibi fantasy enemies—briar imp, thornfang wolf, runebark sentinel, and Forest Guardian—with dark outlines, shaded fantasy details, no UI or text, and transparent background.

The four chosen heroes are Thorin (axe dwarf), Brom (hammer dwarf), Lira (brown-haired elf archer), and Seren (white-haired blue-robed mage). The supplied sheets contain static character variants, so Version 1 uses static poses with idle/attack/hurt/defeat motion plus traveling arrows, fireballs, spell impacts, and melee effects. They are not fabricated walking animation sheets.

To add real animation sheets, replace a hero’s `image`, remove `crop`, define `frameWidth`, `frameHeight`, `columns`, and fill `states` with frame indices and fps. The renderer supports idle/walk/attack/hurt/victory/defeat independently of combat logic. Victory and defeat are also represented by game phase. Future map movement can call the same walk state.

## Portability and accessibility

System fonts, local assets, responsive layout, visible keyboard focus, live answer feedback, optional sound, and reduced-motion support. No external fonts, tracking, remote fetches, or dependencies. Functional browser checks are recorded in `TEST-REPORT.md`. This was browser-tested on Windows; physical Chromebook and Canva checks remain deployment-specific.
