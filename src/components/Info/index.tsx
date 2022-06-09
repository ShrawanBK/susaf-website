import React, { ReactElement } from 'react';

import {
    Center,
    Text,
    VStack,
} from '@chakra-ui/react';

export interface InfoProps {
    icon: ReactElement;
    title: string;
    message: string;
}

function Info(props: InfoProps) {
    const {
        icon,
        title,
        message,
    } = props;

    const formattedMessage = message.charAt(0).toUpperCase() + message.slice(1);

    return (
        <VStack
            p={5}
            spacing={8}
            justifyContent="space-around"
        >
            <Center>
                {icon}
            </Center>
            <Text
                fontSize="x-large"
                fontWeight="bold"
                zIndex={999}
                textTransform="capitalize"
            >
                {title}
            </Text>
            <Text
                mt={4}
                width="40%"
                align="center"
                fontSize="xl"
                zIndex={999}
            >
                {formattedMessage}
            </Text>
        </VStack>
    );
}

export default Info;
