import React from 'react';

import { Box } from '@chakra-ui/react';

import EditableIssueItem from './EditableIssueItem';
import Placeholder from '../Placeholder';

import { IssueObject, DeletableOccurenceData } from '../../typings/webpage';

interface IssueListProps {
    issueList: IssueObject[] | undefined;
    onSetDeletableOccurenceData: (data: DeletableOccurenceData) => void;
    onSetEditableIssue: (issueItem: IssueObject) => void;
    negativeTabIndex?: boolean;
}

function EditableIssueList(props: IssueListProps) {
    const {
        issueList,
        onSetDeletableOccurenceData,
        onSetEditableIssue,
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
                <EditableIssueItem
                    key={issue.issueId}
                    issue={issue}
                    onSetDeletableOccurenceData={onSetDeletableOccurenceData}
                    onSetEditableIssue={onSetEditableIssue}
                    negativeTabIndex={negativeTabIndex}
                />
            ))}
        </Box>
    );
}

export default EditableIssueList;
