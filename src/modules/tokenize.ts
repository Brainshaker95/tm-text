import { objectEntries } from '../utils/object-entries';
import { withDefaultOptions } from '../utils/options';
import { SYNTAX_MAP, TOKEN, TOKEN_TO_CHAR_MAP } from '../utils/syntax';

import type { TokenizeOptions } from '../utils/options';
import type {
  CssTokenKind,
  HrefTokenKind,
  LinkTokenKind,
  PrefixedTokenKind,
  SingleCharTokenKind,
  Token,
  TokenKind,
  WidthTokenKind,
} from '../utils/syntax';

export const isWidthKind = (
  kind: TokenKind | undefined,
): kind is WidthTokenKind => kind === TOKEN.WIDTH_NARROW
  || kind === TOKEN.WIDTH_NORMAL
  || kind === TOKEN.WIDTH_WIDE;

export const isCssKind = (
  kind: TokenKind | undefined,
): kind is CssTokenKind => isWidthKind(kind)
  || kind === TOKEN.BOLD
  || kind === TOKEN.COLOR
  || kind === TOKEN.ITALIC
  || kind === TOKEN.SHADOW
  || kind === TOKEN.UPPERCASE;

export const isHrefKind = (
  kind: TokenKind | undefined,
): kind is HrefTokenKind => kind === TOKEN.HREF_CONTENT
  || kind === TOKEN.HREF_END
  || kind === TOKEN.HREF_START;

export const isLinkKind = (
  kind: TokenKind | undefined,
): kind is LinkTokenKind => kind === TOKEN.LINK_EXTERNAL
  || kind === TOKEN.LINK_INTERNAL
  || kind === TOKEN.LINK_INTERNAL_WITH_PARAMS;

export const isKindWithPrefix = (kind: TokenKind): kind is PrefixedTokenKind => !isHrefKind(kind)
  && kind !== TOKEN.WORD;

export const getKindByChar = (
  char: string,
): SingleCharTokenKind | undefined => objectEntries(TOKEN_TO_CHAR_MAP)
  .find(([, c]) => c === char.toLowerCase())?.[0];

export const getColor = (
  input: string,
  firstCharIndex: number,
): string => input.substring(firstCharIndex, firstCharIndex + 3);

export const isColor = (
  input: string,
  firstCharIndex: number,
): boolean => !!getColor(input, firstCharIndex).match(/[0-9a-f]{3}/i);

export const extractWords = (tokens: Token[]): Token[] => tokens.filter(({ kind }) => kind === TOKEN.WORD);

export const stringifyTokens = (tokens: Token[]): string => tokens.map(({ content }) => content).join('');

export const initTokens = (input: string, options: TokenizeOptions): {
  add: (kind: TokenKind, content: string, charIndex: number) => void;
  addColor: (firstCharIndex: number) => void;
  addWord: (content: string, charIndex: number) => void;
  get: () => Token[];
} => {
  const tokens: Token[] = [];

  const addToken = (kind: TokenKind, content: string, charIndex: number): void => {
    const hasPrefix = isKindWithPrefix(kind);
    const prefixLength = hasPrefix ? 1 : 0;
    const previousToken = tokens.at(-1);
    let tokenKind = kind;

    if (!SYNTAX_MAP[options.syntax].includes(kind)
      || (isHrefKind(tokenKind) && !isHrefKind(previousToken?.kind) && !isLinkKind(previousToken?.kind))) {
      if (hasPrefix) {
        return;
      }

      tokenKind = TOKEN.WORD;
    }

    if (tokenKind === TOKEN.WORD && previousToken?.kind === TOKEN.WORD) {
      previousToken.content += content;
      previousToken.pos.end += 1;

      return;
    }

    tokens.push({
      kind: tokenKind,
      content: hasPrefix ? `$${content}` : content,
      pos: {
        start: charIndex - prefixLength,
        end: charIndex + content.length,
      },
    });
  };

  return {
    add: addToken,
    addColor: (firstCharIndex: number) => addToken(TOKEN.COLOR, getColor(input, firstCharIndex), firstCharIndex),
    addWord: (content: string, charIndex: number) => addToken(TOKEN.WORD, content, charIndex),
    get: () => tokens,
  };
};

export const findNextHrefEndIndex = (input: string, startIndex: number): number | null => {
  const index = input
    .split('')
    .findIndex((char, i) => i > startIndex && char === TOKEN_TO_CHAR_MAP.HREF_END);

  return index > -1
    ? index
    : null;
};

export const tokenize = (input: string, options?: Partial<TokenizeOptions>): Token[] => {
  const opts = withDefaultOptions(options);
  const tokens = initTokens(input, opts);
  let charsToSkip = 0;
  let previousCharIsDollar = false;

  input.split('').forEach((char, index) => {
    if (charsToSkip > 0) {
      charsToSkip -= 1;

      return;
    }

    if (char === '$') {
      if (previousCharIsDollar) {
        tokens.addWord(char, index);
      }

      previousCharIsDollar = !previousCharIsDollar;

      return;
    }

    if (previousCharIsDollar) {
      previousCharIsDollar = false;
    } else {
      tokens.addWord(char, index);

      return;
    }

    if (isColor(input, index)) {
      tokens.addColor(index);

      charsToSkip = 2;

      return;
    }

    const kind = getKindByChar(char);

    if (!kind) {
      return;
    }

    tokens.add(kind, char, index);

    if (!isLinkKind(kind)) {
      return;
    }

    const nextChar = input.at(index + 1);

    if (nextChar !== TOKEN_TO_CHAR_MAP.HREF_START) {
      return;
    }

    tokens.add(TOKEN.HREF_START, nextChar, index + 1);

    const hrefEndIndex = findNextHrefEndIndex(input, index);

    if (!hrefEndIndex) {
      return;
    }

    const href = input.substring(index + 2, hrefEndIndex);
    const sanitizedHref = stringifyTokens(extractWords(tokenize(href)));

    tokens.add(TOKEN.HREF_CONTENT, sanitizedHref, index + 2);
    tokens.add(TOKEN.HREF_END, TOKEN_TO_CHAR_MAP.HREF_END, hrefEndIndex);

    charsToSkip += href.length + 2;
  });

  return tokens.get();
};

export default tokenize;
