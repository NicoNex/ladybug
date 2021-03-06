import { IComment } from '../interfaces/IComment';

export class Comment implements IComment {
     date?: number;
     text?: string;
     author?: string;

    constructor(data?: IComment) {
        this.date = data.date;
        this.text = data.text;
        this.author = data.author;
    }
}