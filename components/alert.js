import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Flex } from 'components/layout';
import Container from 'components/container';

const AlertBox = styled(Flex)`
  a {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;

    &:hover {
      color: ${({ theme }) => theme.colors.white};
      border-bottom: 2px solid ${({ theme }) => theme.colors.white};
    }
  }
`;

export default function Alert({ children }) {
  return (
    <AlertBox bg="alert" px="5" py="2" alignItems="center" justifyContent="center">
      <Container>
        {children}
      </Container>
    </AlertBox>
  );
}

Alert.propTypes = {
  children: PropTypes.node.isRequired,
};
