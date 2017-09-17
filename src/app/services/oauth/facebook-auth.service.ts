import {Injectable, OnInit} from '@angular/core';
import {AuthProvider} from "../model/oauth/auth-provider";
import {UserProfile} from "../model/oauth/user-profile";
import {AuthResponse as CustomAuthResponse} from "../model/oauth/auth-response";
import {AuthResponse, FacebookService, LoginOptions, LoginResponse, LoginStatus} from "ngx-facebook";
import {IAuthResponse} from "../model/oauth/iauth-response";
import {IUserProfile} from "../model/oauth/iuser-profile";
import {Router} from "@angular/router";
import {Auth} from "../model/oauth/Auth";
import {Http} from "@angular/http";
import {Utils} from "../utils/utils";

/**
 * @see https://www.npmjs.com/package/ng2-facebook-sdk
 */
@Injectable()
export class FacebookAuthService implements AuthProvider, OnInit {
    profileUrl = '/me?fields=name,email';

    userProfile: UserProfile;
    authResponse: CustomAuthResponse;
    app_token = '350190935354609|ZUSMIrkiNYC9IRM1YduOTj2TBP0';

    constructor(private facebook: FacebookService,
                private router: Router,
                private http: Http) {
        facebook.init({
            appId: '350190935354609',
            xfbml: true,
            status: true,
            cookie: true,
            version: 'v2.9',
        });

        FB.AppEvents.logPageView();
        this.facebook.getLoginStatus().then((loginStatus: LoginStatus) => {
            if (loginStatus && loginStatus.authResponse) {
                const authRes = loginStatus.authResponse;
                this.authResponse = new CustomAuthResponse(authRes.accessToken, 0, authRes.expiresIn);
                this.facebook.api(this.profileUrl).then(res => {
                    this.userProfile = new UserProfile(res.name, res.email);
                });
            }
            // alert(' ABC ');
        });
    }

    /**
     *  Check if user alread login;
     */
    ngOnInit(): void {
    }

    getAuth(): Promise<Auth> {
        if (this.isAuthenticated()) {
            return new Promise((resolve, reject) => {
                resolve(new Auth(this.getUserProfile(), Utils.FACEBOOK + '_' + this.getAuthResponse().getAccessToken(), this.getAuthResponse().getExpiresAt()));
            });
        } else {
            return new Promise((resolve, reject) => {
                if (this.facebook.getLoginStatus() != null) {
                    this.facebook.getLoginStatus().then((loginStatus: LoginStatus) => {
                        if (!!loginStatus && !!loginStatus.authResponse) {
                            const authRes = loginStatus.authResponse;
                            this.setAuthResolve(Utils.FACEBOOK + '_' + authRes.accessToken, resolve, reject);

                        } else {
                            reject('');
                        }
                    });
                } else {
                    // console.log(' facebook getAuth 10');
                    reject('');
                }
            });
        }
    }

    private setAuthResolve(accessToken: string, resolve: any, reject: any) {
        if (this.facebook.api(this.profileUrl) != null) {
            this.facebook.api(this.profileUrl).then(res => {
                this.userProfile = new UserProfile(res.name, res.email);
                const graphUrl = 'debug_token?input_token='
                    .concat(accessToken) + '&access_token=' + this.app_token;
                this.facebook.api(graphUrl, 'get').then(res1 => {
                    // const authRes = this.facebook.getAuthResponse();
                    this.authResponse = new CustomAuthResponse(accessToken, res1.data.expires_at, 0);
                    resolve(new Auth(this.userProfile, accessToken, res1.data.expires_at));

                });
            }).catch((error) => {
                reject('');
            });
        } else {
            reject('');
        }
    }

    isAuthenticated(): boolean {
        // console.log(' Facebook Authenticated is called');
        return (this.getAuthResponse() !== null);
        // const authRes = this.getAuthResponse();
        // if (authRes != null && authRes.getExpiresAt() > curentEpochSeconds()) {
        //     return true;
        // }

        // return false;
    }

    getUserProfile(): IUserProfile {
        return this.userProfile;
    }

