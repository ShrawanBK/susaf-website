import React, {
    useCallback,
    useMemo,
    useState,
} from 'react';

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
    useBoolean,
    Button,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

import CriteriaList from '../CriteriaList';
import Paginator from '../Paginator';

import { IssueObject, DeletableOccurenceData, FoundType } from '../../typings/webpage';
import { getWcagCriteriaAndTags } from '../../utils/issues';

interface IssueListProps {
    issue: IssueObject;
    onSetEditableIssue: (issueItem: IssueObject) => void;
    onSetDeletableOccurenceData: (data: DeletableOccurenceData) => void;
    negativeTabIndex?: boolean;
}

function EditableIssueItem(props: IssueListProps) {
    const {
        issue,
        onSetDeletableOccurenceData,
        onSetEditableIssue,
        negativeTabIndex = false,
    } = props;

    const [isExpanded, setIsExpanded] = useBoolean();

    const [currentOccurenceIndex, setCurrentOccurenceIndex] = useState(0);

    const currentOccurence = issue.occurences[currentOccurenceIndex];

    const [wcagCriteria, tags] = useMemo(
        () => getWcagCriteriaAndTags(issue),
        [issue],
    );

    const onClickDelete = useCallback(
        () => {
            onSetDeletableOccurenceData({
                occurenceId: currentOccurence.occurenceId,
                issueId: issue.issueId,
                issueName: issue.name,
                issueDeletable: issue.occurences.length === 1,
                impact: issue.impact,
                found: issue.found as FoundType,
                needsReview: currentOccurence.needsReview ?? false,
            });
        },
        [
            currentOccurence.occurenceId,
            issue.issueId,
            issue.name,
            onSetDeletableOccurenceData,
            issue.occurences,
            issue.impact,
            issue.found,
            currentOccurence.needsReview,
        ],
    );

    const onClickEdit = useCallback(
        () => {
            onSetEditableIssue({
                ...issue,
                occurences: [currentOccurence],
            });
        },
        [onSetEditableIssue, issue, currentOccurence],
    );
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
                            <VStack alignItems="flex-end">
                                {issue.occurences.length > 1 && (
                                    <Paginator
                                        pageIndex={currentOccurenceIndex}
                                        totalPages={issue.occurences.length}
                                        onChangePage={setCurrentOccurenceIndex}
                                        negativeTabIndex={negativeTabIndex}
                                    />
                                )}
                                <HStack spacing={2}>
                                    <Button
                                        type="button"
                                        h={10}
                                        letterSpacing={1}
                                        tabIndex={negativeTabIndex ? -1 : undefined}
                                        colorScheme="blue"
                                        background="blue.700"
                                        onClick={onClickEdit}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        type="button"
                                        h={10}
                                        letterSpacing={1}
                                        tabIndex={negativeTabIndex ? -1 : undefined}
                                        colorScheme="red"
                                        background="red.700"
                                        onClick={onClickDelete}
                                    >
                                        Delete
                                    </Button>
                                </HStack>
                            </VStack>
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
                        {currentOccurence.location && (
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
                        )}
                        {currentOccurence.source && (
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
                        )}
                        {currentOccurence.fix && (
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
                        )}
                        {currentOccurence.note && (
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
                                    Note
                                </Heading>
                                <Text>
                                    {currentOccurence.note}
                                </Text>
                            </VStack>
                        )}
                    </VStack>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
}

export default EditableIssueItem;
