export class User {
    id: string;
    username: string;
    password: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    lastLogin?: Date;
    position?: string;
    roles: Role[];

    constructor() {
        this.roles = [];
    }
}

export class Role {
    id: string;
    name?: string;
    permissions?: Permission[];
}

export class Permission {
    id: string;
    name: string;
}