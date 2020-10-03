import { IBug } from './IBug';

export interface Iissue {
    ok?: boolean;
    bugs?: Array<IBug>;
}