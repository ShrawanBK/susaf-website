import { FoundType, Impact, Criteria } from './webpage';

export interface IssueFormData {
    name: string;
    impact: Impact;
    found: FoundType;
    occurences: {
        occurenceId?: string;
        note?: string;
        description: string;
        needsReview: boolean;
    }[];
    criteria: Criteria[];
}

export interface SaveResultFormData {
    websiteName: string;
    webpageName: string;
    note?: string;
}
