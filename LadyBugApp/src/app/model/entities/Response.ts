import { IResponse } from '../interfaces/IResponse';
import { Bug } from './Bug';
export class Response implements IResponse {
    ok: boolean;
    bugs?: Array<Bug>;
    err?: string;
    bug?: Bug;

    constructor(data?: IResponse) {
        for (const property in Object.keys(data)) {
            this[property] = data[property];
        }
    }
}