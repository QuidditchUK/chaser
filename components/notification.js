import styled from 'styled-components';
import { Box } from 'components/layout';

import { tint } from 'polished';

const Notification = styled(Box)`
  background: ${({ theme }) => tint(0.8, theme.colors.primary)};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii[0]};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[4]};
  color: ${({ theme }) => theme.colors.primary};

  a {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

export default Notification;
