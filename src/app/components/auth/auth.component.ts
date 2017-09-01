import {Component} from "@angular/core";
import {OAuthService} from "../../services/oauth.service";

@Component({
    selector: 'app-auth',
    template: '<span></span>',
    styles: [],
})

export class AuthComponent {

    constructor(private authService: OAuthService) {
    }

    getUserProfile() {
        return this.authService.getUserProfile();
    }
}
