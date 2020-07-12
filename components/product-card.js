import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { space, typography, color } from 'styled-system';
import { Box, Flex, Grid } from 'components/layout';
import Heading from 'components/heading';
import { formatMinorUnitsToCurrency } from 'modules/numbers';
import { api } from 'modules/api';
import { stripePromise } from 'modules/stripe';

const StyledCard = styled(Grid)`
  border-radius: ${({ theme }) => theme.radii[1]};
  overflow: hidden;
  transition: box-shadow 0.125s;
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.black};

  ${space};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.box};
  }
`;

const Content = styled.div`
  ${typography};
  ${color};
  padding: ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[4]};

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.black};

    &:hover {
      text-decoration: underline;
    }
  }
`;

const handleClick = async (id) => {
  const { data } = await api.get(`/products/session?price_id=${id}`);

  const stripe = await stripePromise;
  const { error } = await stripe.redirectToCheckout({
    sessionId: data.id,
  });

  // TODO HANDLE REDIRECT ERROR
  console.log(error.message);
};

const ProductCard = ({
  image,
  name,
  description,
  price,
  ...cardProps
}) => (
  <StyledCard
    {...cardProps}
    gridTemplateColumns={{ _: '1fr', m: '3fr 6fr 3fr' }}
    gridGap={{ _: 'gutter._', m: 'gutter.m' }}
    onClick={() => handleClick(price?.id)}
  >
    <Box
      as="section"
      position="relative"
      backgroundImage={`url(${image})`}
      backgroundColor="primary"
      backgroundSize="cover"
      backgroundPosition="center"
    />

    <Content>
      <Heading as="h2" fontSize={3} isBody>{name}</Heading>
      <p>{description}</p>
    </Content>

    <Flex flexDirection="column" justifyContent="center" alignItems="center" padding="3">
      <Content fontSize="4"><strong>{formatMinorUnitsToCurrency(price?.unit_amount)}</strong></Content>
    </Flex>
  </StyledCard>
);

ProductCard.defaultProps = {
  name: null,
  image: null,
  description: null,
  id: null,
  price: null,
};

ProductCard.propTypes = {
  name: PropTypes.string,
  image: PropTypes.string,
  description: PropTypes.string,
  id: PropTypes.string,
  price: PropTypes.shape({
    unit_amount: PropTypes.number,
    id: PropTypes.string,
  }),
};

export default ProductCard;
