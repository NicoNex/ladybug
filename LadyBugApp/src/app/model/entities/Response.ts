import { IResponse } from '../interfaces/IResponse';
import { Bug } from './Bug';
export class Response implements IResponse {
    ok: boolean;
    bugs?: Array<Bug>;
    err?: string;
    bug?: Bug;

    constructor(data?: IResponse) {
        // for (const property in Object.keys(data)) {
        //     this[property] = data[property];
        // }
        this.ok = data.ok;
        if (data.bugs instanceof Array && data.bugs.length !== 0){
            this.bugs = data.bugs;
        } else {
            this.bugs = [];
        }
        this.err = data.err;
        this.bug = data.bug;
    }
}