import { Global } from '@emotion/react';
export default function Fonts() {
  return (
    <Global
      styles={`
        @font-face {
          font-display: swap;
          font-family: 'cape-sans';
          font-style: normal;
          font-weight: normal;
          src: url('/fonts/cape.ttf') format('truetype');
        }
        h1,h2,h3,h4,h5,h6,#home_hero_label,#find_quidditch_label {
          font-family: 'cape-sans' !important;
          font-size-adjust: 0.9 !important;
          line-height: 1.9 !important;
        }
    `}
    />
  );
}
