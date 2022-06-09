import React from 'react';

import {
    Grid,
} from '@chakra-ui/react';

import ImpactDataItem from './ImpactDataItem';

import Placeholder from '../Placeholder';

import {
    ImpactStatistics,
} from '../../typings/webpage';

export interface Props {
    impactStatistics: ImpactStatistics[] | undefined;
}

function ImpactDataCard(props: Props) {
    const {
        impactStatistics,
    } = props;

    if (!impactStatistics || impactStatistics.length <= 0) {
        return <Placeholder />;
    }

    return (
        <Grid
            p={2}
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(2, 1fr)"
        >
            {impactStatistics?.map((item) => (
                <ImpactDataItem
                    key={item.impact}
                    impact={item.impact}
                    count={item.count}
                />
            ))}
        </Grid>
    );
}

export default ImpactDataCard;
