<div id="top"></div>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

# tmText

Trackmania and Maniaplanet text parser and formatter

*[☄️ Bug reports / feature requests »][issues-url]*

<br>

## Table Of Contents

<!-- NOTICE: all anchors must not include the emoji to work on github, the ❤️ some reason must be url encoded though -->
* [👋 About The Project](#-about-the-project)
* [🚀 Installation](#-installation)
* [👀 Usage](#-usage)
* [👍 Supported Tokens](#-supported-tokens)
* [💻 Development](#-development)
* [❤️ Contributing](#%EF%B8%8F-contributing)
* [⭐ License](#-license)
* [🌐 Acknowledgments](#-acknowledgments)

<p align="right"><a href="#top" title="Back to top">&nbsp;&nbsp;&nbsp;⬆&nbsp;&nbsp;&nbsp;</a></p>

## 👋 About The Project

This project aims to provide a simple interface for parsing and formatting text of Trackmania and Maniaplanet games.

<q>Text formatting and colour codes in TrackMania and ManiaPlanet can be used for players' nicknames, track names and comments, music file comments, server names and comments, and in-game online chats.</q>  
-- <cite>https://wiki.xaseco.org/wiki/Text_formatting</cite>

Given an input text of:  
<samp>$f00R$fa2a$ff3i$0f0n$06fb$30fo$60fw</samp>  
this library produces the following HTML output:  
<span style="color: #ff0000;">R</span><span style="color: #ffaa22;">a</span><span style="color: #ffff33;">i</span><span style="color: #00ff00;">n</span><span style="color: #0066ff;">b</span><span style="color: #3300ff;">o</span><span style="color: #6600ff;">w</span>

<p align="right"><a href="#top" title="Back to top">&nbsp;&nbsp;&nbsp;⬆&nbsp;&nbsp;&nbsp;</a></p>

## 🚀 Installation

**Yarn**
```shell
yarn add tm-text
```

**NPM**
```shell
npm i tm-text
```

<p align="right"><a href="#top" title="Back to top">&nbsp;&nbsp;&nbsp;⬆&nbsp;&nbsp;&nbsp;</a></p>

## 👀 Usage

tmText can be used as an ES module as well as a CommonJS module:

**ESM**
```js
import tmText from 'tm-text';
// or
import { tmText } from 'tm-text';
```

**CommonJS**
```js
const { tmText } = require('tm-text');
// or
const tmText = require('tm-text').default;
// or
const { default: tmText } = require('tm-text');
```

From now on only the ES module syntax will be shown.

**Member functions**
```js
import tmText from 'tm-text';

const text = tmText('$s$00dFl$24fas$26fh$24fba$00dck');

// Input string without special tokens ('Flashback')
console.log(text.humanize());

// HTML string with applied styles
console.log(text.htmlify());

// Array of tokens of the input string
console.log(text.tokenize());

// Array of blocks of the input string
console.log(text.blockify());
```

**Exported functions**
```js
import {
  blockify,
  htmlify,
  humanize,
  tokenize,
} from 'tm-text';

const text = '$s$00dFl$24fas$26fh$24fba$00dck';

// Input string without special tokens ('Flashback')
console.log(humanize(text));

// HTML string with applied styles
console.log(htmlify(text));

// Array of tokens of the input string
console.log(tokenize(text));

// Array of blocks of the input string
console.log(blockify(text));
```

<p align="right"><a href="#top" title="Back to top">&nbsp;&nbsp;&nbsp;⬆&nbsp;&nbsp;&nbsp;</a></p>

## 👍 Supported Tokens

|Token|Description|
|-|-|
|<samp>$000</samp> - <samp>$fff</samp>|Any color code that matches this pattern: `\$[a-f0-9]{3}/i`|
|<samp>$o</samp>|Bold text|
|<samp>$i</samp>|Italic text|
|<samp>$t</samp>|Uppercase text|
|<samp>$s</samp>|Text shadow|
|<samp>$m</samp>|Normal text width|
|<samp>$n</samp>|Narrow text width|
|<samp>$w</samp>|Wide text width|
|<samp>$g</samp>|Reset color to default|
|<samp>$z</samp>|Reset text to default|
|<samp>$h</samp>|Internal Link|
|<samp>$p</samp>|Internal Link with player parameters|
|<samp>$l</samp>|External Link|
|<samp>$&lt;</samp>|Opening block|
|<samp>$&gt;</samp>|Closing block|
|<samp>$$</samp>|Dollar character|

Please note that some of the behavior regarding block tags in conjuction with link tags will not be accurately represented by this library.  
See [these tests](./src/index.test.ts#L300) for a few examples of what this is referring to.

<p align="right"><a href="#top" title="Back to top">&nbsp;&nbsp;&nbsp;⬆&nbsp;&nbsp;&nbsp;</a></p>

## 💻 Development

Make sure to run `yarn` before attempting to run any of the commands listed below:

**Run tsc in watch mode**
```shell
yarn dev
```

**Run type checking**
```shell
yarn type-check
```

**Run linter**
```shell
yarn lint
```

**Run tests**
```shell
yarn test
```

**Build project**
```shell
yarn build
```

<p align="right"><a href="#top" title="Back to top">&nbsp;&nbsp;&nbsp;⬆&nbsp;&nbsp;&nbsp;</a></p>

## ❤️ Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch => `git checkout -b feature/my-new-feature`
3. Commit your Changes => `git commit -m 'feat(my-new-feature): add some awesome new feature'`
4. Push to the Branch => `git push origin feature/my-new-feature`
5. Open a Pull Request

<p align="right"><a href="#top" title="Back to top">&nbsp;&nbsp;&nbsp;⬆&nbsp;&nbsp;&nbsp;</a></p>

## ⭐ License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

<p align="right"><a href="#top" title="Back to top">&nbsp;&nbsp;&nbsp;⬆&nbsp;&nbsp;&nbsp;</a></p>

## 🌐 Acknowledgments

* [Maniaplanet Docs](https://doc.maniaplanet.com/client/text-formatting)
* [Mania Tech Wiki](https://wiki.xaseco.org/wiki/Text_formatting)
* [TypeScript](https://www.typescriptlang.org)
* [Jest](https://jestjs.io)
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template) by [othneildrew](https://github.com/othneildrew)
* [Choose an Open Source License](https://choosealicense.com)
* [Img Shields](https://shields.io)

<p align="right"><a href="#top" title="Back to top">&nbsp;&nbsp;&nbsp;⬆&nbsp;&nbsp;&nbsp;</a></p>

<!-- END OF CONTENT -->

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-url]: https://github.com/Brainshaker95/tm-text/graphs/contributors
[contributors-shield]: https://img.shields.io/github/contributors/Brainshaker95/tm-text.svg?style=flat-square

[forks-url]: https://github.com/Brainshaker95/tm-text/network/members
[forks-shield]: https://img.shields.io/github/forks/Brainshaker95/tm-text.svg?style=flat-square

[stars-url]: https://github.com/Brainshaker95/tm-text/stargazers
[stars-shield]: https://img.shields.io/github/stars/Brainshaker95/tm-text.svg?style=flat-square

[issues-url]: https://github.com/Brainshaker95/tm-text/issues
[issues-shield]: https://img.shields.io/github/issues/Brainshaker95/tm-text.svg?style=flat-square

[license-url]: https://github.com/Brainshaker95/tm-text/blob/master/LICENSE
[license-shield]: https://img.shields.io/github/license/Brainshaker95/tm-text.svg?style=flat-square
