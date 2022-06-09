import React from 'react';

import { Text } from '@chakra-ui/react';

export interface Props {
    text?: string;
}

function Placeholder(props: Props) {
    const {
        text = 'nothing to show',
    } = props;
    return (
        <Text
            mt={4}
            align="center"
            fontSize="xl"
        >
            {text}
        </Text>
    );
}

export default Placeholder;
