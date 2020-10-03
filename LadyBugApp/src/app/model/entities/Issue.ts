import { Iissue } from '../interfaces/Iissue';
import { Bug } from './Bug';

export class Issue implements Iissue {
    ok?: boolean;
    bugs?: Array<Bug>;
    
    constructor(data?: Iissue) {
        this.ok = data.ok;
        this.bugs = data.bugs;
    }
}