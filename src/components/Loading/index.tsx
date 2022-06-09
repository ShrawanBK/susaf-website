import React from 'react';

import {
    CircularProgress,
    Text,
    VStack,
} from '@chakra-ui/react';

export interface LoadingProps {
    message: string;
}

function Loading(props: LoadingProps) {
    const {
        message,
    } = props;
    return (
        <VStack
            p={5}
            spacing={8}
        >
            <CircularProgress
                isIndeterminate
                size="100px"
            />
            <Text
                mt={4}
                width="50%"
                align="center"
                fontSize="x-large"
                fontWeight="bold"
            >
                {message}
            </Text>
        </VStack>
    );
}

export default Loading;
