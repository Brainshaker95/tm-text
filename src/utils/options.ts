import { SYNTAX } from './syntax';

import type { Syntax } from './syntax';

export interface TokenizeOptions {
  /**
   * Defines which games' syntax should be handled while parsing
   *
   * @default 'MANIAPLANET'
   */
  syntax: Syntax;
}

export interface HtmlifyOptions extends TokenizeOptions {
  /**
   * The scheme to use for for TokenKind `'LINK_EXTERNAL'` ($l) when none is set
   *
   * @default 'https'
   */
  scheme: 'http' | 'https';

  /**
   * The font that will be used to calculate character widths for width token kinds (`'WIDTH_NARROW' and 'WIDTH_WIDE'`).
   * Optionally an HTMLElement can be passed from which the required values will be extracted automatically.
   *
   * @default {
   *   family: 'Times New Roman',
   *   size: '16px',
   *   weight: 'normal',
   * }
   */
  font: HTMLElement | {
    family: string;
    size: string;
    weight: string;
  };

  /**
   * The player parameters used for TokenKind `'LINK_INTERNAL_WITH_PARAMS'` ($p).
   * Please note that these will only get applied when the syntax is set to `'FOREVER'`.
   */
  playerParameters: {
    /**
     * The player login
     *
     * @default null
     * @example 'jondoe'
     */
    playerlogin: string | null;

    /**
     * @default null
     * @example 'en'
     */
    lang: string | null;

    /**
     * @default null
     * @example '$w$s$f00jon$0f0doe'
     */
    nickname: string | null;

    /**
     * @default null
     * @example 'World|United States of America|California'
     */
    path: string | null;
  };
}

export type TmTextOptions = HtmlifyOptions;

export const withDefaultOptions = (options: Partial<TmTextOptions> = {}): TmTextOptions => ({
  syntax: SYNTAX.MANIAPLANET,
  scheme: 'https',
  font: {
    family: 'Times New Roman',
    size: '16px',
    weight: 'normal',
    ...options.font,
  },
  ...options,
  playerParameters: {
    playerlogin: null,
    lang: null,
    nickname: null,
    path: null,
    ...options.playerParameters,
  },
});
