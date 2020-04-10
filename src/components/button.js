import styled from 'styled-components';

export default styled.button`
  background: ${({ theme }) => theme.colors.primary};
  border: ${({ theme }) => theme.radius[0]} solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius[0]};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  display: inline-block;
  font-size: ${({ theme }) => theme.fontSizes.body};
  padding: ${({ theme }) => theme.spaces[1]} ${({ theme }) => theme.spaces[3]};
`;
