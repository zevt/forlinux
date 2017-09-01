import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {OAuthService} from "../services/oauth.service";

@Injectable()
export class LoginGuard implements CanActivate {

    constructor(private auth: OAuthService) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.auth.isAuthenticated()) {
            console.log(' Login Guard Failed');
            return false;
        }
        console.log(' Login Guard Pass');
        return true;
    }

}
