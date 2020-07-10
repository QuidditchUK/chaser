import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Flex } from 'components/layout';
import Container from 'components/container';

const AlertBox = styled(Flex)`
  color: ${({ theme }) => theme.colors.white};
  text-align: center;

  a {
    color: ${({ theme }) => theme.colors.white};
    font-weight: bold;
    text-decoration: none;

    &:hover {
      color: ${({ theme }) => theme.colors.white};
      border-bottom: 2px solid ${({ theme }) => theme.colors.white};
    }
  }
`;

export default function Alert({ children }) {
  return (
    <AlertBox bg="alert" py="4" alignItems="center" justifyContent="center">
      <Container>
        {children}
      </Container>
    </AlertBox>
  );
}

Alert.propTypes = {
  children: PropTypes.node.isRequired,
};
