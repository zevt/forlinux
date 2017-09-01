import {IAuthResponse} from "./iauth-response";
import {IUserProfile} from "./iuser-profile";

export interface AuthProvider {
    isAuthenticated(): boolean;

    getUserProfile(): IUserProfile;

    getAuthResponse(): IAuthResponse;

    logIn();

    logOut(reRouteUrl: string);
}
