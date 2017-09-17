export interface IAuthResponse {

    getAccessToken(): string;

    getExpiresAt(): number;

}
