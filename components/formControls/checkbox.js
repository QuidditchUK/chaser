import React, { forwardRef, Fragment } from 'react';

import {
  Checkbox as ChakraCheckbox,
  FormControl as ChakraFormControl,
  FormErrorMessage as ChakraFormErrorMessage,
  VisuallyHidden,
} from '@chakra-ui/react';

const Checkbox = (
  {
    id,
    name,
    value,
    children,
    hideLabel = false,
    error,
    isDisabled = false,
    isReadOnly = false,
    isRequired = false,
    isInvalid = false,
    onChange,
    onBlur,
    onFocus,
    onClick,
    onKeyDown,
    size,
    colorScheme = 'green',
    fontSize = 'sm',
    fontWeight = 'normal',
    ...rest
  },
  ref
) => {
  const invalid = Boolean(error) || isInvalid;
  const LabelWrapper = hideLabel ? VisuallyHidden : Fragment;

  return (
    <ChakraFormControl
      isInvalid={invalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      {...rest}
    >
      <ChakraCheckbox
        id={id}
        name={name}
        value={value}
        ref={ref}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        onClick={onClick}
        onKeyDown={onKeyDown}
        colorScheme={colorScheme}
        size={size}
        errorBorderColor="monarchRed"
        isChecked={value}
      >
        <LabelWrapper color={invalid ? 'monarchRed' : 'qukBlue'}>
          {children}
        </LabelWrapper>
      </ChakraCheckbox>

      {error && error.message && (
        <ChakraFormErrorMessage
          role="alert"
          textStyle="text"
          color="monarchRed"
          bg="red.50"
          borderRadius="md"
          p="4"
        >
          {error.message}
        </ChakraFormErrorMessage>
      )}
    </ChakraFormControl>
  );
};

export default forwardRef(Checkbox);
