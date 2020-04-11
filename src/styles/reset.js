import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';
import fonts from './fonts';

const GlobalStyle = createGlobalStyle`
  ${normalize}

  html {
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    font-family: 'pt-sans', sans-serif;
  }

  ${fonts}
`;

export default GlobalStyle;