    getAuthResponse(): IAuthResponse {
        // console.log(" getAuthResponse --> " + this.authResponse);
        if (this.authResponse == null || this.facebook.getAuthResponse() == null) {
            // console.log(" getAuthResponse --> null");
            return null;
        } else {

            if (this.authResponse.getExpiresAt() < curentEpochSeconds() ||
                this.authResponse.getAccessToken() !== this.facebook.getAuthResponse().accessToken) {
                // this.logIn();
                this.facebook.getAuthResponse();
                const authRes = this.facebook.getAuthResponse();
                this.authResponse = new CustomAuthResponse(authRes.accessToken, 0, authRes.expiresIn);
                this.retrieveAuthResponse(authRes, null);
            }
        }
        // const authRes = this.facebook.getAuthResponse();
        // this.authResponse = new AuthResponse(authRes.accessToken, 0, authRes.expiresIn);
        return this.authResponse;
    }

    logIn() {
        const loginOptions: LoginOptions = {
            enable_profile_selector: true,
            return_scopes: true,
            // scope: 'public_profile,email,user_location'
            scope: 'public_profile,email'
        };

        return this.facebook.login(loginOptions).then((response: LoginResponse) => {
            this.retrieveInfo(response);
        });
    }

    logInPromise(): Promise<string> {

        const loginOptions: LoginOptions = {
            enable_profile_selector: true,
            return_scopes: true,
            // scope: 'public_profile,user_friends,email,pages_show_list'
            scope: 'public_profile,email'
        };

        return new Promise((resolve, reject) => {
            this.facebook.login(loginOptions).then((response: LoginResponse) => {
                if (response.status === 'connected') {
                    this.setAuthResolve(response.authResponse.accessToken, resolve, reject);
                } else {
                    reject('not_connected');
                }
            });
        });
    }

    retrieveInfo(response: LoginResponse) {
        if (response.status === 'connected') {
            this.retrieveAuthResponse(response.authResponse, this.router.url);
            this.retrieveUserProfile();
        }
    }

    // retrieveInfoThenRedirect(response: LoginResponse, url: string) {
    //     if (response.status === 'connected') {
    //         this.retrieveAuthResponse(response.authResponse, url);
    //         this.retrieveUserProfile();
    //     }
    // }

    private retrieveUserProfile() {
        this.facebook.api(this.profileUrl).then(res => {
            this.userProfile = new UserProfile(res.name, res.email);
        });
    }

    private retrieveAuthResponse(authRes: AuthResponse, redirectUrl: string) {
        const graphUrl = 'debug_token?input_token='.concat(authRes.accessToken) + '&access_token=' + this.app_token;
        this.facebook.api(graphUrl, 'get').then(res => {
            // const authRes = this.facebook.getAuthResponse();
            this.authResponse = new CustomAuthResponse(authRes.accessToken, res.data.expires_at, 0);
            if (redirectUrl !== null) {
                this.router.navigateByUrl(redirectUrl);
            }
        });
    }

    logOut(reRouteUrl: string) {
        /**
         * @see https://stackoverflow.com/questions/10807122/how-can-i-force-a-facebook-access-token-to-expire
         * Alternative: user DELETE method to "https://graph.facebook.com/v2.7/me/permissions?access_token=${token}{"success":true}"
         */
        const path = 'me/permissions?success:true';
        // console.log('Facebook Attempt Logout ');
        this.facebook.api(path, 'delete').then(response => {
            if (response.success === true) {
                this.userProfile = null;
                this.authResponse = null;
                // console.log('reRouteUrl: ' + reRouteUrl);
                this.router.navigateByUrl(reRouteUrl).catch(error => {
                    // console.log(' failed to reroute');
                });
            }
        }).catch((error) => {
            // console.log(error);
            this.router.navigateByUrl(reRouteUrl).catch(er => {
            });
        });
    }

    private adjustAuthResponse() {
        const authRes = this.facebook.getAuthResponse();
        this.authResponse = new CustomAuthResponse(authRes.accessToken, 0, authRes.expiresIn);
    }

}

declare let FB: any;

function curentEpochSeconds(): number {
    return Math.floor(Date.now() / 1000);
}
