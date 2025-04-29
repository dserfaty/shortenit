import {APIToken} from "../actions/api.ts";

// Poor man global context
export class AppContext {
    private _credentials: APIToken;

    constructor() {
        this._credentials = {} as APIToken;
    }

    get credentials(): APIToken {
        return this._credentials;
    }

    set credentials(value: APIToken) {
        this._credentials = value;
    }
}