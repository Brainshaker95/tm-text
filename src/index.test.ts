/* eslint-disable max-len */

import { htmlify } from './modules/htmlify';
import { humanize } from './modules/humanize';
import { tokenize } from './modules/tokenize';
import { SYNTAX, SYNTAX_MAP, TOKEN } from './utils/syntax';

import { tmText } from './index';

import type { TmTextOptions } from './utils/options';
import type { Syntax } from './utils/syntax';

const MAIN_TEST_STRING = '$oLorem $wipsum $p[dolor]dolor$p $<$f00sit$> $samet\n\tconsectetur';

type Suite = 'exported' | 'member';

const runTestsForSyntax = (suite: Suite, syntax: Syntax): void => {
  const options: Partial<TmTextOptions> = {
    syntax,
  };

  const text = tmText(MAIN_TEST_STRING, options);

  describe(`tokenization for syntax "${syntax}"`, () => {
    const tokens = suite === 'member' ? text.tokenize() : tokenize(MAIN_TEST_STRING, options);

    it('should provide an array of correctly shaped tokens', () => {
      expect(Array.isArray(tokens)).toBe(true);

      tokens.forEach((token) => {
        expect(token).toHaveProperty('kind');
        expect(token).toHaveProperty('content');
        expect(token).toHaveProperty('pos.start');
        expect(token).toHaveProperty('pos.end');
        expect(Object.values(TOKEN)).toContain(token.kind);
        expect(typeof token.content).toBe('string');
        expect(token.content.length).toBeGreaterThan(0);
      });
    });

    it('should only contain tokens', () => {
      tokens.forEach((token) => {
        expect(Object.values(SYNTAX_MAP[syntax])).toContain(token.kind);
      });
    });

    it('should return the expected result', () => {
      if (syntax === SYNTAX.CLASSIC) {
        expect(tokens).toMatchObject([
          { kind: TOKEN.WORD, content: 'Lorem ', pos: { start: 2, end: 8 } },
          { kind: TOKEN.WIDTH_WIDE, content: '$w', pos: { start: 8, end: 10 } },
          { kind: TOKEN.WORD, content: 'ipsum [dolor]dolor ', pos: { start: 10, end: 25 } },
          { kind: TOKEN.COLOR, content: '$f00', pos: { start: 35, end: 39 } },
          { kind: TOKEN.WORD, content: 'sit ', pos: { start: 39, end: 43 } },
          { kind: TOKEN.SHADOW, content: '$s', pos: { start: 45, end: 47 } },
          { kind: TOKEN.WORD, content: 'amet', pos: { start: 47, end: 51 } },
          { kind: TOKEN.NEWLINE, content: ' ', pos: { start: 51, end: 52 } },
          { kind: TOKEN.TAB, content: ' ', pos: { start: 52, end: 53 } },
          { kind: TOKEN.WORD, content: 'consectetur', pos: { start: 53, end: 64 } },
        ]);
      } else if (syntax === SYNTAX.UNITED) {
        expect(tokens).toMatchObject([
          { kind: TOKEN.BOLD, content: '$o', pos: { start: 0, end: 2 } },
          { kind: TOKEN.WORD, content: 'Lorem ', pos: { start: 2, end: 8 } },
          { kind: TOKEN.WIDTH_WIDE, content: '$w', pos: { start: 8, end: 10 } },
          { kind: TOKEN.WORD, content: 'ipsum [dolor]dolor ', pos: { start: 10, end: 25 } },
          { kind: TOKEN.COLOR, content: '$f00', pos: { start: 35, end: 39 } },
          { kind: TOKEN.WORD, content: 'sit ', pos: { start: 39, end: 43 } },
          { kind: TOKEN.SHADOW, content: '$s', pos: { start: 45, end: 47 } },
          { kind: TOKEN.WORD, content: 'amet', pos: { start: 47, end: 51 } },
          { kind: TOKEN.NEWLINE, content: ' ', pos: { start: 51, end: 52 } },
          { kind: TOKEN.TAB, content: ' ', pos: { start: 52, end: 53 } },
          { kind: TOKEN.WORD, content: 'consectetur', pos: { start: 53, end: 64 } },
        ]);
      } else if (syntax === SYNTAX.FOREVER) {
        expect(tokens).toMatchObject([
          { kind: TOKEN.BOLD, content: '$o', pos: { start: 0, end: 2 } },
          { kind: TOKEN.WORD, content: 'Lorem ', pos: { start: 2, end: 8 } },
          { kind: TOKEN.WIDTH_WIDE, content: '$w', pos: { start: 8, end: 10 } },
          { kind: TOKEN.WORD, content: 'ipsum ', pos: { start: 10, end: 16 } },
          { kind: TOKEN.LINK_INTERNAL_WITH_PARAMS, content: '$p', pos: { start: 16, end: 18 } },
          { kind: TOKEN.HREF_START, content: '[', pos: { start: 18, end: 19 } },
          { kind: TOKEN.HREF_CONTENT, content: 'dolor', pos: { start: 19, end: 24 } },
          { kind: TOKEN.HREF_END, content: ']', pos: { start: 24, end: 25 } },
          { kind: TOKEN.WORD, content: 'dolor', pos: { start: 25, end: 30 } },
          { kind: TOKEN.LINK_INTERNAL_WITH_PARAMS, content: '$p', pos: { start: 30, end: 32 } },
          { kind: TOKEN.WORD, content: ' ', pos: { start: 32, end: 33 } },
          { kind: TOKEN.COLOR, content: '$f00', pos: { start: 35, end: 39 } },
          { kind: TOKEN.WORD, content: 'sit ', pos: { start: 39, end: 43 } },
          { kind: TOKEN.SHADOW, content: '$s', pos: { start: 45, end: 47 } },
          { kind: TOKEN.WORD, content: 'amet', pos: { start: 47, end: 51 } },
          { kind: TOKEN.NEWLINE, content: ' ', pos: { start: 51, end: 52 } },
          { kind: TOKEN.TAB, content: ' ', pos: { start: 52, end: 53 } },
          { kind: TOKEN.WORD, content: 'consectetur', pos: { start: 53, end: 64 } },
        ]);
      } else {
        expect(tokens).toMatchObject([
          { kind: TOKEN.BOLD, content: '$o', pos: { start: 0, end: 2 } },
          { kind: TOKEN.WORD, content: 'Lorem ', pos: { start: 2, end: 8 } },
          { kind: TOKEN.WIDTH_WIDE, content: '$w', pos: { start: 8, end: 10 } },
          { kind: TOKEN.WORD, content: 'ipsum ', pos: { start: 10, end: 16 } },
          { kind: TOKEN.LINK_INTERNAL_WITH_PARAMS, content: '$p', pos: { start: 16, end: 18 } },
          { kind: TOKEN.HREF_START, content: '[', pos: { start: 18, end: 19 } },
          { kind: TOKEN.HREF_CONTENT, content: 'dolor', pos: { start: 19, end: 24 } },
          { kind: TOKEN.HREF_END, content: ']', pos: { start: 24, end: 25 } },
          { kind: TOKEN.WORD, content: 'dolor', pos: { start: 25, end: 30 } },
          { kind: TOKEN.LINK_INTERNAL_WITH_PARAMS, content: '$p', pos: { start: 30, end: 32 } },
          { kind: TOKEN.WORD, content: ' ', pos: { start: 32, end: 33 } },
          { kind: TOKEN.BLOCK_START, content: '$<', pos: { start: 33, end: 35 } },
          { kind: TOKEN.COLOR, content: '$f00', pos: { start: 35, end: 39 } },
          { kind: TOKEN.WORD, content: 'sit', pos: { start: 39, end: 42 } },
          { kind: TOKEN.BLOCK_END, content: '$>', pos: { start: 42, end: 44 } },
          { kind: TOKEN.WORD, content: ' ', pos: { start: 44, end: 45 } },
          { kind: TOKEN.SHADOW, content: '$s', pos: { start: 45, end: 47 } },
          { kind: TOKEN.WORD, content: 'amet', pos: { start: 47, end: 51 } },
          { kind: TOKEN.NEWLINE, content: ' ', pos: { start: 51, end: 52 } },
          { kind: TOKEN.TAB, content: ' ', pos: { start: 52, end: 53 } },
          { kind: TOKEN.WORD, content: 'consectetur', pos: { start: 53, end: 64 } },
        ]);
      }
    });
  });

  describe(`humanization for syntax "${syntax}"`, () => {
    it('should remove all non-word tokens', () => {
      const value = suite === 'member' ? text.humanize() : humanize(MAIN_TEST_STRING, options);

      if (syntax === SYNTAX.CLASSIC || syntax === SYNTAX.UNITED) {
        expect(value).toBe('Lorem ipsum [dolor]dolor sit amet  consectetur');
      } else {
        expect(value).toBe('Lorem ipsum dolor sit amet  consectetur');
      }
    });
  });

  describe(`conversion to HTML for syntax "${syntax}"`, () => {
    it('should handle input with no text content or only spaces', () => {
      expect(htmlify('$s$i', options)).toBe('');
      expect(htmlify(' $s$i', options)).toBe('<span> </span>');
      expect(htmlify('  $s$i', options)).toBe('<span>  </span>');
      expect(htmlify('$s $i', options)).toBe('<span style="text-shadow:1px 1px 1px #000"> </span>');
      expect(htmlify('$s$i ', options)).toBe('<span style="font-style:italic;text-shadow:1px 1px 1px #000"> </span>');
      expect(htmlify(' $s$i ', options)).toBe('<span> </span><span style="font-style:italic;text-shadow:1px 1px 1px #000"> </span>');
      expect(htmlify(' $s $i ', options)).toBe('<span> </span><span style="text-shadow:1px 1px 1px #000"> </span><span style="font-style:italic;text-shadow:1px 1px 1px #000"> </span>');
    });

    it('should handle special escape characters', () => {
      expect(htmlify('\f\n\r\v\t\u00A0\u2028\u2029', options)).toBe('<span>&#13;&#13;&#13;&#9;&#13;&#13;</span>');
      expect(htmlify('$f00Lorem$\n0f0ipsum', options)).toBe('<span style="color:#f00">Lorem&#13;0f0ipsum</span>');
      expect(htmlify('$f00Lorem$0f0\nipsum', options)).toBe('<span style="color:#f00">Lorem</span><span style="color:#0f0">&#13;ipsum</span>');
    });

    it('should ignore unknown tokens', () => {
      expect(htmlify('$a', options)).toBe('');
      expect(htmlify('$bLorem', options)).toBe('<span>Lorem</span>');
      expect(htmlify('$c$iLorem', options)).toBe('<span style="font-style:italic">Lorem</span>');
      expect(htmlify('$def$aLorem', options)).toBe('<span style="color:#def">Lorem</span>');
      expect(htmlify('$ghiLorem', options)).toBe('<span>hiLorem</span>');
      expect(htmlify('$007$00Lorem', options)).toBe('<span style="color:#007">0Lorem</span>');
      expect(htmlify('$007$00fLorem', options)).toBe('<span style="color:#00f">Lorem</span>');
    });

    it('should be able to reset formatting', () => {
      expect(htmlify('$iLorem $zipsum', options)).toBe('<span style="font-style:italic">Lorem </span><span>ipsum</span>');
      expect(htmlify('$f00Lorem $gipsum', options)).toBe('<span style="color:#f00">Lorem </span><span>ipsum</span>');
      expect(htmlify('$f00$iLorem $gipsum', options)).toBe('<span style="color:#f00;font-style:italic">Lorem </span><span style="font-style:italic">ipsum</span>');
    });

    it('should handle css tokens without end tags correctly', () => {
      expect(htmlify('$mLorem', options)).toBe('<span>Lorem</span>');
      expect(htmlify('$nLorem', options)).toBe('<span style="display:inline-block;margin-right:-15.540px;transform:scaleX(0.64);transform-origin:0 100%">Lorem</span>');
      expect(htmlify('$wLorem', options)).toBe('<span style="display:inline-block;margin-right:23.940px;transform:scaleX(1.57);transform-origin:0 100%">Lorem</span>');
      expect(htmlify('$mLorem$m ipsum', options)).toBe('<span>Lorem ipsum</span>');
      expect(htmlify('$nLorem$n ipsum', options)).toBe('<span style="display:inline-block;margin-right:-31.080px;transform:scaleX(0.64);transform-origin:0 100%">Lorem ipsum</span>');
      expect(htmlify('$wLorem$w ipsum', options)).toBe('<span style="display:inline-block;margin-right:47.880px;transform:scaleX(1.57);transform-origin:0 100%">Lorem ipsum</span>');
      expect(htmlify('$wLorem $mipsum $ndolor', options)).toBe('<span style="display:inline-block;margin-right:26.220px;transform:scaleX(1.57);transform-origin:0 100%">Lorem </span><span>ipsum </span><span style="display:inline-block;margin-right:-12.210px;transform:scaleX(0.64);transform-origin:0 100%">dolor</span>');
    });

    it('should handle css tokens with end tags correctly', () => {
      expect(htmlify('$iLorem$i ipsum', options)).toBe('<span style="font-style:italic">Lorem</span><span> ipsum</span>');
      expect(htmlify('$sLorem$s ipsum', options)).toBe('<span style="text-shadow:1px 1px 1px #000">Lorem</span><span> ipsum</span>');
      expect(htmlify('$tLorem$t ipsum', options)).toBe('<span style="text-transform:uppercase">Lorem</span><span> ipsum</span>');
      expect(htmlify('$t$f00Lorem $f00ipsum', options)).toBe('<span style="color:#f00;text-transform:uppercase">Lorem ipsum</span>');
      expect(htmlify('$t$f00Lorem $0f0ipsum', options)).toBe('<span style="color:#f00;text-transform:uppercase">Lorem </span><span style="color:#0f0;text-transform:uppercase">ipsum</span>');
      expect(htmlify('$t$f00Lorem $0f0ipsum $tdolor', options)).toBe('<span style="color:#f00;text-transform:uppercase">Lorem </span><span style="color:#0f0;text-transform:uppercase">ipsum </span><span style="color:#0f0">dolor</span>');

      if (syntax === SYNTAX.CLASSIC) {
        expect(htmlify('$oLorem$o ipsum', options)).toBe('<span>Lorem ipsum</span>');
      } else {
        expect(htmlify('$oLorem$o ipsum', options)).toBe('<span style="font-weight:700">Lorem</span><span> ipsum</span>');
      }
    });

    it('should handle links correctly', () => {
      if (syntax === SYNTAX.CLASSIC) {
        expect(htmlify('$hexample.com', options)).toBe('<span>example.com</span>');
        expect(htmlify('$lexample.com', options)).toBe('<span>example.com</span>');
        expect(htmlify('$hexample.com$hLorem', options)).toBe('<span>example.comLorem</span>');
        expect(htmlify('$lexample.com$lLorem', options)).toBe('<span>example.comLorem</span>');
        expect(htmlify('$h[example.com]Lorem', options)).toBe('<span>[example.com]Lorem</span>');
        expect(htmlify('$l[example.com]Lorem', options)).toBe('<span>[example.com]Lorem</span>');
        expect(htmlify('$h[example.com]Lor$hem', options)).toBe('<span>[example.com]Lorem</span>');
        expect(htmlify('$l[example.com]Lor$lem', options)).toBe('<span>[example.com]Lorem</span>');
        expect(htmlify('$h[example.com]L$ior$hem', options)).toBe('<span>[example.com]L</span><span style="font-style:italic">orem</span>');
        expect(htmlify('$l[example.com]L$ior$lem', options)).toBe('<span>[example.com]L</span><span style="font-style:italic">orem</span>');
        expect(htmlify('$hexa$omple.com', options)).toBe('<span>example.com</span>');
        expect(htmlify('$lexa$omple.com', options)).toBe('<span>example.com</span>');
        expect(htmlify('$pexa$omple.com', options)).toBe('<span>example.com</span>');
      } else {
        expect(htmlify('$lexample.com', options)).toBe('<a href="https://example.com"><span>example.com</span></a>');
        expect(htmlify('$lhttps://example.com', options)).toBe('<a href="https://example.com"><span>https://example.com</span></a>');
        expect(htmlify('$lhttp://example.com', options)).toBe('<a href="http://example.com"><span>http://example.com</span></a>');
        expect(htmlify('$lexample.com', { ...options, scheme: 'http' })).toBe('<a href="http://example.com"><span>example.com</span></a>');
        expect(htmlify('$lexample.com$lLorem', options)).toBe('<a href="https://example.com"><span>example.com</span></a><span>Lorem</span>');
        expect(htmlify('$l[example.com]Lorem', options)).toBe('<a href="https://example.com"><span>Lorem</span></a>');
        expect(htmlify('$l[example.com]Lor$lem', options)).toBe('<a href="https://example.com"><span>Lor</span></a><span>em</span>');
        expect(htmlify('$l[example.com]L$ior$lem', options)).toBe('<a href="https://example.com"><span>L</span><span style="font-style:italic">or</span></a><span style="font-style:italic">em</span>');
        expect(htmlify('$lexa$omple.com', options)).toBe('<a href="https://example.com"><span>exa</span><span style="font-weight:700">mple.com</span></a>');

        if (syntax === SYNTAX.MANIAPLANET) {
          expect(htmlify('$hexample.com', options)).toBe('<a href="maniaplanet://example.com"><span>example.com</span></a>');
          expect(htmlify('$hmaniaplanet://example.com', options)).toBe('<a href="maniaplanet://example.com"><span>maniaplanet://example.com</span></a>');
          expect(htmlify('$hexample.com$hLorem', options)).toBe('<a href="maniaplanet://example.com"><span>example.com</span></a><span>Lorem</span>');
          expect(htmlify('$h[example.com]Lorem', options)).toBe('<a href="maniaplanet://example.com"><span>Lorem</span></a>');
          expect(htmlify('$h[example.com]Lor$hem', options)).toBe('<a href="maniaplanet://example.com"><span>Lor</span></a><span>em</span>');
          expect(htmlify('$h[example.com]L$ior$hem', options)).toBe('<a href="maniaplanet://example.com"><span>L</span><span style="font-style:italic">or</span></a><span style="font-style:italic">em</span>');
          expect(htmlify('$hexa$omple.com', options)).toBe('<a href="maniaplanet://example.com"><span>exa</span><span style="font-weight:700">mple.com</span></a>');
          expect(htmlify('$hexa$omple$l.com', options)).toBe('<a href="maniaplanet://example"><span>exa</span><span style="font-weight:700">mple</span></a><span style="font-weight:700">.com</span>');

          expect(htmlify('$pexample.com', options)).toBe('<a href="maniaplanet://example.com"><span>example.com</span></a>');
          expect(htmlify('$pexample.com$pLorem', options)).toBe('<a href="maniaplanet://example.com"><span>example.com</span></a><span>Lorem</span>');
          expect(htmlify('$p[example.com]Lorem', options)).toBe('<a href="maniaplanet://example.com"><span>Lorem</span></a>');
          expect(htmlify('$p[example.com]Lor$pem', options)).toBe('<a href="maniaplanet://example.com"><span>Lor</span></a><span>em</span>');
          expect(htmlify('$p[example.com]L$ior$pem', options)).toBe('<a href="maniaplanet://example.com"><span>L</span><span style="font-style:italic">or</span></a><span style="font-style:italic">em</span>');
          expect(htmlify('$pexa$omple.com', options)).toBe('<a href="maniaplanet://example.com"><span>exa</span><span style="font-weight:700">mple.com</span></a>');
          expect(htmlify('$hexa$omple$l.c$z$pom', options)).toBe('<a href="maniaplanet://example"><span>exa</span><span style="font-weight:700">mple</span></a><span style="font-weight:700">.c</span><a href="maniaplanet://om"><span>om</span></a>');
          expect(htmlify('$hexa$omple$l.c$p$zom', options)).toBe('<a href="maniaplanet://example"><span>exa</span><span style="font-weight:700">mple</span></a><span style="font-weight:700">.c</span><span>om</span>');
          expect(htmlify('$hexa$omple$l.c$pom', options)).toBe('<a href="maniaplanet://example"><span>exa</span><span style="font-weight:700">mple</span></a><span style="font-weight:700">.c</span><a href="maniaplanet://om"><span style="font-weight:700">om</span></a>');
        } else {
          expect(htmlify('$hexample.com', options)).toBe('<a href="tmtp://example.com"><span>example.com</span></a>');
          expect(htmlify('$htmtp://example.com', options)).toBe('<a href="tmtp://example.com"><span>tmtp://example.com</span></a>');
          expect(htmlify('$hexample.com$hLorem', options)).toBe('<a href="tmtp://example.com"><span>example.com</span></a><span>Lorem</span>');
          expect(htmlify('$h[example.com]Lorem', options)).toBe('<a href="tmtp://example.com"><span>Lorem</span></a>');
          expect(htmlify('$h[example.com]Lor$hem', options)).toBe('<a href="tmtp://example.com"><span>Lor</span></a><span>em</span>');
          expect(htmlify('$h[example.com]L$ior$hem', options)).toBe('<a href="tmtp://example.com"><span>L</span><span style="font-style:italic">or</span></a><span style="font-style:italic">em</span>');
          expect(htmlify('$hexa$omple.com', options)).toBe('<a href="tmtp://example.com"><span>exa</span><span style="font-weight:700">mple.com</span></a>');
          expect(htmlify('$hexa$omple$l.com', options)).toBe('<a href="tmtp://example"><span>exa</span><span style="font-weight:700">mple</span></a><span style="font-weight:700">.com</span>');

          if (syntax === SYNTAX.FOREVER) {
            expect(htmlify('$pexample.com', options)).toBe('<a href="tmtp://example.com"><span>example.com</span></a>');
            expect(htmlify('$pexample.com$pLorem', options)).toBe('<a href="tmtp://example.com"><span>example.com</span></a><span>Lorem</span>');
            expect(htmlify('$p[example.com]Lorem', options)).toBe('<a href="tmtp://example.com"><span>Lorem</span></a>');
            expect(htmlify('$p[example.com]Lor$pem', options)).toBe('<a href="tmtp://example.com"><span>Lor</span></a><span>em</span>');
            expect(htmlify('$p[example.com]L$ior$pem', options)).toBe('<a href="tmtp://example.com"><span>L</span><span style="font-style:italic">or</span></a><span style="font-style:italic">em</span>');
            expect(htmlify('$pexa$omple.com', options)).toBe('<a href="tmtp://example.com"><span>exa</span><span style="font-weight:700">mple.com</span></a>');
            expect(htmlify('$hexa$omple$l.c$z$pom', options)).toBe('<a href="tmtp://example"><span>exa</span><span style="font-weight:700">mple</span></a><span style="font-weight:700">.c</span><a href="tmtp://om"><span>om</span></a>');
            expect(htmlify('$hexa$omple$l.c$p$zom', options)).toBe('<a href="tmtp://example"><span>exa</span><span style="font-weight:700">mple</span></a><span style="font-weight:700">.c</span><span>om</span>');
            expect(htmlify('$hexa$omple$l.c$pom', options)).toBe('<a href="tmtp://example"><span>exa</span><span style="font-weight:700">mple</span></a><span style="font-weight:700">.c</span><a href="tmtp://om"><span style="font-weight:700">om</span></a>');

            expect(htmlify('$pexample.com', {
              ...options,
              playerParameters: {
                playerlogin: 'jondoe',
                nickname: '$w$s$f00jon$0f0doe',
                lang: 'en',
                path: 'World|United States of America|California',
              },
            })).toBe('<a href="tmtp://example.com?playerlogin=jondoe&lang=en&nickname=%24w%24s%24f00jon%240f0doe&path=World%7CUnited+States+of+America%7CCalifornia"><span>example.com</span></a>');
          } else {
            expect(htmlify('$hexa$omple$l.c$z$pom', options)).toBe('<a href="tmtp://example"><span>exa</span><span style="font-weight:700">mple</span></a><span style="font-weight:700">.c</span><span>om</span>');
            expect(htmlify('$hexa$omple$l.c$p$zom', options)).toBe('<a href="tmtp://example"><span>exa</span><span style="font-weight:700">mple</span></a><span style="font-weight:700">.c</span><span>om</span>');
            expect(htmlify('$hexa$omple$l.c$pom', options)).toBe('<a href="tmtp://example"><span>exa</span><span style="font-weight:700">mple</span></a><span style="font-weight:700">.com</span>');
          }
        }
      }

      if (syntax === SYNTAX.CLASSIC || syntax === SYNTAX.UNITED) {
        expect(htmlify('$pexample.com', options)).toBe('<span>example.com</span>');
        expect(htmlify('$pexample.com$pLorem', options)).toBe('<span>example.comLorem</span>');
        expect(htmlify('$p[example.com]Lorem', options)).toBe('<span>[example.com]Lorem</span>');
        expect(htmlify('$p[example.com]Lor$pem', options)).toBe('<span>[example.com]Lorem</span>');
        expect(htmlify('$p[example.com]L$ior$pem', options)).toBe('<span>[example.com]L</span><span style="font-style:italic">orem</span>');

        if (syntax === SYNTAX.UNITED) {
          expect(htmlify('$pexa$omple.com', options)).toBe('<span>exa</span><span style="font-weight:700">mple.com</span>');
        }
      }
    });

    it('should handle formatting blocks correctly', () => {
      if (syntax === SYNTAX.MANIAPLANET) {
        expect(htmlify('$iLorem $<$tipsum$> dolor', options)).toBe('<span style="font-style:italic">Lorem </span><span style="font-style:italic;text-transform:uppercase">ipsum</span><span style="font-style:italic"> dolor</span>');
        expect(htmlify('$f00Red$<$0f0$tGreen$<$00fBlue$>Green$>Red', options)).toBe('<span style="color:#f00">Red</span><span style="color:#0f0;text-transform:uppercase">Green</span><span style="color:#00f;text-transform:uppercase">Blue</span><span style="color:#0f0;text-transform:uppercase">Green</span><span style="color:#f00">Red</span>');
        expect(htmlify('$<$tupper $<upper $tlower $tupper$> upper $tlower $t$> lower $tupper$t lower', options)).toBe('<span style="text-transform:uppercase">upper upper </span><span>lower </span><span style="text-transform:uppercase">upper upper </span><span>lower  lower </span><span style="text-transform:uppercase">upper</span><span> lower</span>');
        expect(htmlify('$<$tLorem$> ipsum$> dolor', options)).toBe('<span style="text-transform:uppercase">Lorem</span><span> ipsum dolor</span>');
      } else {
        expect(htmlify('$iLorem $<$tipsum$> dolor', options)).toBe('<span style="font-style:italic">Lorem </span><span style="font-style:italic;text-transform:uppercase">ipsum dolor</span>');

        if (syntax === SYNTAX.CLASSIC) {
          expect(htmlify('$l[Lorem ipsum]dolor $<$0f0sit$l amet$> consectetur', options)).toBe('<span>[Lorem ipsum]dolor </span><span style="color:#0f0">sit amet consectetur</span>');
        } else {
          expect(htmlify('$l[Lorem ipsum]dolor $<$0f0sit$l amet$> consectetur', options)).toBe('<a href="https://Lorem ipsum"><span>dolor </span><span style="color:#0f0">sit</span></a><span style="color:#0f0"> amet consectetur</span>');
        }
      }
    });

    it('should handle formatting blocks in combination with links correctly', () => {
      if (syntax !== SYNTAX.MANIAPLANET) {
        return;
      }

      expect(htmlify('$l[Lorem ipsum]dolor $<$0f0sit$l amet$> consectetur', options)).toBe('<a href="https://Lorem ipsum"><span>dolor </span><span style="color:#0f0">sit</span></a><span style="color:#0f0"> amet</span><a href="https://Lorem ipsum"><span> consectetur</span></a>');
      expect(htmlify('$p[exa$omple.com]Lorem', options)).toBe('<a href="maniaplanet://example.com"><span>Lorem</span></a>');
      expect(htmlify('$l[Lorem$<$f00 ipsum]$tdolor$l sit$> amet', options)).toBe('<a href="https://Lorem ipsum"><span style="text-transform:uppercase">dolor</span></a><span style="text-transform:uppercase"> sit amet</span>');
      expect(htmlify('$f00$<$tLorem$> $<$i$0f0ipsum$> dolor', options)).toBe('<span style="color:#f00;text-transform:uppercase">Lorem</span><span style="color:#f00"> </span><span style="color:#0f0;font-style:italic">ipsum</span><span style="color:#f00"> dolor</span>');
      expect(htmlify('Lorem $<$tip$l[sum$> do]lo$>r', options)).toBe('<span>Lorem </span><span style="text-transform:uppercase">ip</span><a href="https://sum do"><span style="text-transform:uppercase">lo</span></a><span>r</span>');

      // FIXME: These tests currently don't pass.
      // A more sophisticated solution has to be found to be able to accurately reproduce the behavior shown in the game.
      //
      // expect(htmlify('Lor$lem $<$tipsum$> do$llor', options)).toBe('<span>Lor</span><a href="https://em"><span>em </span><span style="text-transform:uppercase">ipsum</span><span> do</span></a><span>lor</span>');
      // expect(htmlify('Lorem $<$tip$lsum$> dolor', options)).toBe('<span>Lorem </span><span style="text-transform:uppercase">ip</span><a href="https://sum"><span style="text-transform:uppercase">sum</span></a><span> dolor</span>');
      // expect(htmlify('$lLorem $<$tip$lsum$> dolor', options)).toBe('<a href="https://Lorem ip"><span>Lorem </span><span style="text-transform:uppercase">ip</span></a><span style="text-transform:uppercase">sum</span><a href="https://Lorem ip"><span> dolor</span></a>');
      // expect(htmlify('$lLorem $<$tip$lsu$lm$> dolor', options)).toBe('<a href="https://Lorem"><span>Lorem </span><span style="text-transform:uppercase">ip</span></a><span style="text-transform:uppercase">su</span><a href="https://m"><span style="text-transform:uppercase">m</span><span> dolor</span></a>');
    });
  });
};

const runSuite = (suite: Suite): void => {
  describe(`tm-text ${suite} functions`, () => {
    Object.values(SYNTAX).forEach((syntax) => runTestsForSyntax(suite, syntax));
  });
};

runSuite('member');
runSuite('exported');
