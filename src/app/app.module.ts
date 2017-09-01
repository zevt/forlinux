import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {APP_ROUTE} from "./routes/route";
import {RouterModule} from "@angular/router";
import {HttpModule} from "@angular/http";
import {GoogleOauth2Service} from "./services/google-oauth2.service";
import {OAuthService} from "./services/oauth.service";
import {NavbarComponent} from './components/navbar/navbar.component';
import {ABCComponent} from './components/abc/abc.component';
import {AuthGuard} from "./guards/auth.guard";
import {VocabularyComponent} from './components/vocabulary/vocabulary.component';
import {FacebookAuthService} from "./services/facebook-auth.service";
import {FacebookModule} from "ngx-facebook";
import {LoginGuard} from "./guards/login.guard";
import {AuthComponent} from "./components/auth/auth.component";

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        NavbarComponent,
        ABCComponent,
        VocabularyComponent,
        AuthComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(APP_ROUTE),
        HttpModule,
        FacebookModule.forRoot()
    ],
    providers: [
        GoogleOauth2Service,
        FacebookAuthService,
        OAuthService, AuthGuard, LoginGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
