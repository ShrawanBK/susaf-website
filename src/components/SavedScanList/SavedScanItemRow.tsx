import React, { useCallback, useMemo } from 'react';

import {
    Box,
    Button,
    HStack,
    Td,
    Text,
    Tr,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { formatDateTime } from '../../utils/common';
import { SavedScanItem } from '../../typings/savedscans';

export interface Props {
    onSetDeletableId: (id: string) => void;
    item: SavedScanItem;
    negativeTabIndex?: boolean;
}

function SavedScansItemRow(props: Props) {
    const {
        item,
        onSetDeletableId,
        negativeTabIndex,
    } = props;

    const navigate = useNavigate();
    const onViewButtonClicked = useCallback(
        () => navigate(`/saved_scans/${item.id}`),
        [item.id, navigate],
    );

    const onDeleteButtonClicked = useCallback(
        () => onSetDeletableId(item.id),
        [item.id, onSetDeletableId],
    );

    const scannedTime = useMemo(
        () => formatDateTime(item.scanTime),
        [item.scanTime],
    );

    return (
        <Tr>
            <Td>
                <Box>
                    {item.name}
                </Box>
            </Td>
            <Td>
                <Box maxWidth={300}>
                    {item.url}
                </Box>
            </Td>
            <Td>
                {item.website}
            </Td>
            <Td>{scannedTime}</Td>
            <Td>
                <HStack spacing={2}>
                    <Button
                        type="button"
                        h={10}
                        letterSpacing={1}
                        colorScheme="blue"
                        background="blue.700"
                        tabIndex={negativeTabIndex ? -1 : undefined}
                        onClick={onViewButtonClicked}
                    >
                        View
                    </Button>
                    <Button
                        type="button"
                        h={10}
                        letterSpacing={1}
                        colorScheme="red"
                        background="red.700"
                        tabIndex={negativeTabIndex ? -1 : undefined}
                        onClick={onDeleteButtonClicked}
                    >
                        Delete
                    </Button>
                </HStack>
            </Td>
        </Tr>
    );
}

export default SavedScansItemRow;
