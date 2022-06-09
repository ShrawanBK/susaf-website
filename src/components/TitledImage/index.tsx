import React from 'react';

import { Box, Heading, Image, VStack } from '@chakra-ui/react';

export interface Props {
    title?: string;
    imagePath?: string;
    width?: string;
}

function TitledImage(props: Props) {
    const {
        title,
        imagePath,
        width = '100%',
    } = props;
    return (
        <Box
            width={width}
            marginTop="1vh"
            background="white"
            padding={4}
            display="flex"
            flexDir="column"
        >
            {title && (
                <Heading
                    fontWeight="semibold"
                    letterSpacing="wide"
                    fontSize="4xl"
                    as="h2"
                    wordBreak="break-word"
                    m={4}
                    textAlign="center"
                >
                    {title}
                </Heading>
            )}
            <Image
                src={imagePath}
                alt={title}
                role="img"
                objectFit="cover"
            />
        </Box>
    );
}

export default TitledImage;
