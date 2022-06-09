import React, { useCallback } from 'react';

import { IconButton, Box, Flex } from '@chakra-ui/react';

import DoubleNextArrowIcon from '../icons/DoubleNextArrow';
import DoublePreviousArrowIcon from '../icons/DoublePreviousArrow';
import NextArrowIcon from '../icons/NextArrow';
import PreviousArrowIcon from '../icons/PreviousArrow';

interface Props {
    pageIndex?: number;
    totalPages?: number;
    onChangePage: React.Dispatch<React.SetStateAction<number>>;
    negativeTabIndex?: boolean;
}

function Paginator(props: Props) {
    const {
        pageIndex = 0,
        totalPages = 1,
        onChangePage,
        negativeTabIndex,
    } = props;

    const maxPageIndex = totalPages - 1;

    const onIncrementPage = useCallback(
        () => {
            if (pageIndex >= maxPageIndex) {
                return;
            }
            onChangePage(pageIndex + 1);
        },
        [pageIndex, maxPageIndex, onChangePage],
    );

    const onDecrementPage = useCallback(
        () => {
            if (pageIndex === 0) {
                return;
            }
            onChangePage(pageIndex - 1);
        },
        [onChangePage, pageIndex],
    );

    const onResetPage = () => onChangePage(0);

    const onSetMaxPage = () => onChangePage(maxPageIndex);

    const previousArrowDisabled = pageIndex === 0;
    const nextArrowDisabled = pageIndex === maxPageIndex;

    return (
        <Flex
            justifyContent="space-between"
            alignItems="center"
        >
            <IconButton
                onClick={onResetPage}
                aria-label="First page"
                icon={<DoublePreviousArrowIcon />}
                variant="outline"
                disabled={previousArrowDisabled}
                tabIndex={negativeTabIndex ? -1 : undefined}
            />
            <IconButton
                onClick={onDecrementPage}
                aria-label="Decrease page"
                icon={<PreviousArrowIcon />}
                variant="outline"
                disabled={previousArrowDisabled}
                tabIndex={negativeTabIndex ? -1 : undefined}
            />
            <Box
                as="span"
                mx="24px"
            >
                {pageIndex + 1}
                {' '}
                /
                {' '}
                {totalPages}
            </Box>
            <IconButton
                onClick={onIncrementPage}
                aria-label="Increase page number"
                icon={<NextArrowIcon />}
                variant="outline"
                disabled={nextArrowDisabled}
                tabIndex={negativeTabIndex ? -1 : undefined}
            />
            <IconButton
                onClick={onSetMaxPage}
                aria-label="Last Page"
                icon={<DoubleNextArrowIcon />}
                variant="outline"
                disabled={nextArrowDisabled}
                tabIndex={negativeTabIndex ? -1 : undefined}
            />
        </Flex>
    );
}

export default Paginator;
