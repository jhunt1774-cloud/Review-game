# Follower movement correction

Each hero has its own position sampled along the leader's walked trail. Spacing is approximately 58 world pixels regardless of camera scale, and each hero turns according to its own section of the path. The whole party's length is never a collision box: only the leader's foot position is checked against terrain. Followers retrace valid footsteps.

Narrow-path steering now assists movement along a bend when the requested direction has a component along the road. It cannot jump across terrain and remains limited to normal walking speed. Forest bridge boundaries remain narrow and follow its deck.

The old forest-path-standalone.html entry now opens the current index.html beside it. Keep index.html, all scripts and assets together; that entry is no longer a self-contained game download. A backup of the former standalone file remains in work/legacy-standalone-before-corridor-fix.html locally.

Upload all package contents to the repository root, replacing matching files. For local use, refresh the old entry or open index.html in the same project folder.

Automated checks passed for follower turns, four directional sheets, narrow diagonal corridor movement, bridge boundaries and the full campaign. Live visual behavior on a Chromebook remains to be checked.
