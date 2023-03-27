import { blockify } from './modules/blockify';
import { htmlify } from './modules/htmlify';
import { humanize } from './modules/humanize';
import { tokenize } from './modules/tokenize';

import type { Block } from './modules/blockify';
import type { TmTextOptions } from './utils/options';
import type { Token } from './utils/syntax';

export interface TmText {
  blockify: () => Block[];
  htmlify: () => string;
  humanize: () => string;
  tokenize: () => Token[];
}

export const tmText = (input: string, options?: Partial<TmTextOptions>): Readonly<TmText> => {
  const tokens = tokenize(input, options);

  return Object.freeze({
    blockify: () => blockify(tokens, options),
    htmlify: () => htmlify(tokens, options),
    humanize: () => humanize(tokens, options),
    tokenize: () => tokens,
  });
};

export * from './modules/blockify';
export * from './modules/htmlify';
export * from './modules/humanize';
export * from './modules/tokenize';
export * from './utils/options';
export * from './utils/syntax';

export default tmText;
