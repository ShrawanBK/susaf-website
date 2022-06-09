import React from 'react';

import { CloseButton, HStack, VStack, Text, ToastOptions, Spacer } from '@chakra-ui/react';

interface Props {
    onCloseToast: () => void;
    title?: string;
    description?: string;
    status?: ToastOptions['status'];
    actionableView?: React.ReactNode;
}

const backgroundColorOption = {
    default: 'white',
    success: 'green.600',
    info: 'cyan.900',
    error: 'red.700',
    warning: 'orange.500',
};

function ToastBox(props: Props) {
    const {
        onCloseToast,
        title = 'title',
        description = 'description',
        status = 'success',
        actionableView = null,
    } = props;

    const bgColor = backgroundColorOption[status];

    const textColor = status === 'warning' ? 'black' : 'white';

    return (
        <HStack
            p={3}
            bg={bgColor}
            width="auto"
            maxWidth={400}
            alignItems="flex-start"
            px={4}
            py={3}
            borderRadius="lg"
            boxShadow="md"
            role="alert"
        >
            <VStack alignItems="flex-start">
                <Text
                    color={textColor}
                    fontWeight="bold"
                >
                    {title}
                </Text>
                <Text color={textColor}>
                    {description}
                </Text>
                {actionableView}
            </VStack>
            <Spacer />
            <CloseButton
                size="sm"
                onClick={onCloseToast}
                alignSelf="flex-start"
                color="white"
            />
        </HStack>
    );
}

export default ToastBox;
