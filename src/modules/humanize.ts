import { TOKEN } from '../utils/syntax';

import { stringifyTokens, tokenize } from './tokenize';

import type { TokenizeOptions } from '../utils/options';
import type { Token } from '../utils/syntax';

export const humanize = (input: string | Token[], options?: Partial<TokenizeOptions>): string => {
  const tokens = typeof input === 'string' ? tokenize(input, options) : input;

  return stringifyTokens(tokens.filter(({ kind }) => kind === TOKEN.NEWLINE
    || kind === TOKEN.TAB
    || kind === TOKEN.WORD));
};

export default humanize;
