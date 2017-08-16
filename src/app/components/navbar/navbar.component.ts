import {AfterContentInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GoogleOauth2Service} from "../../services/google-oauth2.service";
import {ActivatedRoute, Router, RouterStateSnapshot} from "@angular/router";
import {GoogleUser} from "../../model/oauth/google-user";
import {GoogleProfile} from "../../model/oauth/google-profile";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterContentInit, OnChanges {

    isAuthenticated: boolean;
    authService: any;
    authResponse: any;
    googleAuth: any;
    googleUser: GoogleUser;
    googleProfile: GoogleProfile;
    constructor(private _authService: GoogleOauth2Service, public router: Router) {
        this.authService = this._authService;
        // this.GAPI = GoogleOauth2Service.GAPI_AUTH2;

    }

    ngOnInit() {
        setTimeout(() => {
            this.googleUser = this.authService.getUserProfile();
            if (this.googleUser != null) {
                this.googleProfile = this.googleUser.getBasicProfile();
            }
        }, 500);
    }

    ngOnChanges(changes: SimpleChanges): void {

    }

    ngAfterContentInit(): void {
        console.log(' Current Url:' + this.router.routerState.snapshot.url);
    }

    signOut() {
        this.googleProfile = null;
        this.authService.logOut().then(() => {
            console.log(' sign out');
            this.router.navigateByUrl('logIn');
        });
    }

}
