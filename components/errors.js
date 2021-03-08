import { Box } from 'components';

const Error = (props) => (
  <Box display="block" color="monarchRed" fontSize="sm" {...props} />
);

export const InlineError = ({ children, ...errorProps }) => (
  <Error {...errorProps}>
    <span>{children}</span>
  </Error>
);
