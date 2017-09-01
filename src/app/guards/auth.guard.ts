import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {OAuthService} from "../services/oauth.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private auth: OAuthService, private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        console.log(' Guard called ');
        if (!this.auth.isAuthenticated()) {
            console.log(' Not authenticated');
            this.router.navigate(['login'], {queryParams: {beforeSignInUrl: state.url}});
            setTimeout(() => this.router.navigateByUrl(state.url), 1000);
            return false;
        }
        console.log(' Access granted');
        return true;
    }
}
