import React, { forwardRef, Fragment } from 'react';

import {
  Switch as ChakraSwitch,
  FormControl as ChakraFormControl,
  FormLabel as ChakraFormLabel,
  FormErrorMessage as ChakraFormErrorMessage,
  VisuallyHidden,
} from '@chakra-ui/react';

const Switch = (
  {
    id,
    name,
    value,
    label,
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
    colorScheme,
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
      <LabelWrapper>
        <ChakraFormLabel
          htmlFor={id}
          fontSize={fontSize}
          fontWeight={fontWeight}
          color={invalid ? 'monarchRed' : 'qukBlue'}
          m={0}
        >
          {label}
        </ChakraFormLabel>
      </LabelWrapper>

      <ChakraSwitch
        id={id}
        name={name}
        value={value}
        ref={ref}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        onClick={onClick}
        onKeyDown={onKeyDown}
        paddingLeft={3}
        paddingRight={3}
        colorScheme={colorScheme}
        size={size}
        errorBorderColor="monarchRed"
        isChecked={value}
      />

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

export default forwardRef(Switch);
