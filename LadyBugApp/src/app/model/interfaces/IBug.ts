import { IComment } from './IComment';

export interface IBug {
    id?: number;
    body?: string;
    open?: boolean;
    tags?: Array<string>;
    date?: number;
    comments?: Array<IComment>;
}