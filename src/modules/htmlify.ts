import { objectEntries } from '../utils/object-entries';
import { withDefaultOptions } from '../utils/options';
import { SYNTAX, TOKEN } from '../utils/syntax';

import {
  isCssKind,
  isLinkKind,
  isWidthKind,
  tokenize,
} from './tokenize';

import type { HtmlifyOptions } from '../utils/options';
import type { LinkTokenKind, Token } from '../utils/syntax';

interface BlockState {
  linkKind: LinkTokenKind | false;
  linkHref: string | false;
  [TOKEN.BOLD]: boolean;
  [TOKEN.COLOR]: string | false;
  [TOKEN.ITALIC]: boolean;
  [TOKEN.SHADOW]: boolean;
  [TOKEN.UPPERCASE]: boolean;
  [TOKEN.WIDTH_NARROW]: boolean;
  [TOKEN.WIDTH_NORMAL]: boolean;
  [TOKEN.WIDTH_WIDE]: boolean;
}

interface Attributes {
  class?: string;
  href?: string;
  style?: string;
}

interface Word {
  content: string;
  blockState: BlockState;
}

export const KIND_TO_CSS_MAP: Readonly<Partial<Record<keyof BlockState, string>>> = {
  [TOKEN.BOLD]: 'font-weight:700',
  [TOKEN.COLOR]: 'color:<value>',
  [TOKEN.ITALIC]: 'font-style:italic',
  [TOKEN.SHADOW]: 'text-shadow:1px 1px 1px #000',
  [TOKEN.UPPERCASE]: 'text-transform:uppercase',
  [TOKEN.WIDTH_NARROW]: 'display:inline-block;margin-right:<value>;transform:scaleX(0.64);transform-origin:0 100%',
  [TOKEN.WIDTH_WIDE]: 'display:inline-block;margin-right:<value>;transform:scaleX(1.57);transform-origin:0 100%',
};

const createTag = (tagName: string, content: string, attributes: Attributes): string => {
  let output = `<${tagName}`;

  objectEntries(attributes).forEach(([key, value]) => {
    if (value?.length) {
      output += ` ${key}="${value}"`;
    }
  });

  output += `>${content}</${tagName}>`;

  return output;
};

const hasNextWordSameState = (
  word: Word,
  nextWord: Word | undefined,
): nextWord is Word => !objectEntries(word.blockState).some(([key, value]) => nextWord?.blockState[key] !== value);

const getCharWidth = (char: string, font: string): number => {
  if (!(<unknown>document)) {
    throw new Error('A document must be available to htmlify width tags.');
  }

  const context = document.createElement('canvas').getContext('2d');

  if (!context) {
    return 0;
  }

  context.font = font;

  return context.measureText(char).width;
};

const getCanvasFont = (options: HtmlifyOptions): string => {
  if (!(<unknown>window)) {
    throw new Error('A window must be available to htmlify width tags.');
  }

  let family: string;
  let size: string;
  let weight: string;

  if (options.font instanceof HTMLElement) {
    const computedStyle = window.getComputedStyle(options.font);

    family = computedStyle.fontFamily || 'Times New Roman';
    size = computedStyle.fontSize || '16px';
    weight = computedStyle.fontWeight || 'normal';
  } else {
    ({ family, weight, size } = options.font);
  }

  return `${weight} ${size} ${family}`;
};

const renderWord = (content: string, blockState: BlockState, options: HtmlifyOptions): string => {
  const css: string[] = [];

  objectEntries(blockState).forEach(([key, value]) => {
    const cssForKind = KIND_TO_CSS_MAP[key];

    if (!cssForKind || key === 'linkKind' || key === 'linkHref') {
      return;
    }

    if (key === TOKEN.COLOR && typeof value === 'string') {
      css.push(cssForKind.replace('<value>', value));
    } else if (value) {
      if (key === TOKEN.WIDTH_NARROW) {
        const marginRight = -getCharWidth(content, getCanvasFont(options)) * 0.37;

        css.push(cssForKind.replace('<value>', `${marginRight.toFixed(3)}px`));
      } else if (key === TOKEN.WIDTH_WIDE) {
        const marginRight = getCharWidth(content, getCanvasFont(options)) * 0.57;

        css.push(cssForKind.replace('<value>', `${marginRight.toFixed(3)}px`));
      } else {
        css.push(cssForKind);
      }
    }
  });

  return createTag('span', content, {
    style: css.join(';'),
  });
};

