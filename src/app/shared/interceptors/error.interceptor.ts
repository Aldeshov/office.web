import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {AuthenticationService} from '../services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(response => {
      console.error(response.message);

      if (response.status === 401) {
        this.authenticationService.logout();
        window.location.reload();
      }

      if (response.status === 0) {
        return throwError({
          status: response.status,
          errors: response.statusText
        });
      }

      return throwError({
        status: response.status,
        errors: response.error
      });
    }))
  }
}
