import React, { useMemo } from 'react';
import {
    VStack,
    Box,
    Heading,
    Text,
    Spacer,
} from '@chakra-ui/react';

import { FoundStatistics } from '../../typings/webpage';

export interface Props {
    foundStatistics: FoundStatistics[] | undefined;
}

const getIssueTypeCount = (
    type: FoundStatistics['found'],
    list: FoundStatistics[] | undefined,
) => list?.find((i) => i.found === type)?.count ?? 'N/A';

export default function IssueTypeCard(props: Props) {
    const {
        foundStatistics,
        ...rest
    } = props;

    const automatic = useMemo(
        () => getIssueTypeCount('automatic', foundStatistics),
        [foundStatistics],
    );

    const reviewable = useMemo(
        () => getIssueTypeCount('needsReview', foundStatistics),
        [foundStatistics],
    );

    const guided = useMemo(
        () => getIssueTypeCount('guided', foundStatistics),
        [foundStatistics],
    );

    const manual = useMemo(
        () => getIssueTypeCount('manual', foundStatistics),
        [foundStatistics],
    );

    const manualShown = manual > 0 && manual !== 'N/A';
    return (
        <VStack
            p={2}
            align="stretch"
        >
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
                    automatic
                </Heading>
                <Text
                    mt={1}
                    fontSize="xl"
                    letterSpacing={1}
                    fontWeight="semibold"
                >
                    {`${automatic} issues ${reviewable <= 0 ? '' : `(${reviewable} needs review)`}`}
                </Text>
            </Box>
            <Box p={2} display="flex">
                <VStack alignItems="flex-start">
                    <Heading
                        fontSize="small"
                        textTransform="uppercase"
                        fontWeight="semibold"
                        letterSpacing={2}
                        as="h3"
                    >
                        guided
                    </Heading>
                    <Text
                        mt={1}
                        fontSize="xl"
                        fontWeight="bold"
                    >
                        {guided}
                        {' '}
                        Issues
                    </Text>
                </VStack>
                <Spacer maxWidth="md" />
                {manualShown && (
                    <VStack alignItems="flex-start">
                        <Heading
                            fontSize="small"
                            textTransform="uppercase"
                            fontWeight="semibold"
                            letterSpacing={2}
                            as="h3"
                        >
                            manual
                        </Heading>
                        <Text
                            mt={1}
                            fontSize="xl"
                            fontWeight="bold"
                        >
                            {manual}
                            {' '}
                            Issues
                        </Text>
                    </VStack>
                )}
            </Box>
        </VStack>
    );
}