const transformHref = (href: string, kind: LinkTokenKind, options: HtmlifyOptions): string => {
  if (kind === TOKEN.LINK_EXTERNAL) {
    return href.startsWith('http://') || href.startsWith('https://')
      ? href
      : `${options.scheme}://${href}`;
  }

  let theHref = href;

  if (options.syntax === SYNTAX.MANIAPLANET && !href.startsWith('maniaplanet://')) {
    theHref = `maniaplanet://${href}`;
  } else if (options.syntax !== SYNTAX.MANIAPLANET && !href.startsWith('tmtp://')) {
    theHref = `tmtp://${href}`;
  }

  if (options.syntax === SYNTAX.FOREVER && kind === TOKEN.LINK_INTERNAL_WITH_PARAMS) {
    const params = new URLSearchParams();

    objectEntries(options.playerParameters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    const queryString = params.toString();

    if (queryString.length) {
      theHref += `?${queryString}`;
    }
  }

  return theHref;
};

const getLinkedWords = (word: Word, startIndex: number, words: Word[]): Word[] => {
  const linkedWords = [word];

  for (let i = startIndex + 1; i <= words.length; i += 1) {
    const nextWord = words.at(i);

    if (!nextWord?.blockState.linkKind || nextWord.blockState.linkHref !== word.blockState.linkHref) {
      break;
    }

    linkedWords.push(nextWord);
  }

  return linkedWords;
};

export const htmlify = (input: string | Token[], options?: Partial<HtmlifyOptions>): string => {
  const opts = withDefaultOptions(options);
  const tokens = typeof input === 'string' ? tokenize(input, opts) : input;
  const words: Word[] = [];
  let currentWordContent = '';
  let currentLinkContent = '';
  let wordsToSkip = 0;
  let html = '';

  const blockStates: BlockState[] = [{
    linkKind: false,
    linkHref: false,
    [TOKEN.BOLD]: false,
    [TOKEN.COLOR]: false,
    [TOKEN.ITALIC]: false,
    [TOKEN.SHADOW]: false,
    [TOKEN.UPPERCASE]: false,
    [TOKEN.WIDTH_NARROW]: false,
    [TOKEN.WIDTH_NORMAL]: false,
    [TOKEN.WIDTH_WIDE]: false,
  }];

  tokens.forEach((token, index) => {
    const currentBlockState = blockStates.at(-1);

    if (!currentBlockState) {
      throw new Error('The blockStates array should at least contain one object');
    }

    if (token.kind === TOKEN.WORD) {
      words.push({
        content: token.content,
        blockState: { ...currentBlockState },
      });
    } else if (token.kind === TOKEN.BLOCK_START) {
      blockStates.push({ ...currentBlockState });
    } else if (token.kind === TOKEN.BLOCK_END) {
      if (blockStates.length > 1) {
        blockStates.pop();
      }
    } else if (isCssKind(token.kind)) {
      if (token.kind === TOKEN.COLOR) {
        currentBlockState.COLOR = token.content.replace('$', '#');
      } else if (isWidthKind(token.kind)) {
        currentBlockState.WIDTH_NORMAL = token.kind === TOKEN.WIDTH_NORMAL;
        currentBlockState.WIDTH_NARROW = token.kind === TOKEN.WIDTH_NARROW;
        currentBlockState.WIDTH_WIDE = token.kind === TOKEN.WIDTH_WIDE;
      } else {
        currentBlockState[token.kind] = !currentBlockState[token.kind];
      }
    } else if (token.kind === TOKEN.RESET_ALL || token.kind === TOKEN.RESET_COLOR) {
      currentBlockState.COLOR = false;

      if (token.kind === TOKEN.RESET_ALL) {
        currentBlockState.linkKind = false;
        currentBlockState.linkHref = false;
        currentBlockState.BOLD = false;
        currentBlockState.ITALIC = false;
        currentBlockState.SHADOW = false;
        currentBlockState.UPPERCASE = false;
      }
    } else if (isLinkKind(token.kind)) {
      if (currentBlockState.linkKind) {
        currentBlockState.linkKind = false;
        currentBlockState.linkHref = false;

        return;
      }

      const nextButOneToken = tokens.at(index + 2);

      if (nextButOneToken?.kind === TOKEN.HREF_CONTENT) {
        currentBlockState.linkHref = nextButOneToken.content;
      }

      currentBlockState.linkKind = token.kind;
    }
  });

  words.forEach((word, index) => {
    if (!word.blockState.linkKind) {
      if (hasNextWordSameState(word, words.at(index + 1))) {
        currentWordContent += word.content;
      } else {
        html += renderWord(currentWordContent + word.content, word.blockState, opts);
        currentWordContent = '';
      }

      return;
    }

    if (wordsToSkip > 0) {
      wordsToSkip -= 1;

      return;
    }

    const linkedWords = getLinkedWords(word, index, words);
    const linkHref = word.blockState.linkHref || linkedWords.reduce((acc, { content }) => acc + content, '');

    const linkHtml = linkedWords.reduce((result, linkedWord, i) => {
      if (hasNextWordSameState(word, linkedWords.at(i + 1))) {
        currentLinkContent += linkedWord.content;

        return result;
      }

      let theResult = result;

      theResult += renderWord(currentLinkContent + linkedWord.content, linkedWord.blockState, opts);
      currentLinkContent = '';

      return theResult;
    }, '');

    wordsToSkip = linkedWords.length - 1;

    html += createTag('a', linkHtml, {
      href: transformHref(linkHref, word.blockState.linkKind, opts),
    });
  });

  return html;
};

export default htmlify;
