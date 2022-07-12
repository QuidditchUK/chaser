import React, { forwardRef, Fragment } from 'react';

import {
  Select as ChakraSelect,
  InputGroup as ChakraInputGroup,
  FormControl as ChakraFormControl,
  FormLabel as ChakraFormLabel,
  FormErrorMessage as ChakraFormErrorMessage,
  useStyleConfig,
  VisuallyHidden,
} from '@chakra-ui/react';

const Select = (
  {
    id,
    name,
    value,
    options,
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
    type,
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
        <ChakraSelect
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
          variant={variant}
          size={size}
          sx={styles}
          errorBorderColor="monarchRed"
        >
          {options.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </ChakraSelect>
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

export default forwardRef(Select);
