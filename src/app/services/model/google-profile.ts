import {AuthResponse} from "./auth-response";

export interface GoogleProfile {
    getEmail(): string;

    getName(): string;

    getAuthResponse(): AuthResponse;
}
