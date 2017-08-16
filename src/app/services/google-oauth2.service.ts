import {Injectable, OnInit} from '@angular/core';
import {AuthResponse} from "../model/oauth/auth-response";
import {Router} from "@angular/router";

@Injectable()
export class GoogleOauth2Service implements OnInit {

    static GOOGLEAUTH;
    static AUTH_RESPONSE;

    constructor(private router: Router) {
        gapi.load('auth2', function () {
            GoogleOauth2Service.GOOGLEAUTH = gapi.auth2.init({
                client_id: '724422975832-jku02idmv3eh8jl0954fmenfhdacgotb.apps.googleusercontent.com',
                // fetch_basic_profile: true,
                scope: 'openid profile email',
                // ux_mode: 'popup',
                ux_mode: 'redirect',
                redirect_uri: 'http://localhost:4200/',
                // prompt: 'consent'
                prompt: 'none'
            })
            .then((googleAuth) => {
                    // const googleUser = googleAuth.currentUser.get();
                    // GoogleOauth2Service.AUTH_RESPONSE = googleUser.getAuthResponse(true);
                    GoogleOauth2Service.GOOGLEAUTH = googleAuth;
                    if (googleAuth.isSignedIn && googleAuth.isSignedIn.get()) {
                        const googleUser = GoogleOauth2Service.GOOGLEAUTH.currentUser.get();
                        GoogleOauth2Service.AUTH_RESPONSE = googleUser.getAuthResponse(true);
                        if (GoogleOauth2Service.AUTH_RESPONSE != null) {
                            console.log(' Already Log In');
                        }
                        console.log(' This is strange, not login but come here');
                    } else {
                        console.log(' Need to login');
                    }
                },
                () => {
                    console.log(' Not login yet');
                    // this.router.navigateByUrl('login');
                });
        });
    }


    /**
     * @external link
     * @see https://developers.google.com/identity/sign-in/web/reference#googleusergetauthresponseincludeauthorizationdata
     * @see https://developers.google.com/identity/protocols/OpenIDConnect#scope-param
     * @external link
     * @see "https://developers.google.com/identity/sign-in/web/people"
     */

    ngOnInit(): void {
    }

    /**
     * Get Google AuthResponse Object
     * @returns {AuthResponse}
     */
    get authResponse(): AuthResponse {

        if (this.isAuthenticated()) {
            return GoogleOauth2Service.AUTH_RESPONSE;
        }
        return null;
    }

    getGoogleUser() {
        if (GoogleOauth2Service.GOOGLEAUTH) {
            if (GoogleOauth2Service.GOOGLEAUTH.isSignedIn && GoogleOauth2Service.GOOGLEAUTH.isSignedIn.get()) {
                return GoogleOauth2Service.GOOGLEAUTH.currentUser.get();
                // GoogleOauth2Service.AUTH_RESPONSE = googleUser.getAuthResponse(true);
                // if (GoogleOauth2Service.AUTH_RESPONSE != null) {
                //     console.log(' Already Log In');
                // }
                // console.log(' This is strange, not login but come here');
            }
        }
        return null;
    }

    isAuthenticated() {
        // console.log(GoogleOauth2Service.AUTH_RESPONSE );
        /**
         * Check if GoogleOauth2Service.AUTH_RESPONSE is null or it already expired
         */
        console.log('isAuthenticated() => isSignedIn: ' + GoogleOauth2Service.GOOGLEAUTH);
        if (GoogleOauth2Service.AUTH_RESPONSE == null || GoogleOauth2Service.AUTH_RESPONSE.expires_at < new Date().getUTCSeconds()) {

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
        return GoogleOauth2Service.AUTH_RESPONSE != null && GoogleOauth2Service.AUTH_RESPONSE.expires_at > new Date().getUTCSeconds();
    }

    logIn() {
        // this.initGAPI(redirectUrl);

        if (gapi.auth2 != null) {
            const googleAuth = gapi.auth2.getAuthInstance();
            const options = new gapi.auth2.SigninOptionsBuilder();
            // options.setFetchBasicProfile(true);
            options.setPrompt('select_account');
            options.setScope('profile').setScope('email');
            googleAuth.signIn(options).then(googleUser => {
                GoogleOauth2Service.AUTH_RESPONSE = googleUser.getAuthResponse();
                console.log(' Login completed');
            });
        }
    }

    logOut(): Promise<any> {
        const googleAuth = gapi.auth2.getAuthInstance();
        GoogleOauth2Service.AUTH_RESPONSE = null;
        if (googleAuth != null) {
            return googleAuth.signOut();
        } else {
            return null;
        }
    }
}

declare const gapi: any;
