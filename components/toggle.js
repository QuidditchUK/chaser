/* eslint-disable prefer-arrow-callback */
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box } from 'components/layout';

const CheckBoxWrapper = styled(Box)`
  position: relative;
`;

const CheckBoxLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 42px;
  height: 26px;
  border-radius: 15px;
  background: ${({ theme }) => theme.colors.greyDark};
  cursor: pointer;
  &::after {
    content: "";
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`;
const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 42px;
  height: 26px;
  &:checked + ${CheckBoxLabel} {
    background: ${({ theme }) => theme.colors.keeperGreen};

    &::after {
      content: "";
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 21px;
      transition: 0.2s;
    }
  }
`;

const Toggle = forwardRef(function ToggleInput({ name, ...wrapperProps }, ref) {
  return (
    <CheckBoxWrapper {...wrapperProps}>
      <CheckBox id={name} name={name} ref={ref} type="checkbox" />
      <CheckBoxLabel htmlFor={name} />
    </CheckBoxWrapper>
  );
});

Toggle.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Toggle;
