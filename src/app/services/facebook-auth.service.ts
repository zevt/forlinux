import {Injectable, OnInit} from '@angular/core';
import {AuthProvider} from "../model/oauth/auth-provider";
import {UserProfile} from "../model/oauth/user-profile";
import {AuthResponse as CustomAuthResponse} from "../model/oauth/auth-response";
import {AuthResponse, FacebookService, LoginOptions, LoginResponse, LoginStatus} from "ngx-facebook";
import {IAuthResponse} from "../model/oauth/iauth-response";
import {IUserProfile} from "../model/oauth/iuser-profile";
import {Router} from "@angular/router";

/**
 * @see https://www.npmjs.com/package/ng2-facebook-sdk
 */
@Injectable()
export class FacebookAuthService implements AuthProvider, OnInit {
    profileUrl = '/me?fields=name,email';

    userProfile: UserProfile;
    authResponse: CustomAuthResponse;
    app_token = '350190935354609|ZUSMIrkiNYC9IRM1YduOTj2TBP0';

    constructor(private facebook: FacebookService, private router: Router) {
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
        //     this.facebook.getLoginStatus().then((loginStatus: LoginStatus) => {
        //         const authRes = loginStatus.authResponse;
        //         this.authResponse = new AuthResponse(authRes.accessToken, 0, authRes.expiresIn);
        //         this.facebook.api(this.profileUrl).then(res => {
        //             this.userProfile = new UserProfile(res.name, res.email);
        //         });
        //         alert(' ABC ');
        //     });
    }

    isAuthenticated(): boolean {
        console.log(' Facebook is Authenticated called');
        return (this.getAuthResponse() != null);
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
        console.log(" getAuthResponse --> ");
        if (this.authResponse == null || this.facebook.getAuthResponse() == null) {
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

    logInPromise(): Promise<LoginResponse> {

        const loginOptions: LoginOptions = {
            enable_profile_selector: true,
            return_scopes: true,
            // scope: 'public_profile,user_friends,email,pages_show_list'
            scope: 'public_profile,email'
        };

        return this.facebook.login(loginOptions);
    }

    retrieveInfo(response: LoginResponse) {
        if (response.status === 'connected') {
            this.retrieveAuthResponse(response.authResponse, this.router.url);
            this.retrieveUserProfile();
        }
    }

    retrieveInfoThenRedirect(response: LoginResponse, url: string) {
        if (response.status === 'connected') {
            this.retrieveAuthResponse(response.authResponse, url);
            this.retrieveUserProfile();
        }
    }

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

// getLoginStatus() {
    //     this.facebook.getLoginStatus()
    //         .then(console.log.bind(console))
    //         .catch(console.error.bind(console));
    // }

    logOut(reRouteUrl: string) {
        /**
         * @see https://stackoverflow.com/questions/10807122/how-can-i-force-a-facebook-access-token-to-expire
         * Alternative: user DELETE method to "https://graph.facebook.com/v2.7/me/permissions?access_token=${token}{"success":true}"
         */
        const path = 'me/permissions?success:true';

        this.facebook.api(path, 'delete').then(response => {
            if (response.success === true) {
                this.userProfile = null;
                this.authResponse = null;
                this.router.navigateByUrl(reRouteUrl).catch(error => {
                });
            }
        }).catch((error) => {
            console.log(error);
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
