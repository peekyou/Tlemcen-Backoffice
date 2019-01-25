import {
    Router, CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild } from '@angular/router';
import { Injectable } from '@angular/core';

import { AuthService } from '../../auth/auth.service';

@Injectable()
export class RoleGuard implements CanActivate, CanActivateChild {

    constructor(private auth: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        var roles: string[] = route && route.data["roles"] ? route.data["roles"] : null;
        if (this.auth.isInRole(roles)) {
            return true;
        }
        this.router.navigate(['/']);
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

}

