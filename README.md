<p align="center">
  <img src="/.github/images/banner.png?sanitize=true" height="100">
</p>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/theca11/whack-a-mole/master?label=%20&color=green" />
  <a href="https://apps.elgato.com/plugins/dev.theca11.whack-a-mole">
        <img src="https://img.shields.io/badge/Stream_Deck_store-gray?logo=elgato&logoColor=white&labelColor=1231ac&color=gray" alt="Stream Deck Store">
  </a>
  <a href="https://discord.gg/yFce5NEDak">
        <img src="https://img.shields.io/badge/Discord-gray?logo=discord&logoColor=white&labelColor=6A7EC2&color=gray" alt="Discord Support">
  </a>
  <a href="https://ko-fi.com/the_ca11">
        <img src="https://img.shields.io/badge/Ko--fi-gray?logo=kofi&logoColor=white&labelColor=red&color=gray" alt="Ko-fi donate">
  </a>
</p>

<hr/>

Whack-A-Mole plugin for Elgato Stream Deck lets you play the popular game.

## Game Instructions
The goal is to whack as many moles as possible before the time runs out.

There are 3 types of moles: regular moles add 1 to the score, shy moles add 2 since they're harder to spot, and miner moles substract 1 because they have protective helmets! In endless mode the same applies when adding seconds to the timer.

How to:
- **Whack**: press the key with the mole to whack it
- **Start**: press to start game, long press to cancel an ongoing game
- **Set Difficulty/timer**: press to change game length (5s/10s/20s/30s/endless), long press to change game difficulty (easy/normal/hard/custom)
- **Show Score**: press to toggle between last and top score for the current difficulty/length

### Custom Difficulty Level
A custom difficulty level can be configured and selected. To do so, click on any of the plugin's keys and open the external window using the provided link. You'll find there some input fields. The values to input refer to the min and max time in milliseconds that a mole can peep for. Lower values mean faster moving moles. For reference, the normal difficulty level settings are 650-950

### Top Scores
Top scores for every difficulty/mode are saved so you can try to beat them. You can view your top scores either by pressing the score key, which toggles between last score and top score, or by opening the external window linked in the keys configuration

## Installation

### Installation from Stream Deck store (recommended)

Go to the [Stream Deck store plugin page](https://apps.elgato.com/plugins/dev.theca11.whack-a-mole) and click the `Install` button. Stream Deck will prompt for installation confirmation.

### Installation from Github release

Go to the [releases page](https://github.com/theca11/whack-a-mole/releases) and choose your desired version. In the `Assets` section at the end of the release post you will find a file `Whack-A-Mole-Plugin-v#.#.#.streamDeckPlugin`. Download it and double-click it to make Stream Deck prompt for installation confirmation.

Alternatively, you can download the zipped build folder also found in the release `Assets` (`Whack-A-Mole-Plugin-v#.#.#.zip`), extract it, and copy/paste the folder `dev.theca11.whack-a-mole.streamDeckPlugin` to the corresponding Stream Deck Plugins directory (for Windows located at `%APPDATA%\Elgato\StreamDeck\Plugins`).

> Official Elgato docs on installing/uninstalling plugins [here](https://help.elgato.com/hc/en-us/articles/11434818801293-Elgato-Stream-Deck-How-to-Install-and-Uninstall-Stream-Deck-Plugins-).


## FAQ

**> How can I report an issue, make a feature request or get general help?**

Use [Github](https://github.com/theca11/whack-a-mole/issues) for unexpected issues and feature requests, or join the [Discord server](https://discord.gg/yFce5NEDak) to ask general questions and get help.


**> I'm using your plugin and I love it! How can I show appreciation?**

You can stop by Discord to share your love. If you want to support the project financially, you can [buy me a coffee](https://ko-fi.com/the_ca11).