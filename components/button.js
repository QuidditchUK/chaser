import styled from 'styled-components';
import { shade, tint } from 'polished';
import { variant, space } from 'styled-system';

const variants = (theme) => ({
  primary: {
    bg: theme.colors.primary,
    border: `1px solid ${theme.colors.primary}`,
    color: theme.colors.white,
  },
  secondary: {
    bg: theme.colors.secondary,
    border: `1px solid ${theme.colors.secondary}`,
    color: theme.colors.white,
  },
  light: {
    bg: theme.colors.white,
    border: `1px solid ${theme.colors.primary}`,
    color: theme.colors.primary,
  },
  dark: {
    bg: theme.colors.darkBlue,
    border: `1px solid ${theme.colors.darkBlue}`,
    color: theme.colors.white,
  },
});

const hoverStates = (theme) => ({
  primary: {
    bg: shade(0.3, theme.colors.primary),
    border: `1px solid ${shade(0.2, theme.colors.primary)}`,
  },
  secondary: {
    bg: shade(0.3, theme.colors.secondary),
    border: `1px solid ${shade(0.3, theme.colors.secondary)}`,
  },
  light: {
    bg: tint(0.9, theme.colors.primary),
  },
  dark: {
    bg: tint(0.9, theme.colors.darkBlue),
    border: `1px solid ${tint(0.9, theme.colors.darkBlue)}`,
  },
});


export default styled.button`
  border-radius: ${({ theme }) => theme.radius[0]};
  cursor: pointer;
  display: inline-block;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.body};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]};
  ${({ theme }) => variant({ variants: variants(theme) })}
  ${space}

  &:hover {
    ${({ theme }) => variant({ variants: hoverStates(theme) })}
  }
`;
