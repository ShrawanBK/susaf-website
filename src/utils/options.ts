import { IssueObject, Impact } from '../typings/webpage';

export const getCriteriaOptions = (
    issues: IssueObject[] | undefined,
    filterableImpactLevel: Impact | undefined,
) => {
    if (!issues || issues.length <= 0) {
        return [];
    }

    const seen = new Set();
    let tmpCriteria;
    if (!filterableImpactLevel) {
        tmpCriteria = [...issues].map((issue) => issue.criteria);
    } else {
        tmpCriteria = [...issues].filter(
            (issue) => issue.impact === filterableImpactLevel,
        ).map((filteredIssue) => filteredIssue.criteria);
    }
    const flatTmpCriteria = tmpCriteria.flat();
    const filteredCriteria = flatTmpCriteria.filter((c) => {
        const duplicate = seen.has(c.name);
        seen.add(c.name);
        return !duplicate;
    });
    return filteredCriteria.map((item) => ({
        label: item.name,
        value: item.name,
    }));
};

export const getImpactLevelOptions = (issues: IssueObject[] | undefined) => {
    if (!issues || issues.length <= 0) {
        return [];
    }
    const possibleImpact: Impact[] = ['critical', 'minor', 'moderate', 'serious'];
    const tmpImpact = [...issues].map((issue) => ({
        impact: issue.impact,
        count: issue.occurences.length,
    }));
    return possibleImpact.map((impact) => {
        // const countImpact = tmpImpact.filter((tmp) => tmp.impact === impact).length;
        const indImpacts = tmpImpact.filter((tmp) => tmp.impact === impact);
        const countIndImpact = 0;
        const sumCount = indImpacts.reduce(
            (prevValue, currentValue) => prevValue + currentValue.count,
            countIndImpact,
        );
        return {
            // Capitalize first letter of impact
            label: `${impact.charAt(0).toUpperCase() + impact.slice(1)} (${sumCount})`,
            value: impact,
        };
    });
};
