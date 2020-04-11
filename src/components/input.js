import styled from 'styled-components';

const Input = styled.input`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius[0]};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.body};
  padding: ${({ theme }) => theme.space[2]};
`;

export default Input;
