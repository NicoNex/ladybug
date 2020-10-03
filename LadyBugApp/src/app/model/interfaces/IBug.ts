import { IComment } from './IComment';

export interface IBug {
    id?: string;
    body?: string;
    open?: boolean;
    tags?: Array<string>;
    date?: Date;
    comments?: Array<IComment>;
}