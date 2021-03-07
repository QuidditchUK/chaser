import styled from '@emotion/styled';
import { Box } from 'components';

import { tint } from 'polished';

const Notification = styled(Box)`
  background: ${({ theme }) => tint(0.8, theme.colors.qukBlue)};
  border: 1px solid ${({ theme }) => theme.colors.qukBlue};
  border-radius: ${({ theme }) => theme.radii[0]};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]}
    ${({ theme }) => theme.space[4]};
  color: ${({ theme }) => theme.colors.qukBlue};

  a {
    color: ${({ theme }) => theme.colors.monarchRed};
  }
`;

export default Notification;
