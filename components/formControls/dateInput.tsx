import React, { forwardRef, Fragment } from 'react';

import {
  Select as ChakraSelect,
  InputGroup as ChakraInputGroup,
  FormControl as ChakraFormControl,
  FormLabel as ChakraFormLabel,
  FormErrorMessage as ChakraFormErrorMessage,
  useStyleConfig,
  VisuallyHidden,
  NumberInput,
  Input,
  NumberInputField,
} from '@chakra-ui/react';

const DateInput = (
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
    register,
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
      sx={styles}
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
        {/* <Input
          id={`${id}-day`}
          name={name}
          value={value}
          placeholder={placeholder}
          onFocus={onFocus}
          onClick={onClick}
          onKeyDown={onKeyDown}
          px={3}
          variant={variant}
          size={size}
          sx={styles}
          errorBorderColor="monarchRed"
          type={type}
          {...register(`${id}-day`)}
        >
        </Input> */}

        <NumberInput id={`${id}-day`} size={size}>
          <ChakraFormLabel
            htmlFor={`${id}-day`}
            fontSize="sm"
            color={color ? color : invalid ? 'monarchRed' : 'qukBlue'}
          >
            Day
          </ChakraFormLabel>
          <NumberInputField {...register(`${id}-day`)}></NumberInputField>
        </NumberInput>

        <NumberInput id={`${id}-month`} size={size}>
          <ChakraFormLabel
            htmlFor={`${id}-month`}
            fontSize="sm"
            color={color ? color : invalid ? 'monarchRed' : 'qukBlue'}
          >
            Month
          </ChakraFormLabel>
          <NumberInputField {...register(`${id}-month`)}></NumberInputField>
        </NumberInput>

        <NumberInput id={`${id}-year`} size={size}>
          <ChakraFormLabel
            htmlFor={`${id}-year`}
            fontSize="sm"
            color={color ? color : invalid ? 'monarchRed' : 'qukBlue'}
          >
            Year
          </ChakraFormLabel>
          <NumberInputField {...register(`${id}-year`)}></NumberInputField>
        </NumberInput>
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

export default forwardRef(DateInput);
