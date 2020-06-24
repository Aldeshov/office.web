//CopyRight Azat - unknown

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError} from 'rxjs/operators';
import { User, Student } from '../_models';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class UserService {
    
    constructor(private http: HttpClient) { }

    private BASE_URL = "http://127.0.0.1:8000"

    private userUrl = 'api/user';
    
    private studentsUrl = 'api/user/students'
    
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    getUser(): Observable<User> {
        return this.http.get<User>(`${this.BASE_URL}/${this.userUrl}`).pipe(catchError(this.handleError<User>('userUrl')));
    }

    getUserbyID(id: number): Observable<User> {
        return this.http.get<User>(`${this.BASE_URL}/${this.userUrl}/${id}`).pipe(catchError(this.handleError<User>('userUrl')));
    }

    updateUser(updated: User, old_password: string, new_password1: string, new_password2: string): Observable<any>{
        let new_data = 
        {
            id: updated.id,
            username: updated.username,
            first_name: updated.first_name,
            last_name: updated.last_name,
            email: updated.email,
            old_password: old_password,
            new_password1: new_password1,
            new_password2: new_password2
        }
        return this.http.put<any>(`${this.BASE_URL}/${this.userUrl}/`, new_data, this.httpOptions).pipe(
            catchError(this.handleError<any>('updateUser'))
        );
    }

    getStudents(): Observable<Student[]> {
        return this.http.get<Student[]>(`${this.BASE_URL}/${this.studentsUrl}`).pipe(catchError(this.handleError<Student[]>('studentsUrl', [])));
    }
    
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error("ERROR:" + error); // log to console instead
        
            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}