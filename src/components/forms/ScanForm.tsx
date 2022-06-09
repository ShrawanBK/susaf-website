import React, { ChangeEvent, useCallback, useState } from 'react';
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    HStack,
    FormErrorMessage,
} from '@chakra-ui/react';

interface Props {
    processingUrl: boolean;
    onScanWebpage: () => void;
    handleUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
    url: string;
    negativeTabIndex?: boolean;
}

function ScanForm(props: Props) {
    const {
        handleUrlChange,
        url,
        processingUrl,
        onScanWebpage,
        negativeTabIndex = false,
    } = props;

    const [urlError, setUrlError] = useState('');

    const handleSubmit = useCallback(
        (event) => {
            event.preventDefault();
            if (!url) {
                setUrlError('Please enter a valid url');
                return;
            }
            onScanWebpage();
        },
        [onScanWebpage, url],
    );

    const onChangeUrlInput = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (urlError) {
                setUrlError('');
            }
            handleUrlChange(e);
        },
        [handleUrlChange, urlError],
    );

    return (
        <form onSubmit={handleSubmit}>
            <FormControl
                isInvalid={!!urlError}
                flex={2}
            >
                <FormLabel htmlFor="url">
                    URL
                </FormLabel>
                <HStack spacing={0}>
                    <Input
                        id="url"
                        // type="url"
                        value={url}
                        onChange={onChangeUrlInput}
                        width="90%"
                        placeholder="Enter webpage url (https://www.examplewebsite.example)"
                        background="whiteAlpha.900"
                        borderTopRightRadius={0}
                        borderBottomRightRadius={0}
                        tabIndex={negativeTabIndex ? -1 : undefined}
                        height={12}
                        autoComplete="off"
                    />
                    <Button
                        type="submit"
                        disabled={processingUrl}
                        width="10%"
                        colorScheme="brand"
                        borderTopLeftRadius={0}
                        borderBottomLeftRadius={0}
                        tabIndex={negativeTabIndex ? -1 : undefined}
                        height={12}
                    >
                        SCAN
                    </Button>
                </HStack>
                {urlError && (
                    <FormErrorMessage>
                        {urlError}
                    </FormErrorMessage>
                )}
            </FormControl>
        </form>
    );
}
export default ScanForm;
