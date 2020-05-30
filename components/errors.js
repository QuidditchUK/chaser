import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { layout, space } from 'styled-system';

const Error = styled.div`
  display: block;
  ${layout};
  ${space};

  color: ${({ theme }) => theme.colors.secondary};

  span {
    font-size: ${({ theme }) => theme.fontSizes.bodyCard};
  }
`;

export const InlineError = ({ children, ...errorProps }) => (<Error {...errorProps}><span>{children}</span></Error>);

InlineError.propTypes = {
  children: PropTypes.node.isRequired,
};
