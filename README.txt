CONNECTED JOURNEY + MASTER WORLD MAP — October 24, 2026

UPLOAD TO YOUR EXISTING Review-game REPOSITORY
Unzip first. Replace these EIGHT files in the repository root together:
  index.html
  game.js
  styles.css
  story-pacing.js
  journey-guide.js
  authored-floors.js
  navigation-floors.js
  integrated-map-art.js
Copy the SEVEN files from this package assets folder into your existing assets folder. Keep your other game files, sound effects and music. This is an update for the existing game, not a standalone game.
Wait for GitHub Pages to publish, then refresh with Ctrl+F5.
Uploading only the ZIP to GitHub does not update the game.
This ZIP includes the prior entrance, Clockwork/Asterfall and compact battle updates; use this newer package instead of reapplying those older packages afterward.

WHAT PLAYERS GET
A World map button opens one connected country containing all ten existing regions/destinations. Current location, restored places and next story stop are marked. Select a place to see why it matters.
A small gold arrow points along a reachable local route toward the next required task. A diamond marks the task itself. Mechanisms, guardians, the miners escort and the return trail update the cue as progress is made.
Main story encounters follow a consistent order. Optional fights and contracts remain available but cannot seal regional gates.
Press E at a visible destination gateway to cross with a short transition; there is no second confirmation. Passing a gateway does not enter it.
Regional victories return to the cleared trail. Follow the onward road marker and press E to enter the next region, with the connection explained briefly. Revisited regions remain available through the region selector.
Earlier saves and already completed encounters keep their credit. Missing earlier story stops receive a return-road cue.
Teacher Playtest keeps its ability to inspect any area or battle directly.

WORLD AND LEVEL DESIGN
Read WORLD-AND-LEVEL-PLAN.md. WORLD-LAYOUT.json records the world locations, development bounds, road connections and ordered campaign. The map is a foundation for future level development.
This update does not repaint every local level or merge their collision grids into a single continuously streamed map. Existing tested local maps remain connected through their entrances and onward roads.

REVIEW MATERIAL — NO NEED TO UPLOAD
World-map-preview.png, Entrances-preview.png, Clockwork-preview.png, WORLD-AND-LEVEL-PLAN.md, WORLD-LAYOUT.json, ART-PROMPTS.txt, TEST-REPORT.txt, README.txt and SHA256SUMS.txt.

TESTING
Automated checks passed for 25 campaign milestones, 42 reachable story routes, all ten navigation maps, boss gates, followers, five destination quests/returns, teacher controls and isolated saves. Direct destination crossings, regional road travel, optional battle freedom, old-save recovery, atlas movement pause and saved victory return were checked.
The map painting and labeled preview were visually inspected. No live browser or Chromebook gameplay/performance check was performed. No deployment was performed.
