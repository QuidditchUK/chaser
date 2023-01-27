import { ReactNode } from 'react';
import {
  Modal as ChakraModal,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalProps,
} from '@chakra-ui/react';
import Button, { ButtonProps } from 'components/shared/button';

export default function Modal({
  title,
  isOpen,
  onClose,
  footerAction,
  footerButtonProps,
  footerTitle,
  children,
}: ModalProps & {
  title: string;
  footerButtonProps?: ButtonProps;
  footerTitle?: string | ReactNode;
  footerAction?: () => void;
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
