/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import styled from 'styled-components';
import { Box } from 'components/layout';

const GifsContainer = styled(Box)`
  width: 100%;
  height: 100vh;
  z-index: 200;
  position: fixed;
  top: 0;
  left: 0;
  display: grid;
  padding-top: 60px;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: 200px 1fr 200px;
  pointer-events: none;
`;

const music = '/media/hedwig.mp3';

export const Cape = () => (
  <>
    <audio autoPlay loop><source src={music} /></audio>

    <GifsContainer>
      <img src="/media/quidditch.gif" height={200} width={200} alt="Harry on his broom" />
      <div />
      <img src="/media/weasley.gif" height={200} width={200} alt="Badge for weasley is our king" />

      <div /><div /><div />

      <img src="/media/jay.gif" height={200} width={200} alt="A swan, swanning about" />
      <div />
      <img src="/media/glasses.gif" height={150} width={150} alt="A scar and glasses" />
    </GifsContainer>
  </>
);

export default Cape;
