import {
  Modal as ChakraModal,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
} from '@chakra-ui/react';
import Button from 'components/shared/button';

export default function Modal({
  title,
  isOpen,
  onClose,
  footerAction,
  footerButtonProps,
  footerTitle,
  children,
}) {
  return (
    <ChakraModal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>

        <ModalFooter>
          {footerAction && (
            <Button
              variant="green"
              onClick={footerAction}
              {...footerButtonProps}
            >
              {footerTitle}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
}
