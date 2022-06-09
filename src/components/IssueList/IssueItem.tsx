import React, { useCallback, useMemo, useState } from 'react';

import {
    Text,
    VStack,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Box,
    Heading,
    Divider,
    Code,
    HStack,
    Checkbox,
    useBoolean,
} from '@chakra-ui/react';
import {
    ChevronDownIcon,
    ChevronUpIcon,
} from '@chakra-ui/icons';

import CriteriaList from '../CriteriaList';
import Paginator from '../Paginator';

import { getWcagCriteriaAndTags } from '../../utils/issues';
import { IssueObject } from '../../typings/webpage';

interface IssueListProps {
    issue: IssueObject;
    selectedIssues: IssueObject['name'][] | undefined;
    onUpdateSelectedIssue: (id: IssueObject['name']) => void;
    negativeTabIndex?: boolean;
}

function IssueItem(props: IssueListProps) {
    const {
        issue,
        selectedIssues,
        onUpdateSelectedIssue,
        negativeTabIndex = false,
    } = props;

    const [isExpanded, setIsExpanded] = useBoolean();

    const [currentOccurenceIndex, setCurrentOccurenceIndex] = useState(0);

    const currentOccurence = useMemo(
        () => {
            if (!issue.occurences || issue.occurences.length <= 0) {
                return undefined;
            }
            return issue.occurences[currentOccurenceIndex];
        },
        [currentOccurenceIndex, issue.occurences],
    );

    const isSelected = useMemo(
        () => [...selectedIssues ?? []]?.includes(issue.name),
        [issue.name, selectedIssues],
    );

    const onClickCheckbox = useCallback(
        () => onUpdateSelectedIssue(issue.name),
        [issue.name, onUpdateSelectedIssue],
    );

    const [wcagCriteria, tags] = useMemo(
        () => getWcagCriteriaAndTags(issue),
        [issue],
    );

    if (!currentOccurence) {
        return null;
    }

    return (
        <Accordion
            allowToggle
            borderColor="transparent"
            onChange={setIsExpanded.toggle}
            tabIndex={negativeTabIndex ? -1 : undefined}
        >
            <AccordionItem tabIndex={negativeTabIndex ? -1 : undefined}>
                <HStack
                    justifyContent="center"
                    alignItems="center"
                    background={isExpanded ? '#B3EFFF' : 'rgba(0, 0, 0, 0.04)'}
                >
                    <Checkbox
                        aria-label={issue.name}
                        isChecked={isSelected}
                        onChange={onClickCheckbox}
                        borderColor={isSelected ? 'transparent' : '#045981'}
                        marginLeft={4}
                        tabIndex={negativeTabIndex ? -1 : undefined}
                    />
                    <AccordionButton
                        _expanded={{
                            bg: '#B3EFFF',
                            color: '#045981',
                        }}
                        justifyContent="space-between"
                        tabIndex={negativeTabIndex ? -1 : undefined}
                    >
                        <Text>
                            {issue.name}
                        </Text>
                        <Text>
                            {`${issue.occurences.length} occurence(s) |`}
                            {isExpanded ? (
                                <ChevronUpIcon w={6} h={6} />
                            ) : (
                                <ChevronDownIcon w={6} h={6} />
                            )}
                        </Text>
                    </AccordionButton>
                </HStack>
                <AccordionPanel
                    pb={4}
                    border="1px solid #E5E5E5"
                    borderBottomRadius={4}
                    borderTop="none"
                >
                    <VStack
                        alignItems="baseline"
                        spacing={4}
                        marginTop={4}
                        key={currentOccurence.occurenceId}
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            width="100%"
                        >
                            <VStack
                                alignItems="baseline"
                                spacing={2}
                            >
                                <CriteriaList
                                    title="WCAG Criteria"
                                    itemList={wcagCriteria}
                                />
                                <CriteriaList
                                    title="Tags"
                                    itemList={tags}
                                />
                                <HStack alignItems="center">
                                    <Heading
                                        fontWeight="semibold"
                                        letterSpacing="wide"
                                        fontSize="md"
                                        as="h3"
                                    >
                                        Impact:
                                    </Heading>
                                    <Text>
                                        {issue.impact}
                                    </Text>
                                    <Divider
                                        orientation="vertical"
                                        borderColor="black"
                                        borderLeftWidth={2}
                                        height={4}
                                    />
                                    <Heading
                                        fontWeight="semibold"
                                        letterSpacing="wide"
                                        fontSize="md"
                                        as="h3"
                                    >
                                        Found:
                                    </Heading>
                                    <Text>
                                        {issue.found}
                                    </Text>
                                    {currentOccurence.needsReview && (
                                        <>
                                            <Divider
                                                orientation="vertical"
                                                borderColor="black"
                                                borderLeftWidth={2}
                                                height={4}
                                            />
                                            <Text fontWeight="bold">
                                                Needs Review
                                            </Text>
                                        </>
                                    )}
                                </HStack>
                            </VStack>
                            {issue.occurences.length > 1 && (
                                <Paginator
                                    pageIndex={currentOccurenceIndex}
                                    totalPages={issue.occurences.length}
                                    onChangePage={setCurrentOccurenceIndex}
                                    negativeTabIndex={negativeTabIndex}
                                />
                            )}
                        </Box>
                        <Divider />
                        <VStack
                            spacing={2}
                            alignItems="baseline"
                        >
                            <Heading
                                fontWeight="semibold"
                                letterSpacing="wide"
                                fontSize="md"
                                as="h3"
                            >
                                Issue Description
                            </Heading>
                            <Text>
                                {currentOccurence.description}
                            </Text>
                        </VStack>
                        <VStack
                            spacing={2}
                            alignItems="baseline"
                            align="stretch"
                        >
                            <Heading
                                fontWeight="semibold"
                                letterSpacing="wide"
                                fontSize="md"
                                ml={1}
                                as="h4"
                            >
                                • Element Location
                            </Heading>
                            <Code ml={1} p={4}>
                                {currentOccurence.location}
                            </Code>
                        </VStack>
                        <VStack
                            align="stretch"
                            alignItems="baseline"
                            marginLeft="10px"
                            spacing={2}
                        >
                            <Heading
                                fontWeight="semibold"
                                letterSpacing="wide"
                                fontSize="md"
                                ml={1}
                                as="h4"
                            >
                                • Element Source
                            </Heading>
                            <Code ml={1} p={4}>
                                {currentOccurence.source}
                            </Code>
                        </VStack>
                        <VStack
                            alignItems="baseline"
                            spacing={2}
                        >
                            <Heading
                                fontWeight="semibold"
                                letterSpacing="wide"
                                fontSize="md"
                                as="h3"
                            >
                                How to Fix?
                            </Heading>
                            <Text>
                                {currentOccurence.fix}
                            </Text>
                        </VStack>
                    </VStack>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
}

export default IssueItem;
