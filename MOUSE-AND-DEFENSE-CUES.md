# Mouse movement and timed enemy cues

Click an open road to walk there using the road network. The party still follows individually. WASD, arrow keys or touch directions immediately cancel the click route and take over. Clicks cannot teleport, cross impassable terrain or bypass the boss passage.

Defense uses enemy windup and a brief attack flash instead of a sliding meter. The upcoming action is shown as Block, Dodge or Parry. Click the matching defense button, or use Space/B for Block, D for Dodge, P for Parry. Timing windows are narrower and each beat varies its windup duration. Early/late inputs and wrong actions cause damage. Held keyboard input and immediate multi-click spam cannot clear a sequence automatically.

Assisted practice remains explicitly available in Sound & movement for accessibility; reduced-motion settings alone no longer disable timing. Timing changes do not change question review or attack damage rules.

Upload all contents, including mouse-navigation.js, to the repository root and replace matching files. Includes previous defense reactions, follower movement, path fixes and chapters.

Automated checks cover click-route traversal, arrival and barriers, mixed mouse/keyboard defense sequences, early/missed/wrong input, spam protection and cleanup. Full campaign uses assisted input for progression checks. Actual cue readability and reaction timing still need testing on school Chromebooks.
