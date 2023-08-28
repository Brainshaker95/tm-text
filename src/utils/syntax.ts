export const TOKEN = <const>{
  BLOCK_END: 'BLOCK_END',
  BLOCK_START: 'BLOCK_START',
  BOLD: 'BOLD',
  COLOR: 'COLOR',
  HREF_CONTENT: 'HREF_CONTENT',
  HREF_START: 'HREF_START',
  HREF_END: 'HREF_END',
  ITALIC: 'ITALIC',
  LINK_EXTERNAL: 'LINK_EXTERNAL',
  LINK_INTERNAL: 'LINK_INTERNAL',
  LINK_INTERNAL_WITH_PARAMS: 'LINK_INTERNAL_WITH_PARAMS',
  NEWLINE: 'NEWLINE',
  RESET_ALL: 'RESET_ALL',
  RESET_COLOR: 'RESET_COLOR',
  SHADOW: 'SHADOW',
  TAB: 'TAB',
  UPPERCASE: 'UPPERCASE',
  WIDTH_NARROW: 'WIDTH_NARROW',
  WIDTH_NORMAL: 'WIDTH_NORMAL',
  WIDTH_WIDE: 'WIDTH_WIDE',
  WORD: 'WORD',
};

export type TokenKind = typeof TOKEN[keyof typeof TOKEN];

export type BlockTokenKind = typeof TOKEN.BLOCK_END
  | typeof TOKEN.BLOCK_START;

export type CssTokenKind = typeof TOKEN.BOLD
  | typeof TOKEN.COLOR
  | typeof TOKEN.ITALIC
  | typeof TOKEN.SHADOW
  | typeof TOKEN.UPPERCASE
  | typeof TOKEN.WIDTH_NARROW
  | typeof TOKEN.WIDTH_NORMAL
  | typeof TOKEN.WIDTH_WIDE;

export type HrefTokenKind = typeof TOKEN.HREF_CONTENT
  | typeof TOKEN.HREF_END
  | typeof TOKEN.HREF_START;

export type LinkTokenKind = typeof TOKEN.LINK_EXTERNAL
  | typeof TOKEN.LINK_INTERNAL
  | typeof TOKEN.LINK_INTERNAL_WITH_PARAMS;

export type ResetTokenKind = typeof TOKEN.RESET_ALL
  | typeof TOKEN.RESET_COLOR;

export type WidthTokenKind = typeof TOKEN.WIDTH_NARROW
  | typeof TOKEN.WIDTH_NORMAL
  | typeof TOKEN.WIDTH_WIDE;

export type PrefixedTokenKind =
  Exclude<TokenKind, HrefTokenKind | typeof TOKEN.NEWLINE | typeof TOKEN.TAB | typeof TOKEN.WORD>;

export type SingleCharTokenKind = Exclude<TokenKind,
  typeof TOKEN.COLOR | typeof TOKEN.HREF_CONTENT | typeof TOKEN.NEWLINE | typeof TOKEN.TAB | typeof TOKEN.WORD
>;

export interface Token {
  /**
   * The kind of the token
   */
  kind: TokenKind;

  /**
   * The content of the token
   */
  content: string;

  /**
   * The position of the token
   */
  pos: {
    /**
     * The start position of the token
     */
    start: number;

    /**
     * The end position of the token
     */
    end: number;
  };
}

export const TOKEN_TO_CHAR_MAP: Readonly<Record<SingleCharTokenKind, string>> = {
  [TOKEN.BLOCK_END]: '>',
  [TOKEN.BLOCK_START]: '<',
  [TOKEN.BOLD]: 'o',
  [TOKEN.HREF_START]: '[',
  [TOKEN.HREF_END]: ']',
  [TOKEN.ITALIC]: 'i',
  [TOKEN.LINK_EXTERNAL]: 'l',
  [TOKEN.LINK_INTERNAL]: 'h',
  [TOKEN.LINK_INTERNAL_WITH_PARAMS]: 'p',
  [TOKEN.RESET_ALL]: 'z',
  [TOKEN.RESET_COLOR]: 'g',
  [TOKEN.SHADOW]: 's',
  [TOKEN.UPPERCASE]: 't',
  [TOKEN.WIDTH_NARROW]: 'n',
  [TOKEN.WIDTH_NORMAL]: 'm',
  [TOKEN.WIDTH_WIDE]: 'w',
};

export type Syntax = typeof SYNTAX[keyof typeof SYNTAX];

export const SYNTAX = <const>{
  /**
   * Games that use this syntax: `Original`, `Sunrise`, `Nations`
   */
  CLASSIC: 'CLASSIC',

  /**
   * Games that use this syntax: `United`
   */
  UNITED: 'UNITED',

  /**
   * Games that use this syntax: `United Forever`, `Nations Forever`
   */
  FOREVER: 'FOREVER',

  /**
   * Games that use this syntax: `Maniapanet`, `Turbo`, `2020`
   */
  MANIAPLANET: 'MANIAPLANET',
};

export const SYNTAX_CLASSIC = <const>[
  TOKEN.COLOR,
  TOKEN.ITALIC,
  TOKEN.RESET_ALL,
  TOKEN.RESET_COLOR,
  TOKEN.NEWLINE,
  TOKEN.SHADOW,
  TOKEN.TAB,
  TOKEN.UPPERCASE,
  TOKEN.WIDTH_NARROW,
  TOKEN.WIDTH_NORMAL,
  TOKEN.WIDTH_WIDE,
  TOKEN.WORD,
];

export const SYNTAX_UNITED = <const>[
  ...SYNTAX_CLASSIC,
  TOKEN.BOLD,
  TOKEN.HREF_CONTENT,
  TOKEN.HREF_START,
  TOKEN.HREF_END,
  TOKEN.LINK_EXTERNAL,
  TOKEN.LINK_INTERNAL,
];

export const SYNTAX_FOREVER = <const>[
  ...SYNTAX_UNITED,
  TOKEN.LINK_INTERNAL_WITH_PARAMS,
];

export const SYNTAX_MANIAPLANET = <const>[
  ...SYNTAX_FOREVER,
  TOKEN.BLOCK_END,
  TOKEN.BLOCK_START,
];

export const SYNTAX_MAP: Readonly<Record<Syntax, readonly TokenKind[]>> = {
  [SYNTAX.CLASSIC]: SYNTAX_CLASSIC,
  [SYNTAX.UNITED]: SYNTAX_UNITED,
  [SYNTAX.FOREVER]: SYNTAX_FOREVER,
  [SYNTAX.MANIAPLANET]: SYNTAX_MANIAPLANET,
};
