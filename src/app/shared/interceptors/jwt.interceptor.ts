import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

import {AuthenticationService} from '../services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authenticationService.tokenValue) {
      request = request.clone({
        setHeaders: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: `JWT ${this.authenticationService.tokenValue}`
        }
      });
    }

    return next.handle(request);
  }
}
