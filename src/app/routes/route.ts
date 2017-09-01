import {Routes} from "@angular/router";
import {LoginComponent} from "../components/login/login.component";
import {ABCComponent} from "../components/abc/abc.component";
import {AuthGuard} from "../guards/auth.guard";
import {VocabularyComponent} from "../components/vocabulary/vocabulary.component";
import {LoginGuard} from "../guards/login.guard";
import {OauthResolver} from "../resolver/OauthResolver";

export const APP_ROUTE: Routes = [
    {path: 'login', component: LoginComponent, canActivate: [LoginGuard]},
    {path: 'vocabulary', component: VocabularyComponent, canActivate: [AuthGuard]},
    {path: 'abc', component: ABCComponent, canActivate: [AuthGuard], resolve : {authResolver: OauthResolver}}
];
