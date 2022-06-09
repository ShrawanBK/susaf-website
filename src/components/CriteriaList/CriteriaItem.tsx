import React, { useCallback } from 'react';

import {
    Button,
    Text,
    Tooltip,
} from '@chakra-ui/react';

import { Criteria } from '../../typings/webpage';

export interface Props {
    item: Criteria;
}

function CriteriaItem(props: Props) {
    const {
        item,
    } = props;

    const onClickItem = useCallback(
        () => {
            if (!item.note) {
                return;
            }
            window.open(item.note);
        },
        [item.note],
    );

    return (
        <Tooltip
            label={item.note}
            key={item.criteriaId}
        >
            <Button
                onClick={onClickItem}
                size="sm"
            >
                <Text fontWeight="normal">
                    {item.name}
                </Text>
            </Button>
        </Tooltip>
    );
}

export default CriteriaItem;
