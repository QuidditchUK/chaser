import { useState, useCallback, useEffect } from 'react';
import copy from 'copy-to-clipboard';
import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Text } from '@chakra-ui/react';

function useClipboard(text) {
  const [hasCopied, setHasCopied] = useState(false);

  const timeout = 1500;

  const onCopy = useCallback(() => {
    const didCopy = copy(text);
    setHasCopied(didCopy);
  }, [text]);

  useEffect(() => {
    let timeoutId = null;

    if (hasCopied) {
      timeoutId = window.setTimeout(() => {
        setHasCopied(false);
      }, timeout);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [timeout, hasCopied]);

  return { value: text, onCopy, hasCopied };
}

export default function CopyValueButton({ copyableValue }) {
  const { onCopy, hasCopied } = useClipboard(`${copyableValue}`);

  return (
    <Flex direction="row" my="auto" alignItems="center">
      {hasCopied && (
        <Text m="0" mr={2} textColor="gray.400">
          Copied
        </Text>
      )}
      <IconButton
        aria-label="Copy"
        bg="transparent"
        color="blue.400"
        _hover={{
          color: 'qukBlue',
        }}
        border="none"
        p={0}
        icon={
          hasCopied ? (
            <CheckIcon color="keeperGreen" />
          ) : (
            <CopyIcon color="blue.500" />
          )
        }
        onClick={onCopy}
      />
    </Flex>
  );
}
