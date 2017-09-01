import {IAuthResponse} from "./iauth-response";

export class AuthResponse implements IAuthResponse {

    expiresAt: number;

    accessToken: string;
    /**
     * Access token lifetime in seconds
     */
    expiresIn: number;

    constructor(accessToken: string, expiresAt: number, expiresIn: number) {
        this.expiresAt = expiresAt;
        this.accessToken = accessToken;
        this.expiresIn = expiresIn;
        if (this.expiresAt === 0) {
            this.expiresAt = Math.floor(Date.now() / 1000) + this.expiresIn;
        }
    }

    /**
     *
     */

    // /**
    //  * The Facebook user ID
    //  */
    // userID: string;
    // /**
    //  * The granted scopes. This field is only available if you set `return_scopes` to true when calling login method.
    //  */
    // grantedScopes?: string;

    getAccessToken(): string {
        return this.accessToken;
    }

    getExpiresAt(): number {
        return this.expiresAt;
    }

}
