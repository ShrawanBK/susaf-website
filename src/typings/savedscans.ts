export interface Column {
    description: string;
    accessor: string;
}

export interface SavedScanItem {
    id: string;
    name: string;
    url: string;
    website: string;
    scanTime: string;
}

export interface GetSavedScanResponse {
    data: SavedScanItem[];
    lastPage: number;
    page: number;
    totalCount: number;
}
