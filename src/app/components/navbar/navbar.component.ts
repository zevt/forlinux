import {AfterContentInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {OAuthService} from "../../services/oauth.service";
import {IUserProfile} from "../../model/oauth/iuser-profile";
import {Router} from "@angular/router";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterContentInit, OnChanges {
    static authCheckFlag = true;
    isAuthenticated: boolean;
    authService: any;
    @Input()
    userProfile: IUserProfile;
    user: IUserProfile;

    constructor(private _authService: OAuthService, public router: Router) {
        this.authService = this._authService;

    }

    ngOnInit() {
        // for (let i = 0; i < 10; ++i) {
        //     setTimeout(() => {
        //         if (NavbarComponent.authCheckFlag) {
        //             if (this.authService.isAuthenticated()) {
        //                 NavbarComponent.authCheckFlag = false;
        //                 this.userProfile = this.authService.getUserProfile();
        //             }
        //         }
        //     }, i * 500);
        // }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.user = this.userProfile;
    }

    ngAfterContentInit(): void {
        console.log(' Current Url:' + this.router.routerState.snapshot.url);
    }

    signOut() {
        this.authService.logOut('login');
    }

}
