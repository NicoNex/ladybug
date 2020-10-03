import { IBug } from '../interfaces/IBug';
import { Comment } from './Comment';

export class Bug implements IBug {
    id?: string;
    body?: string;
    open?: boolean;
    tags?: Array<string>;
    date?: Date;
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