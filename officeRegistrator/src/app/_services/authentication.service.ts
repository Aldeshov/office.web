import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User, LoginResponse } from '../_models';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    // For More Info https://jasonwatmore.com/post/2019/06/22/angular-8-jwt-authentication-example-tutorial#app-module-ts
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    private BASE_URL = "http://127.0.0.1:8000"

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<LoginResponse>(`${this.BASE_URL}/api/login/`, { username, password })
            .pipe(map(token => {
                let key = "JWT " + token.token;
                const headerDict = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Authorization': key
                }
                const requestOptions = {                                                                                                                                                                                 
                    headers: new HttpHeaders(headerDict), 
                };
                this.http.get<User>(`${this.BASE_URL}/api/user/`, requestOptions).subscribe(user => {
                    user.token = token.token;
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    return user;
                })
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}