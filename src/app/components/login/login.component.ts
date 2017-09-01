/**
 * @see https://www.npmjs.com/package/ng2-facebook-sdk
 * @see https://zyra.github.io/ngx-facebook/
 */
import {Component, OnInit} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {GoogleOauth2Service} from "../../services/google-oauth2.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FacebookAuthService} from "../../services/facebook-auth.service";
import {OAuthService} from "../../services/oauth.service";
import {IAuthResponse} from "../../model/oauth/iauth-response";
import {LoginResponse} from "ngx-facebook";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    static checkFlag = true;
    redirectUrl: string;

    constructor(private http: Http,
                private authService: OAuthService,
                private googleOauth2Service: GoogleOauth2Service,
                private facebookAuthService: FacebookAuthService,
                private router: Router, private activatedRoute: ActivatedRoute) {

    }

    private verifyWithServer(id_token): Observable<any> {
        const url = 'http://localhost:9000/oauth2/v1/google';
        const headers = new Headers({'Content-Type': 'application/json'});
        headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');
        return this.http.post(url, id_token, headers).map((response: Response) => {
            // const res = response.json();
            return response; // ? res : {};
        });
    }

    ngOnInit() {

        for (let i = 1; i < 10; ++i) {
            setTimeout(() => {
                if (LoginComponent.checkFlag) {
                    if (this.authService.isAuthenticated()) {
                        LoginComponent.checkFlag = false;
                        if (this.redirectUrl == null) {
                            this.redirectUrl = '';
                        }
                        this.router.navigateByUrl(this.redirectUrl);
                    } else {
                        // console.log(' Not authenticated, LoginComponent');
                    }
                }
            }, i * 500);
        }
    }

    signUpWithFacebook() {
        console.log(" Facebook Sign UP");
    }

    signUpWithGoogle() {
        this.googleOauth2Service.logIn().then(googleUser => {
            GoogleOauth2Service.AUTH_RESPONSE = googleUser.getAuthResponse();
            alert('User already Register, Please login');
            this.googleOauth2Service.logOut('login');
        });

    }

    signInWithFacebook() {
        this.setRedirectUrl();

        console.log(' Facebook Sign In: ' + this.redirectUrl);
        this.facebookAuthService.logInPromise().then((response: LoginResponse) => {
            if (response.status === 'connected') {
                this.facebookAuthService.retrieveInfoThenRedirect(response, this.redirectUrl);
            }
        });
    }

    private setRedirectUrl() {
        if (this.activatedRoute != null && this.activatedRoute.snapshot) {
            this.redirectUrl = this.activatedRoute.snapshot.queryParams['beforeSignInUrl'];
        }
        if (this.redirectUrl == null) {
            this.redirectUrl = '';
        }
    }

    signInWithGoogle() {
        this.setRedirectUrl();
        console.log(' Sign In with Google: ' + this.redirectUrl);

        this.googleOauth2Service.logIn().then(googleUser => {
            GoogleOauth2Service.AUTH_RESPONSE = googleUser.getAuthResponse();
            this.googleOauth2Service.getUserProfile();
            setTimeout(() => this.router.navigateByUrl(this.redirectUrl), 1000);
        });
    }

    check() {
        if (this.googleOauth2Service.isAuthenticated()) {
            const authResponse: IAuthResponse = this.googleOauth2Service.getAuthResponse();
            console.log(' access_token ' + authResponse.getAccessToken());
            // console.log(' id_token ' + authResponse.id_token);
            console.log(' expires_at ' + authResponse.getExpiresAt());
        } else {
            console.log(' Need to logIn ');
        }
    }
}



