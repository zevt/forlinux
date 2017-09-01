import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {OAuthService} from "../services/oauth.service";
import {Auth} from "../model/oauth/Auth";

@Injectable()
export class OauthResolver implements Resolve<Auth> {

    constructor(private oauthService: OAuthService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Auth> | Promise<Auth> | Auth {

        return null;
        // return this.oauthService.isAuthenticated();
    }
}
