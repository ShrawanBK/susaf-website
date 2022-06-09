import { Column } from '../../typings/savedscans';

export const savedScanItemColumn: Column[] = [
    {
        description: 'webpage',
        accessor: 'webpage',
    },
    {
        description: 'URL',
        accessor: 'url',
    },
    {
        description: 'Website',
        accessor: 'website',
    },
    {
        description: 'Scanned Time',
        accessor: 'scantime',
    },
    {
        description: 'Actions',
        accessor: 'actions',
    },
];

export const sortByOptions = [
    {
        label: 'Scan Time (oldest to latest)',
        value: 'scantime-asc',
    },
    {
        label: 'Scan Time (latest to oldest)',
        value: 'scantime-desc',
    },
    {
        label: 'Webpage (a to z)',
        value: 'name-asc',
    },
    {
        label: 'Webpage (z to a)',
        value: 'name-desc',
    },
    {
        label: 'Website (a to z)',
        value: 'website-asc',
    },
    {
        label: 'Website (z to a)',
        value: 'website-desc',
    },
    {
        label: 'URL (a to z)',
        value: 'url-asc',
    },
    {
        label: 'URL (z to a)',
        value: 'url-desc',
    },
];

export const orderOptions = [
    {
        label: 'Descending',
        value: 'desc',
    },
    {
        label: 'Ascending',
        value: 'asc',
    },
];
