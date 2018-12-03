import {
    Router, CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild } from '@angular/router';
import { Injectable } from '@angular/core';

import { AuthService } from '../../auth/auth.service';

@Injectable()
export class PermissionGuard implements CanActivate, CanActivateChild {

    constructor(private auth: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        var permission: string = route && route.data["permission"] ? route.data["permission"] : null;
        if (this.auth.hasPermission(permission)) {
            return true;
        }
        this.router.navigate(['/']);
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

}

