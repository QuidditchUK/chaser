import { rgba } from 'polished';

const emBase = 16;

const rem = (value) => `${value / emBase}rem`;

const breakpoints = [rem(576), rem(768), rem(992), rem(1200)];

[breakpoints.s] = breakpoints;
[, breakpoints.m] = breakpoints;
[,, breakpoints.l] = breakpoints;
[,,, breakpoints.xl] = breakpoints;

const colors = {
  white: '#fff',
  black: '#000',
  royalBlue: '#0e375f',
  monarchRed: '#b61c2a',
  greyMedium: '#d6d7dc',
  northernMagenta: '#90268c',
  southernBlue: '#84c7e6',
};

colors.primary = colors.royalBlue;
colors.secondary = colors.monarchRed;

const fonts = {
  body: 'pt-sans, sans-serif',
  heading: 'century-gothic, sans-serif',
};

const fontSizes = {
  heading: rem(80),
  headingMobile: rem(32),
  body: rem(16),
};

const radius = [rem(3)];

const shadows = {
  box: `0 0 ${rem(10)} ${rgba(0, 0, 0, 0.3)}`,
  heading: `0 0 ${rem(50)} ${rgba(0, 0, 0, 0.3)}`,
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
  fonts,
  fontSizes,
  radius,
  shadows,
  space,
};
