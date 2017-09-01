export class Auth {
    // epochSecond
    private _expiresAt: number;
    private _access_token: string;

    constructor(expiresAt: number, access_token: string) {
        this._expiresAt = expiresAt;
        this._access_token = access_token;
    }

    get expiresAt(): number {
        return this._expiresAt;
    }

    get access_token(): string {
        return this._access_token;
    }
}
