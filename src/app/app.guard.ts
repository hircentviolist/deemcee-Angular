import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from './auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class LoggedInOnlyGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {};

    canActivate() {
        if (!this.authService.isSignedIn()) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}

@Injectable({
    providedIn: 'root'
})
export class RedirectIfLogin implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {};

    canActivate() {
        if (this.authService.isSignedIn()) {
            if (['superadmin', 'admin'].includes(this.authService.credential$.value.role)) {
                this.router.navigate(['/hq']);
            } else {
                this.router.navigate(['/branch']);
            }
            return false;
        }
        return true;
    }
}