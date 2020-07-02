import { rgba } from 'polished';

const emBase = 16;

export const rem = (value) => `${value / emBase}rem`;

const breakpoints = [rem(576), rem(768), rem(992), rem(1200)];

[breakpoints.s] = breakpoints;
[, breakpoints.m] = breakpoints;
[, , breakpoints.l] = breakpoints;
[, , , breakpoints.xl] = breakpoints;

const colors = {
  white: '#fff',
  black: '#000',
  royalBlue: '#0e375f',
  monarchRed: '#b61c2a',
  greyMedium: '#d6d7dc',
  northernMagenta: '#90268c',
  southernBlue: '#84c7e6',
  greyLight: '#e6ebef',
  greyDark: '#787d80',
  darkBlue: '#070d1f',
  darkRed: '#1f0707',
  keeperGreen: '#34a31d',
  seekerYellow: '#f7ea34',
};

colors.primary = colors.royalBlue;
colors.secondary = colors.monarchRed;

const categoryColors = [colors.northernMagenta, colors.southernBlue, colors.royalBlue, colors.monarchRed];

const containerSize = rem(1280);

const fonts = {
  body: 'adelle-sans, sans-serif',
  heading: 'century-gothic, sans-serif',
};

const fontSizes = [rem(0), rem(14), rem(16), rem(20), rem(32), rem(40), rem(48), rem(80)];

[, fontSizes.bodyCard] = fontSizes;
[, , fontSizes.body] = fontSizes;
[, , , fontSizes.headingCard] = fontSizes;
[, , , , fontSizes.headingMobile] = fontSizes;
[, , , , , , , fontSizes.heading] = fontSizes;

const lineHeights = [rem(0), rem(16), rem(20), rem(24), rem(28)];

[, lineHeights.body] = lineHeights;
[, , lineHeights.display] = lineHeights;
[, , , lineHeights.displayMobile] = lineHeights;

const sizes = [rem(250), rem(300), rem(400), rem(540)];

[sizes.min] = sizes;
[, sizes.sliceMin] = sizes;
[, , sizes.clubsMax] = sizes;
[, , , sizes.max] = sizes;

const radii = [rem(3), rem(10)];

const shadows = {
  box: `0 0 ${rem(10)} ${rgba(0, 0, 0, 0.3)}`,
  heading: `0 0 ${rem(50)} ${rgba(0, 0, 0, 0.3)}`,
  body: `0 0 ${rem(6.5)} ${rgba(0, 0, 0, 0.5)}`,
};

const space = [
  0, //       0
  rem(4), //  1
  rem(8), //  2
  rem(12), // 3
  rem(16), // 4
  rem(20), // 5
  rem(24), // 6
  rem(28), // 7
  rem(32), // 8
  rem(40), // 9
  rem(56), // 10
  rem(64), // 11
  rem(96), // 12
  rem(128), // 13
];

space.gutter = {
  _: space[4],
  s: space[8],
  m: space[9],
};

export default {
  breakpoints,
  colors,
  containerSize,
  fonts,
  fontSizes,
  lineHeights,
  radii,
  shadows,
  space,
  categoryColors,
  sizes,
};
