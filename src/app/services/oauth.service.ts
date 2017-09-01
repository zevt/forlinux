import {Injectable, OnInit} from '@angular/core';
import {GoogleOauth2Service} from "./google-oauth2.service";
import {FacebookAuthService} from "./facebook-auth.service";
import {Utils} from "../utils/utils";
import {IUserProfile} from "../model/oauth/iuser-profile";
import {IAuthResponse} from "../model/oauth/iauth-response";

@Injectable()
export class OAuthService implements OnInit {

    private _authProviderName: string;
    // private _userProfile: IUserProfile;
    // private _authResponse: AuthResponse;

    constructor(private googleAuthService: GoogleOauth2Service, private facebookAuthService: FacebookAuthService) {

    }

    ngOnInit(): void {

    }



    isAuthenticated(): boolean {
        if (this.googleAuthService.isAuthenticated()) {
            this._authProviderName = Utils.GOOGLE;
            return true;
        } else if (this.facebookAuthService.isAuthenticated()) {
            this._authProviderName = Utils.FACEBOOK;
            return true;
        }
        return false;
    }

    get authProviderName(): string {
        return this._authProviderName;
    }

    get authResponse(): IAuthResponse {
        if (this.isAuthenticated()) {
            if (this.authProviderName === Utils.GOOGLE) {
                return this.googleAuthService.getAuthResponse();
            } else if (this.authProviderName === Utils.FACEBOOK) {
                return this.facebookAuthService.getAuthResponse();
            }
        }
        return null;
    }

    getUserProfile(): IUserProfile {
        // if (this.isAuthenticated()) {
            if (this.authProviderName === Utils.GOOGLE) {
                return this.googleAuthService.getUserProfile();
            } else if (this.authProviderName === Utils.FACEBOOK) {
                return this.facebookAuthService.getUserProfile();
            }
        // }
        return null;
    }

    logOut(reRouteUrl: string) {
        if (this.googleAuthService.isAuthenticated()) {
            this.googleAuthService.logOut(reRouteUrl);
        }
        if (this.facebookAuthService.isAuthenticated()) {
            this.facebookAuthService.logOut(reRouteUrl);
        }

    }
}
