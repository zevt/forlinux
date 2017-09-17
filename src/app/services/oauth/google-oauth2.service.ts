import {Injectable, OnInit} from '@angular/core';
import {AuthResponse} from "../model/oauth/auth-response";
import {AuthProvider} from "../model/oauth/auth-provider";
import {IAuthResponse} from "../model/oauth/iauth-response";
import {Router} from "@angular/router";
import {Auth} from "../model/oauth/Auth";
import {IUserProfile} from "../model/oauth/iuser-profile";
import {Utils} from "../utils/utils";

@Injectable()
export class GoogleOauth2Service implements OnInit, AuthProvider {

    static GOOGLEAUTH;
    static AUTH_RESPONSE;

    constructor(private router: Router) {
        this.gapiInit('');
    }

    gapiInit(redirect: string) {
        redirect = 'http://localhost:4200/' + redirect;
        redirect = redirect.trim();
        gapi.load('auth2', function () {
            GoogleOauth2Service.GOOGLEAUTH = gapi.auth2.init({
                client_id: '724422975832-jku02idmv3eh8jl0954fmenfhdacgotb.apps.googleusercontent.com',
                // fetch_basic_profile: true,
                scope: 'openid profile email',
                ux_mode: 'popup',
                // ux_mode: 'redirect',
                redirect_uri: redirect,
                // prompt: 'consent'
                prompt: 'none'
            }).then((googleAuth) => {
                    GoogleOauth2Service.GOOGLEAUTH = googleAuth;
                    if (googleAuth.isSignedIn && googleAuth.isSignedIn.get()) {
                        const googleUser = GoogleOauth2Service.GOOGLEAUTH.currentUser.get();
                        GoogleOauth2Service.AUTH_RESPONSE = googleUser.getAuthResponse(true);
                    }
                },
            ).catch((er) => {
                console.log(er);
            });
        });
    }

    /**
     * @external link
     * @see https://developers.google.com/identity/sign-in/web/reference#googleusergetauthresponseincludeauthorizationdata
     * @see https://developers.google.com/identity/protocols/OpenIDConnect#scope-param
     * @external link
     */

    ngOnInit(): void {

    }

    /**
     * Get Google AuthResponse Object
     * @returns {AuthResponse}
     */

    getAuthResponse(): IAuthResponse {
        if (this.isAuthenticated()) {
            const authResponse = GoogleOauth2Service.AUTH_RESPONSE;
            console.log(authResponse);
            return new AuthResponse(authResponse.id_token, Math.floor(authResponse.expires_at / 1000), 0);
            // return new AuthResponse(authResponse.access_token, Math.floor(authResponse.expires_at / 1000), 0);
        }
        return null;
    }

    getUserProfile(): IUserProfile {
        if (GoogleOauth2Service.GOOGLEAUTH) {
            if (GoogleOauth2Service.GOOGLEAUTH.isSignedIn && GoogleOauth2Service.GOOGLEAUTH.isSignedIn.get()) {
                return GoogleOauth2Service.GOOGLEAUTH.currentUser.get().getBasicProfile();
                // GoogleOauth2Service.AUTH_RESPONSE = googleUser.getAuthResponse(true);
                // if (GoogleOauth2Service.AUTH_RESPONSE != null) {
                //     console.log(' Already Log In');
                // }
                // console.log(' This is strange, not logIn but come here');
            }
        }
        return null;
    }

    isAuthenticated() {
        // console.log(GoogleOauth2Service.AUTH_RESPONSE );
        /**
         * Check if GoogleOauth2Service.AUTH_RESPONSE is null or it already expired
         */
        if (GoogleOauth2Service.AUTH_RESPONSE != null && GoogleOauth2Service.AUTH_RESPONSE.expires_at < Date.now()) {
            // if (gapi.auth2 != null) {
            // console.log('isSignedIn: ' + GoogleOauth2Service.GOOGLEAUTH.isSignedIn);
            if (GoogleOauth2Service.GOOGLEAUTH != null) {
                // const googleAuth = gapi.auth2.getAuthInstance();
                if (!!GoogleOauth2Service.GOOGLEAUTH.isSignedIn && !!GoogleOauth2Service.GOOGLEAUTH.currentUser) {
                    const googleUser = GoogleOauth2Service.GOOGLEAUTH.currentUser.get();
                    GoogleOauth2Service.AUTH_RESPONSE = googleUser.getAuthResponse(true);
                }
            } else {
                // console.log(' gapi.auth2 != null ');
            }
        }
        return GoogleOauth2Service.AUTH_RESPONSE != null && GoogleOauth2Service.AUTH_RESPONSE.expires_at > Date.now();
    }

