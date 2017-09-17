import {Headers} from "@angular/http";
import {AppComponent} from "../app.component";

export class HeaderBuilder {
    private headers: Headers;

    constructor() {
        this.headers = new Headers({'Content-Type': 'application/json'});
        this.headers.append('Access-Control-Allow-Origin', AppComponent.ORIGIN_URL);
    }

    build() {
        return this.headers;
    }

    append(name: string, value): HeaderBuilder {
        this.headers.append(name, value);
        return this;
    }
}

export class RestUrlBuilder {
    private url: string;
    private valueSet = {};

    constructor(url: string) {
        this.url = url;
    }

    append(parameter: string, value): RestUrlBuilder {
        this.valueSet[parameter] = value;
        return this;
    }

    build() {
        this.url += '?';
        Object.keys(this.valueSet).forEach(p => {
            this.url += p + '=' + this.valueSet[p] + '&';
        });
        this.url = this.url.substr(0, this.url.length - 1);
        return this.url;
    }
}
