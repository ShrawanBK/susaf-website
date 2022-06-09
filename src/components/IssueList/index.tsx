import React from 'react';

import { Box } from '@chakra-ui/react';

import IssueItem from './IssueItem';
import { IssueObject } from '../../typings/webpage';
import Placeholder from '../Placeholder';

interface IssueListProps {
    issueList: IssueObject[] | undefined;
    selectedIssueIds: IssueObject['issueId'][] | undefined;
    onUpdateSelectedIssue: (id: IssueObject['issueId']) => void;
    negativeTabIndex?: boolean;
}

function IssueList(props: IssueListProps) {
    const {
        issueList,
        selectedIssueIds,
        onUpdateSelectedIssue,
        negativeTabIndex = false,
    } = props;

    if (!issueList || issueList.length <= 0) {
        return (
            <Placeholder />
        );
    }
    return (
        <Box>
            {issueList.map((issue) => (
                <IssueItem
                    key={issue.name}
                    issue={issue}
                    selectedIssues={selectedIssueIds}
                    onUpdateSelectedIssue={onUpdateSelectedIssue}
                    negativeTabIndex={negativeTabIndex}
                />
            ))}
        </Box>
    );
}

export default IssueList;
