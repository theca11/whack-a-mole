# CHANGELOG

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [1.0.1] - 2023-09-30

### Fixed

- Added actions to action list so the plugin can be uninstalled from there.
- Properly set/reset actions state/title when they appear.

## [1.0.0] - 2023-09-28

First release of Whack-A-Mole Stream Deck plugin, which lets you play the popular game.

The goal is to whack as many moles as possible before the time runs out.

There are 3 types of moles: regular moles add 1 to the score, shy moles add 2 since they're harder to spot, and miner moles substract 1 because they have protective helmets! In endless mode the same applies when adding seconds to the timer.

**How to**
- **Whack**: press the key with the mole to whack it
- **Start**: press to start game, long press to cancel an ongoing game
- **Set Difficulty/timer**: press to change game length (5s/10s/20s/30s/endless), long press to change game difficulty (easy/normal/hard/custom)
- **Show Score**: press to toggle between last and top score for the current difficulty/length

**Custom Difficulty Level**

A custom difficulty level can be configured and selected. To do so, click on any of the plugin's keys and open the external window using the provided link. You'll find there some input fields. The values to input refer to the min and max time in milliseconds that a mole can peep for. Lower values mean faster moving moles. For reference, the normal difficulty level settings are 650-950

**Top Scores**

Top scores for every difficulty/mode are saved so you can try to beat them. You can view your top scores either by pressing the score key, which toggles between last score and top score, or by opening the external window linked in the keys configuration