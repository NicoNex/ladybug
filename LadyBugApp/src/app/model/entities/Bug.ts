import { IBug } from '../interfaces/IBug';
import { Comment } from './Comment';

export class Bug implements IBug {
    id?: number;
    body?: string;
    open?: boolean;
    tags?: Array<string>;
    date?: number;
    comments?: Array<Comment>;


    constructor(data?: IBug) {
        this.id = data.id;
        this.body = data.body;
        this.open = data.open;
        this.tags = data.tags;
        this.date = data.date;
        this.comments = data.comments;
    }
}