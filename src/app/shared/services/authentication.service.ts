import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  private tokenSubject: BehaviorSubject<String>;
  public token: Observable<String>;

  constructor(private httpClient: HttpClient) {
    this.tokenSubject = new BehaviorSubject<String>(localStorage.getItem('Token'));
    this.token = this.tokenSubject.asObservable();
  }

  public get tokenValue(): String {
    return this.tokenSubject.value;
  }

  login(username: string, password: string) {
    return this.httpClient.post<{ token: string }>(`${environment.API_URL}/login`, {username, password})
      .pipe(map(response => {
        localStorage.setItem('Token', response.token);
        this.tokenSubject.next(response.token);
      }));
  }

  logout() {
    localStorage.removeItem('Token');
    this.tokenSubject.next(null);
  }
}
