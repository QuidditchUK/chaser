import React, { forwardRef, Fragment } from 'react';

import {
  Input as ChakraInput,
  InputGroup as ChakraInputGroup,
  InputRightElement as ChakraInputRightElement,
  InputLeftElement as ChakraInputLeftElement,
  InputLeftAddon as ChakraInputLeftAddon,
  InputRightAddon as ChakraInputRightAddon,
  FormControl as ChakraFormControl,
  FormLabel as ChakraFormLabel,
  FormErrorMessage as ChakraFormErrorMessage,
  useStyleConfig,
  VisuallyHidden,
} from '@chakra-ui/react';

export const InputV2Styles = {
  baseStyle: {
    position: 'relative',
    px: '4',
    border: '1px solid',
    fontFamily: 'body',
    background: 'white',
    borderColor: 'gray.300',
    borderRadius: 'md',
    margin: '0',
    py: '2',
    _hover: {
      borderColor: 'gray.200',
    },
    _disabled: {
      background: 'gray.100',
      borderColor: 'gray.100',
      cursor: 'not-allowed',
    },
    _placeholder: {
      color: 'gray.300',
      opacity: 1,
    },
  },
};

const InputV2 = (
  {
    id,
    name,
    value,
    label,
    hideLabel = false,
    error,
    helperText,
    placeholder,
    isDisabled = false,
    isReadOnly = false,
    isRequired = false,
    isInvalid = false,
    onChange,
    onBlur,
    onFocus,
    onClick,
    onKeyDown,
    rightElementProps,
    leftElementProps,
    rightAddonProps,
    leftAddonProps,
    variant,
    size,
    type,
    ...rest
  },
  ref
) => {
  const invalid = Boolean(error) || isInvalid;
  const LabelWrapper = hideLabel ? VisuallyHidden : Fragment;
  const styles = useStyleConfig('InputV2', { variant, size });

  return (
    <ChakraFormControl
      isInvalid={invalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      {...rest}
    >
      <LabelWrapper>
        <ChakraFormLabel
          htmlFor={id}
          fontSize="sm"
          color={invalid ? 'monarchRed' : 'qukBlue'}
        >
          {label}
        </ChakraFormLabel>
      </LabelWrapper>

      <ChakraInputGroup>
        {leftAddonProps && <ChakraInputLeftAddon {...leftAddonProps} />}
        {leftElementProps && <ChakraInputLeftElement {...leftElementProps} />}
        <ChakraInput
          id={id}
          name={name}
          value={value}
          ref={ref}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          onClick={onClick}
          onKeyDown={onKeyDown}
          paddingLeft={leftElementProps ? '6' : '3'}
          paddingRight={rightElementProps ? '7' : '3'}
          textStyle="text"
          variant={variant}
          size={size}
          sx={styles}
          errorBorderColor="monarchRed"
          type={type}
        />
        {rightElementProps && (
          <ChakraInputRightElement {...rightElementProps} />
        )}
        {rightAddonProps && <ChakraInputRightAddon {...rightAddonProps} />}
      </ChakraInputGroup>

      {error && error.message && (
        <ChakraFormErrorMessage
          role="alert"
          textStyle="text"
          color="monarchRed"
          bg="red.50"
          borderRadius="sm"
          p="4"
        >
          {error.message}
        </ChakraFormErrorMessage>
      )}
    </ChakraFormControl>
  );
};

export default forwardRef(InputV2);
