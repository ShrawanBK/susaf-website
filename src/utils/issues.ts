import { Impact, ImpactStatistics, IssueObject } from '../typings/webpage';

export const getFilteredIssues = (
    issues: IssueObject[] | undefined,
    filterableImpactLevel: Impact | undefined,
    filterableCriteria: string | undefined,
) => {
    if (!issues || issues.length <= 0) {
        return undefined;
    }

    // remove the issue of there is no occurence.
    // const tmpIssues = [...issues].filter((item) => item.occurences.length > 0);
    const tmpIssues = [...issues];

    if (!filterableImpactLevel && !filterableCriteria) {
        return tmpIssues;
    }
    if (filterableImpactLevel && !filterableCriteria) {
        const filteredIssueByImpact = tmpIssues.filter(
            (issue) => issue.impact === filterableImpactLevel,
        );
        return filteredIssueByImpact;
    }
    if (!filterableImpactLevel && filterableCriteria) {
        const filteredIssueByCriteria = tmpIssues.filter((issue) => {
            const issueCriteriaIds = issue.criteria.map((c) => c.name);
            const criteriaIndex = issueCriteriaIds.findIndex(
                (cid) => cid === filterableCriteria,
            );

            if (criteriaIndex < 0) {
                return undefined;
            }

            return issue;
        });
        return filteredIssueByCriteria.filter((issue) => !!issue);
    }

    const filteredIssueByImpact = tmpIssues.filter(
        (issue) => issue.impact === filterableImpactLevel,
    );
    const filteredIssueByCriteria = filteredIssueByImpact.filter((issue) => {
        const issueCriteriaIds = issue.criteria.map((c) => c.name);
        const criteriaIndex = issueCriteriaIds.findIndex((cid) => cid === filterableCriteria);
        if (criteriaIndex < 0) {
            return undefined;
        }
        return issue;
    });
    return filteredIssueByCriteria.filter((issue) => !!issue);
};

export const getTotalIssuesCount = (
    impactStatistics: ImpactStatistics[] | undefined,
) => {
    if (!impactStatistics) {
        return undefined;
    }
    const countArray = [...impactStatistics].map((i) => i.count);
    const sum = countArray.reduce((a, b) => a + b);
    return sum;
};

export const getSelectedIssues = (
    filteredIssues: IssueObject[] | undefined,
    selectedIssueIds: string[] | undefined,
) => {
    if (!filteredIssues) {
        return undefined;
    }
    if (!selectedIssueIds || selectedIssueIds.length <= 0) {
        return filteredIssues;
    }
    const tmpSelecteIsssues = filteredIssues.filter(
        (issue) => selectedIssueIds.includes(issue.name),
    );
    return tmpSelecteIsssues;
};

export const getWcagCriteriaAndTags = (
    issue: IssueObject,
) => {
    const wcagCriteria = issue.criteria.filter(
        (c) => c.criteriaId.toLowerCase().startsWith('wcag'),
    );
    const tags = issue.criteria.filter(
        (c) => !c.criteriaId.toLowerCase().startsWith('wcag'),
    );
    return [wcagCriteria, tags];
};
