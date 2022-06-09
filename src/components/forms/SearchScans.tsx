import React, { ChangeEvent, useCallback } from 'react';

import {
    Button,
    FormControl,
    FormLabel,
    HStack,
    Input,
} from '@chakra-ui/react';

interface Props {
    onSubmitSearch: React.Dispatch<React.SetStateAction<string>>;
    searchFormText: string;
    setSearchFormText: React.Dispatch<React.SetStateAction<string>>;
    negativeTabIndex?: boolean;
}

function SearchScans(props: Props) {
    const {
        onSubmitSearch,
        searchFormText,
        setSearchFormText,
        negativeTabIndex,
    } = props;

    const onSearchValueChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setSearchFormText(e.target.value);
        },
        [setSearchFormText],
    );

    const handleSubmit = useCallback(
        (event) => {
            event.preventDefault();
            onSubmitSearch(searchFormText);
        },
        [onSubmitSearch, searchFormText],
    );

    return (
        <form onSubmit={handleSubmit}>
            <FormControl flex={2}>
                <FormLabel htmlFor="searchField">Webpage or Website Name</FormLabel>
                <HStack spacing={0}>
                    <Input
                        id="searchField"
                        onChange={onSearchValueChange}
                        width="80%"
                        placeholder="Enter webpage or website name"
                        background="whiteAlpha.900"
                        borderTopRightRadius={0}
                        borderBottomRightRadius={0}
                        value={searchFormText}
                        type="search"
                        autoComplete="off"
                        tabIndex={negativeTabIndex ? -1 : undefined}
                    />
                    <Button
                        type="submit"
                        width="10%"
                        colorScheme="brand"
                        borderTopLeftRadius={0}
                        borderBottomLeftRadius={0}
                        tabIndex={negativeTabIndex ? -1 : undefined}
                    >
                        Search
                    </Button>
                </HStack>
            </FormControl>
        </form>
    );
}

export default SearchScans;
