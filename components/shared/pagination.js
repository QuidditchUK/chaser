import { Text, HStack } from '@chakra-ui/react';

const Page = ({ currentPage, index, setPage }) => (
  <Text
    cursor={currentPage ? 'default' : 'pointer'}
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

export default function Pagination({ pages = 1, page, setPage }) {
  // 1, 2, 3, 4, 5 ... 20 (pages 1- 4)
  // 1 ... 3, 4, 5, 6, 7 .. 20 (pages 5 - 16)
  // 1 ... 16, 17, 18, 19, 20 (pages 16 - 20)

  return (
    <HStack
      spacing={4}
      textAlign="center"
      width="100%"
      justifyContent="center"
      py={3}
      mt={2}
    >
      {pages <= 5
        ? Array(pages)
            .fill(0)
            .map((v, index) => {
              const currentPage = index === page;
              return (
                <Page
                  key={index}
                  currentPage={currentPage}
                  index={index}
                  setPage={setPage}
                />
              );
            })
        : null}

      {pages > 5 && page < 4 ? (
        <>
          {Array(pages)
            .fill(0)
            .slice(0, 5)
            .map((v, index) => {
              const currentPage = index === page;
              return (
                <Page
                  key={index}
                  currentPage={currentPage}
                  index={index}
                  setPage={setPage}
                />
              );
            })}
          <Text p={0} m={0} fontSize="xl">
            ...
          </Text>
          <Page currentPage={false} index={pages - 1} setPage={setPage} />
        </>
      ) : null}

      {pages > 5 && page >= 4 && page <= pages - 5 ? (
        <>
          <Page currentPage={false} index={0} setPage={setPage} />
          <Text p={0} m={0} fontSize="xl">
            ...
          </Text>
          {Array(pages)
            .fill(0)
            .map((v, index) => {
              if (index < page - 2 || index > page + 2) return null;
              const currentPage = index === page;
              return (
                <Page
                  key={index}
                  currentPage={currentPage}
                  index={index}
                  setPage={setPage}
                />
              );
            })
            .filter((page) => page)}
          <Text p={0} m={0} fontSize="xl">
            ...
          </Text>
          <Page currentPage={false} index={pages - 1} setPage={setPage} />
        </>
      ) : null}

      {pages > 5 && page > 5 && page > pages - 5 ? (
        <>
          <Page currentPage={false} index={0} setPage={setPage} />
          <Text p={0} m={0} fontSize="xl">
            ...
          </Text>
          {Array(pages)
            .fill(0)
            .map((v, index) => {
              if (index < pages - 5) return null;
              const currentPage = index === page;
              return (
                <Page
                  key={index}
                  currentPage={currentPage}
                  index={index}
                  setPage={setPage}
                />
              );
            })
            .filter((page) => page)}
        </>
      ) : null}
    </HStack>
  );
}
