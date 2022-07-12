import React, { forwardRef, Fragment } from 'react';

import {
  Textarea as ChakraTextarea,
  InputGroup as ChakraInputGroup,
  FormControl as ChakraFormControl,
  FormLabel as ChakraFormLabel,
  FormErrorMessage as ChakraFormErrorMessage,
  useStyleConfig,
  VisuallyHidden,
} from '@chakra-ui/react';

const TextareaV2 = (
  {
    id,
    name,
    value,
    label,
    hideLabel = false,
    error,
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
    variant,
    size,
    resize = 'vertical',
    color,
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
          color={color ? color : invalid ? 'monarchRed' : 'qukBlue'}
        >
          {label}
        </ChakraFormLabel>
      </LabelWrapper>

      <ChakraInputGroup>
        <ChakraTextarea
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
          px={3}
          variant={variant}
          size={size}
          sx={styles}
          errorBorderColor="monarchRed"
          resize={resize}
        />
      </ChakraInputGroup>

      {error && error.message && (
        <ChakraFormErrorMessage
          role="alert"
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

export default forwardRef(TextareaV2);
