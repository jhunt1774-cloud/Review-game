# Teacher mode verification

Automated JavaScript checks with a simulated document and storage:

- PASS: Teacher access stays closed before a code is entered
- PASS: Incorrect teacher code cannot open Teacher mode
- PASS: Code 2373 unlocks Teacher mode and is cleared
- PASS: Returning to title requires the teacher code again
- PASS: Original adventure still uses 20 questions
- PASS: HTML basics preset contains only HTML basics
- PASS: CSS selectors preset excludes other topics
- PASS: Generator produces 10 distinct CSS selector questions
- PASS: Challenge difficulty changes enemy HP, assigned save remains separate
- PASS: Assigned quest Continue restores lesson
- PASS: Standard Continue restores original adventure
- PASS: CSV import accepts quoted commas and correct-answer letters
- PASS: Malformed assignments rejected
- PASS: Unknown generator topics show a helpful message

Syntax checks passed for the game, teacher controls, and generator. Original V1 browser checks are in TEST-REPORT.md. Updated teacher mode visual/browser and Canva import verification could not be completed in this session: browser automation blocks file URLs.
