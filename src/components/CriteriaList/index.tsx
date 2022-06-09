import React from 'react';

import {
    Heading,
    HStack,
    VStack,
} from '@chakra-ui/react';
import { Criteria } from '../../typings/webpage';
import CriteriaItem from './CriteriaItem';

export interface CriteriaListProps {
    title: string;
    itemList: Criteria[];
}

function CriteriaList(props: CriteriaListProps) {
    const {
        title,
        itemList = [],
    } = props;

    if (itemList.length <= 0) {
        return null;
    }

    return (
        <VStack
            alignItems="baseline"
            spacing={2}
            marginBottom={2}
        >
            {itemList.length > 0 && (
                <>
                    <Heading
                        fontWeight="semibold"
                        letterSpacing="wide"
                        fontSize="md"
                        as="h3"
                    >
                        {title}
                    </Heading>
                    <HStack
                        display="flex"
                        flexWrap="wrap"
                    >
                        {itemList.map((item) => (
                            <CriteriaItem
                                key={item.criteriaId}
                                item={item}
                            />
                        ))}
                    </HStack>
                </>
            )}
        </VStack>
    );
}

export default CriteriaList;
