import React from 'react';
import SelectField from '../SelectField';

const options = [
    {
        label: 'Name',
        value: 'name',
    },
    {
        label: 'Date',
        value: 'date',
    },
    {
        label: 'Type',
        value: 'type',
    },
];

interface Props {
    onSelectSortBy: React.Dispatch<React.SetStateAction<string | undefined>>;
}

function Sort(props: Props) {
    const {
        onSelectSortBy,
    } = props;
    return (
        <SelectField
            options={options}
            placeholder="Select option"
            label="Sort By"
            onSelectOption={onSelectSortBy}
        />
    );
}

export default Sort;
