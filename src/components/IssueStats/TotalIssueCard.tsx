import React from 'react';

import {
    Center,
    Heading,
    Image,
    Text,
    VStack,
} from '@chakra-ui/react';

interface TotalIssueCardProps {
    totalCount: number | undefined;
}

export default function TotalIssueCard(props: TotalIssueCardProps) {
    const {
        totalCount,
    } = props;
    return (
        <Center
            p={2}
            h="100%"
            borderRadius="md"
            background="#B00D0D"
        >
            <VStack
                justifyContent="center"
                alignItems="center"
                spacing={2}
            >
                <Image
                    src="https://www.designmuseum.fi/wp-content/uploads/2014/08/icon-info-white.png"
                    height={30}
                    width={30}
                    alt="info"
                />
                <>
                    <Heading
                        fontSize="2xl"
                        color="white"
                    >
                        {totalCount ?? 'N/A'}
                    </Heading>
                    <Text
                        fontSize="md"
                        color="white"
                    >
                        issues
                    </Text>
                </>
            </VStack>
        </Center>
    );
}
