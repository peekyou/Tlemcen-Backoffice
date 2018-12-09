export class User {
    id: string;
    username: string;
    password: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    lastLogin?: Date;
    status?: string;
    permissions: string[];

    constructor() {
        this.permissions = [];
    }
}

export class Permission {
    id: string;
    resourceKey: string;
}