import { withDefaultOptions } from '../utils/options';
import { TOKEN } from '../utils/syntax';

import { tokenize } from './tokenize';

import type { TokenizeOptions } from '../utils/options';
import type { Token } from '../utils/syntax';

export interface Block {
  startIndex: number;
  endIndex: number;
  tokens: Token[];
}

export const blockify = (input: string | Token[], options?: Partial<TokenizeOptions>): Block[] => {
  const opts = withDefaultOptions(options);
  const tokens = typeof input === 'string' ? tokenize(input, opts) : input;
  const openBlockIndices: number[] = [];
  const blocks: Block[] = [];

  tokens.forEach((token, index) => {
    if (token.kind === TOKEN.BLOCK_START) {
      openBlockIndices.push(index);
    } else if (token.kind === TOKEN.BLOCK_END || index === tokens.length - 1) {
      const startIndex = openBlockIndices.at(-1);

      if (startIndex === undefined) {
        return;
      }

      blocks.push({
        startIndex,
        endIndex: index,
        tokens: tokens.filter((_, i) => i >= startIndex && i <= index),
      });

      openBlockIndices.pop();
    }
  });

  blocks.sort((block1, block2) => (block1.startIndex < block2.startIndex ? 1 : -1));

  blocks.push({
    startIndex: 0,
    endIndex: tokens.length - 1,
    tokens,
  });

  blocks.forEach((block, index) => {
    const tokenStartPositions = block.tokens.reduce<number[]>((positions, token) => {
      positions.push(token.pos.start);

      return positions;
    }, []);

    blocks.forEach((otherBlock, otherBlockIndex) => {
      if (index === otherBlockIndex) {
        return;
      }

      otherBlock.tokens = otherBlock.tokens.filter(
        (token) => !tokenStartPositions.includes(token.pos.start),
      );
    });
  });

  blocks.sort(
    (block1, block2) => ((block1.tokens.at(0)?.pos.start || 1) > (block2.tokens.at(0)?.pos.start || 1) ? 1 : -1),
  );

  return blocks;
};
