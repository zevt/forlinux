import {IUserProfile} from "./iuser-profile";

export class UserProfile implements IUserProfile {
    name: string;
    email: string;

    constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
    }

    getName(): string {
        return this.name;
    }

    getEmail(): string {
        return this.email;
    }

    getFirstName(): string {
        return null;
    }

    getLastName(): string {
        return null;
    }
}
