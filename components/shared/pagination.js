import { Text, HStack } from '@chakra-ui/react';

export default function Pagination({ pages = 1, page, setPage }) {
  return (
    <HStack
      spacing={4}
      textAlign="center"
      width="100%"
      justifyContent="center"
      py={3}
      mt={2}
    >
      {Array(pages)
        .fill(0)
        .map((v, index) => {
          const currentPage = index === page;
          return (
            <Text
              cursor={currentPage ? 'default' : 'pointer'}
              key={index}
              color="qukBlue"
              p={0}
              m={0}
              fontWeight={currentPage ? '700' : 'normal'}
              _hover={{
                textDecoration: currentPage ? 'none' : 'underline',
              }}
              fontSize="xl"
              onClick={() => setPage(index)}
            >
              {index + 1}
            </Text>
          );
        })}
    </HStack>
  );
}
