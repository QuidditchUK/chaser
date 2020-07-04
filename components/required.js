import React from 'react';
import styled from 'styled-components';

const Styled = styled.span`
font-weight: bold;
color: ${({ theme }) => theme.colors.secondary};
`;

const Required = () => (<Styled>*</Styled>);

export default Required;