    getAuth(): Promise<Auth> {
        console.log('Google getAuth: 1');
        if (this.isAuthenticated()) {
            console.log('Google getAuth: 2');
            const authResponse = GoogleOauth2Service.AUTH_RESPONSE;
            const basicProfile: IUserProfile = this.getUserProfile();
            const auth = new Auth(basicProfile,
                Utils.GOOGLE + '_' + authResponse.id_token,
                Math.floor(authResponse.expires_at / 1000));
            return Promise.resolve(auth);
        } else {
            console.log('Google getAuth: 3');
            return new Promise(function (resolve, reject) {
                console.log('Google getAuth: 4');
                gapi.load('auth2', function () {
                    let redirect = 'http://localhost:4200/' + '';
                    redirect = redirect.trim();
                    // return gapi.load('auth2', function () {
                    return gapi.auth2.init({
                        client_id: '724422975832-jku02idmv3eh8jl0954fmenfhdacgotb.apps.googleusercontent.com',
                        // fetch_basic_profile: true,
                        scope: 'openid profile email',
                        ux_mode: 'popup',
                        // ux_mode: 'redirect',
                        redirect_uri: redirect,
                        // prompt: 'consent'
                        prompt: 'none'
                    })
                        .then((googleAuth) => {
                                console.log('Google getAuth: 5');
                                // const googleUser = googleAuth.currentUser.get();
                                // GoogleOauth2Service.AUTH_RESPONSE = googleUser.getAuthResponse(true);
                                GoogleOauth2Service.GOOGLEAUTH = googleAuth;
                                console.log('Google getAuth: 6');
                                try {
                                    if (googleAuth.isSignedIn && googleAuth.isSignedIn.get()) {
                                        console.log('Google getAuth: 7');
                                        const googleUser = GoogleOauth2Service.GOOGLEAUTH.currentUser.get();
                                        GoogleOauth2Service.AUTH_RESPONSE = googleUser.getAuthResponse(true);
                                        if (GoogleOauth2Service.AUTH_RESPONSE != null) {
                                            /**
                                             * gapi.auth2.BasicProfile has the following methods:
                                             BasicProfile.getId()
                                             BasicProfile.getName()
                                             BasicProfile.getGivenName()
                                             BasicProfile.getFamilyName()
                                             BasicProfile.getImageUrl()
                                             BasicProfile.getEmail()
                                             */
                                            const authResponse = GoogleOauth2Service.AUTH_RESPONSE;
                                            const basicProfile = GoogleOauth2Service.GOOGLEAUTH.currentUser.get().getBasicProfile();
                                            const auth = new Auth(basicProfile,
                                                Utils.GOOGLE + '_' + authResponse.id_token,
                                                Math.floor(authResponse.expires_at / 1000));
                                            resolve(auth);
                                        } else {
                                            // console.log(' This is strange, not logIn but come here');
                                            reject('');
                                        }

                                    } else {
                                        console.log('Google getAuth: 8');
                                        reject('');
                                        // return null;
                                    }
                                } catch (er) {
                                    reject('');
                                }
                            },
                        ).catch(er => {
                            console.log('Google getAuth: 6');
                        });

                });
            });
        }
    }

    logIn(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (gapi.auth2 != null) {
                const googleAuth = gapi.auth2.getAuthInstance();
                const options = new gapi.auth2.SigninOptionsBuilder();
                // options.setFetchBasicProfile(true);
                options.setPrompt('select_account');
                options.setScope('profile').setScope('email');
                googleAuth.signIn(options)
                    .then(googleUser => {
                        GoogleOauth2Service.AUTH_RESPONSE = googleUser.getAuthResponse();
                        this.getUserProfile();
                        resolve('connected');
                    });
            } else {
                resolve('not_connected');
            }
        });
    }

    logOut(reRouteUrl: string) {
        const googleAuth = gapi.auth2.getAuthInstance();
        GoogleOauth2Service.AUTH_RESPONSE = null;
        if (googleAuth != null) {
            try {
                googleAuth.signOut().then(() => {
                    this.router.navigateByUrl(reRouteUrl).catch();
                }).catch(error => {
                    console.log(error);
                });
            } catch (error) {
                console.log(error);
            }
        }
    }

}

declare const gapi: any;
