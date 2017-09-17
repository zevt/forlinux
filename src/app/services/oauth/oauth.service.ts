import {Injectable, OnInit} from '@angular/core';
import {GoogleOauth2Service} from "./google-oauth2.service";
import {FacebookAuthService} from "./facebook-auth.service";
import {Utils} from "../utils/utils";
import {IUserProfile} from "../model/oauth/iuser-profile";
import {IAuthResponse} from "../model/oauth/iauth-response";
import {Auth} from "../model/oauth/Auth";

@Injectable()
export class OAuthService implements OnInit {

    private _authProviderName: string;
    // private _userProfile: IUserProfile;
    // private _authResponse: AuthResponse;

    auth: Auth;

    constructor(private googleAuthService: GoogleOauth2Service, private facebookAuthService: FacebookAuthService) {

    }

    ngOnInit(): void {

    }

    getAuth(): Promise<Auth> {
        // console.log('OauthService.getAuth() 1');
        // let auth = this.facebookAuthService.getAuth();
        // if (auth !== null) {
        //     console.log('OauthService.getAuth() 2');
        //     return auth;
        // } else if ((auth = this.googleAuthService.getAuth()) !== null) {
        //     console.log('OauthService.getAuth() 3');
        //     return auth;
        // } else {
        //     return null;
        // }

        return new Promise((resolve, reject) => {
                this.facebookAuthService.getAuth().then((r) => {
                    console.log('OauthService.getAuth() 1');
                    resolve(r);
                }).catch(e1 => {
                        console.log('OauthService.getAuth() 2');
                        this.googleAuthService.getAuth().then(r1 => resolve(r1))
                            .catch(e2 => {
                                console.log('OauthService.getAuth() 3');
                                reject('');
                            });
                    });
            }
        );
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
