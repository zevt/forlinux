import {AuthResponse} from "./auth-response";

export interface GoogleUser {

    getBasicProfile(): any;

    getAuthResponse(yes: boolean): AuthResponse;

}
