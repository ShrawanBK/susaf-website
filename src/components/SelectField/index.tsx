import React, { useCallback } from 'react';

import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Select,
} from '@chakra-ui/react';

type OptionValue = number | string;

export type Option<Type extends OptionValue> = {
    value: Type;
    label: string;
};

type variant = 'outline' | 'filled' | 'flushed' | 'unstyled';

export interface SelectFieldProps<Type extends OptionValue> {
    options: Option<Type>[];
    label?: string;
    placeholder?: string;
    variant?: variant;
    onSelectOption: (value: string) => void;
    value?: string | number | readonly string[] | undefined;
    negativeTabIndex?: boolean;
    isInvalid?: boolean;
    errorMessage?: string;
}

function SelectField<Type extends OptionValue>(props: SelectFieldProps<Type>) {
    const {
        options = [],
        label = 'label',
        placeholder,
        variant = 'outline',
        onSelectOption,
        value,
        negativeTabIndex = false,
        isInvalid = false,
        errorMessage = '',
    } = props;

    const onChange = useCallback(
        (event: React.ChangeEvent<HTMLSelectElement>) => {
            event.preventDefault();
            onSelectOption(event.target.value);
        },
        [onSelectOption],
    );

    return (
        <FormControl isInvalid={isInvalid}>
            <FormLabel
                htmlFor={label}
            >
                {label}
            </FormLabel>
            <Select
                isReadOnly
                size="lg"
                isFullWidth
                placeholder={placeholder}
                variant={variant}
                title={label}
                id={label}
                onChange={onChange}
                tabIndex={negativeTabIndex ? -1 : undefined}
                background="white"
                value={value}
            >
                {options.map((option) => (
                    <option
                        key={option.label}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </Select>
            {errorMessage && (
                <FormErrorMessage>
                    {errorMessage}
                </FormErrorMessage>
            )}
        </FormControl>
    );
}

export default SelectField;
