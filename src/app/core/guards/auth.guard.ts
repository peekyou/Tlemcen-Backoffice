import {
    Router, CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(private router: Router, private auth: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.auth.isAuthenticated()) {
            return true;
        }
        this.router.navigate(['/auth']);
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }
}

