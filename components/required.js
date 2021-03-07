import styled from '@emotion/styled';

const Styled = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.monarchRed};
`;

const Required = () => <Styled>*</Styled>;

export default Required;
