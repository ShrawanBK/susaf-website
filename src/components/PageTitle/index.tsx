import React from 'react';

import {
    Divider,
    Heading,
    VStack,
} from '@chakra-ui/react';

export interface Props {
    title?: string;
}

function PageTitle(props: Props) {
    const {
        title,
    } = props;
    return (
        <VStack
            background="#045981"
            padding={4}
        >
            <Heading
                as="h1"
                size="xl"
                role="heading"
                wordBreak="break-word"
                color="white"
                textTransform="uppercase"
            >
                {title}
            </Heading>
            <Divider width="80%" />
        </VStack>
    );
}

export default PageTitle;
