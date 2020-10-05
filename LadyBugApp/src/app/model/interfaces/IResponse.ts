import { IBug } from './IBug';

export interface IResponse {
    ok: boolean;
    bugs?: Array<IBug>;
    bug?: IBug;
    err?: string;
}