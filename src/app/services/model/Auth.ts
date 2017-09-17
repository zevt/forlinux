import {IUserProfile} from "./iuser-profile";

export class Auth {
    // epochSecond
    private _userPofile: IUserProfile;
    private _access_token: string;
    private _expiresAt: number;

    constructor(userPofile: IUserProfile, access_token: string, expiresAt: number) {
        this._userPofile = userPofile;
        this._access_token = access_token;
        this._expiresAt = expiresAt;
    }

    get expiresAt(): number {
        return this._expiresAt;
    }

    get access_token(): string {
        return this._access_token;
    }

    get userPofile(): IUserProfile {
        return this._userPofile;
    }

}
