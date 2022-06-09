import React from 'react';

import {
    Grid,
    GridItem,
    Center,
    Divider,
} from '@chakra-ui/react';

import TotalIssueCard from './TotalIssueCard';
import IssueTypeCard from './IssueTypeCard';
import ImpactDataCard from './ImpactDataCard';

import {
    FoundStatistics,
    ImpactStatistics,
} from '../../typings/webpage';

export interface IssueStatsProps {
    impactStatistics: ImpactStatistics[] | undefined;
    foundStatistics: FoundStatistics[] | undefined;
    totalIssuesCount: number | undefined;
}

// TODO: Finalize the data structure with BE
function IssueStats(props: IssueStatsProps) {
    const {
        impactStatistics,
        foundStatistics,
        totalIssuesCount,
    } = props;

    return (
        <Grid
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(8, 1fr)"
            gap={4}
            alignItems="center"
        >
            <GridItem
                rowSpan={2}
                colSpan={1}
                height="100%"
                py={3}
            >
                <TotalIssueCard totalCount={totalIssuesCount} />
            </GridItem>
            <GridItem
                colSpan={3}
                rowSpan={2}
            >
                <IssueTypeCard foundStatistics={foundStatistics} />
            </GridItem>
            <GridItem
                rowSpan={2}
                colSpan={1}
                height="100%"
            >
                <Center height="100%">
                    <Divider
                        orientation="vertical"
                        color="#E5E5E5"
                        borderLeftWidth="2px"
                    />
                </Center>
            </GridItem>

            <GridItem
                colSpan={3}
                rowSpan={2}
            >
                <ImpactDataCard
                    impactStatistics={impactStatistics}
                />
            </GridItem>
        </Grid>
    );
}

export default IssueStats;
