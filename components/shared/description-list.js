import { Box } from '@chakra-ui/react';

const dividedCellStyles = {
  borderTop: '1px solid',
  borderColor: 'greyLight',
  py: 2,
  _last: {
    paddingBottom: 0,
  },
};

export const DT = (props) => {
  return (
    <Box
      as="dt"
      fontSize="sm"
      fontWeight="normal"
      color="black"
      m="0"
      pr={1}
      {...dividedCellStyles}
      {...props}
    />
  );
};
export const DD = (props) => {
  return (
    <Box
      as="dd"
      fontSize="sm"
      fontWeight="bold"
      color="qukBlue"
      textAlign="right"
      m="0"
      pl={1}
      {...dividedCellStyles}
      {...props}
    />
  );
};

export const Description = ({ term, description }) => (
  <>
    <DT>{term}</DT>
    <DD>{description}</DD>
  </>
);

const DescriptionList = (props) => (
  <Box
    as="dl"
    m="0"
    display="grid"
    gridTemplateColumns="auto auto"
    {...props}
  />
);

export default DescriptionList;
