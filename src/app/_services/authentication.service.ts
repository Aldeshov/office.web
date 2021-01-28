import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BASE_URL } from './config'

import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    // For More Info https://jasonwatmore.com/post/2019/06/22/angular-8-jwt-authentication-example-tutorial#app-module-ts
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${BASE_URL}/api/login/`, { username, password })
            .pipe(map(response => {
                let key = "JWT " + response.token;

                const headerDict = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': key,
                }

                const requestOptions = {                                                                                                                                                                                 
                    headers: new HttpHeaders(headerDict), 
                };

                return this.http.get<User>(`${BASE_URL}/api/user/`, requestOptions).pipe(map(user => {
                    user.token = response.token
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    return user;
                }))
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}