export default `
  @font-face {
    font-display: swap;
    font-family: 'pt-sans';
    font-style: normal;
    font-weight: normal;
    src: url('${process.env.PUBLIC_URL}/fonts/PTSans-Regular.ttf') format('truetype');
  }


  @font-face {
    font-display: swap;
    font-family: 'cape-sans';
    font-style: normal;
    font-weight: normal;
    src: url('${process.env.PUBLIC_URL}/fonts/cape.ttf') format('truetype');
  }
`;
