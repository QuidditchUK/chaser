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
  royalBlue: '#003471',
  monarchRed: '#9e1925',
  greyMedium: '#d6d7dc',
};

colors.primary = colors.royalBlue;
colors.secondary = colors.monarchRed;

const fonts = {
  body: 'pt-sans sans-serif',
  heading: 'roboto, sans-serif',
};

const fontSizes = {
  heading: rem(80),
  headingMobile: rem(32),
  body: rem(16),
};

const radius = [rem(3)];

const shadows = {
  heading: `0 0 ${rem(50)} ${rgba(0, 0, 0, 0.3)}`,
};

const spaces = [
  rem(4),
  rem(8),
  rem(12),
  rem(16),
  rem(24),
  rem(32),
  rem(40),
];

export default {
  breakpoints,
  colors,
  fonts,
  fontSizes,
  radius,
  shadows,
  spaces,
};
