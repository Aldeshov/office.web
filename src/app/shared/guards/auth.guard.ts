import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree} from '@angular/router';

import {AuthenticationService} from '../services';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private authenticationService: AuthenticationService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authenticationService.tokenValue) return true;

    // Not logged in so redirect to login page with the return url
    this.router.navigate(['/welcome/login'], {
      queryParams: {returnUrl: state.url}
    }).then(router => console.log(router));
    return false;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authenticationService.tokenValue) return true;

    // Not logged in so redirect to login page with the return url
    this.router.navigate(['/welcome/login'], {
      queryParams: {returnUrl: state.url}
    }).then(router => console.log(router));
    return false;
  }
}
