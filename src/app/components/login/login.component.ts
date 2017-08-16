/**
 * @see https://www.npmjs.com/package/ng2-facebook-sdk
 * @see https://zyra.github.io/ngx-facebook/
 */
import {Component, OnInit} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {GoogleOauth2Service} from "../../services/google-oauth2.service";
import {AuthResponse} from "../../model/oauth/auth-response";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    redirectUrl: string;

    constructor(private http: Http, private googleOauth2Service: GoogleOauth2Service,
                private router: Router, private activatedRoute: ActivatedRoute) {
        this.redirectUrl = this.activatedRoute.snapshot.queryParams['beforeSignInUrl'];
        console.log(' beforeSignInUrl :  ' + this.redirectUrl);
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
        // if (this.redirectUrl == null) {
        //     this.redirectUrl = '';
        // }
        // this.googleOauth2Service.gapiInit(this.redirectUrl);

        setTimeout(() => {
            if (this.googleOauth2Service.isAuthenticated()) {
                if (this.redirectUrl == null) {
                    this.redirectUrl = '';
                }
                this.router.navigateByUrl(this.redirectUrl);
            }
        }, 500);
    }

    signUpWithFacebook() {
        console.log(" Facebook Sign UP");
    }

    signInWithFacebook() {
        console.log(' Facebook Sign In');
    }

    signUpWithGoogle() {
        console.log(' Google Sign Up');

    }

    signInWithGoogle() {
        console.log(' Sign In with Google: ' + this.activatedRoute.snapshot.queryParams['beforeSignInUrl']);

        this.googleOauth2Service.logIn();

        // if (this.googleOauth2Service.isAuthenticated()) {
        //     const authResponse: AuthResponse = this.googleOauth2Service.authResponse;
        //     console.log(' access_token ' + authResponse.access_token);
        //     console.log(' id_token ' + authResponse.id_token);
        //     console.log(' expires_at ' + authResponse.expires_at);
        //     console.log(' expires_in ' + authResponse.expires_in);
        //
        // } else {
        //     console.log(' Login failed ');
        // }

        // this.router.navigateByUrl(this.activatedRoute.snapshot.queryParams['beforeSignInUrl']);

    }

    check() {
        if (this.googleOauth2Service.isAuthenticated()) {
            const authResponse: AuthResponse = this.googleOauth2Service.authResponse;
            console.log(' access_token ' + authResponse.access_token);
            console.log(' id_token ' + authResponse.id_token);
            console.log(' expires_at ' + authResponse.expires_at);
            console.log(' expires_in ' + authResponse.expires_in);
        } else {
            console.log(' Need to logIn ');
        }
    }
}



