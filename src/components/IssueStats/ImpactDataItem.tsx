import React from 'react';

import {
    Box,
    Heading,
    Text,
} from '@chakra-ui/react';

import { Impact } from '../../typings/webpage';

interface ImpactDataItemProps {
    impact: Impact,
    count: number;
}

export default function ImpactDataItem(props: ImpactDataItemProps) {
    const {
        impact,
        count,
        ...rest
    } = props;
    return (
        <Box
            p={2}
            {...rest}
        >
            <Heading
                fontSize="small"
                letterSpacing={2}
                textTransform="uppercase"
                fontWeight="semibold"
                as="h3"
            >
                {impact}
            </Heading>
            <Text
                mt={1}
                fontSize="xl"
                letterSpacing={1}
                fontWeight="semibold"
            >
                {count}
                {' '}
                Issues
            </Text>
        </Box>
    );
}
