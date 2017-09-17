import {IAuthResponse} from "./iauth-response";
import {IUserProfile} from "./iuser-profile";
import {Observable} from "rxjs/Observable";
import {Auth} from "./Auth";

export interface AuthProvider {

    getAuth(): Promise<Auth>;

    isAuthenticated(): boolean;

    getUserProfile(): IUserProfile;

    getAuthResponse(): IAuthResponse;

    logIn();

    logOut(reRouteUrl: string);
}
