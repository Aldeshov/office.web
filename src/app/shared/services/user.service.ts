import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {User} from '../models';
import {Observable, of} from 'rxjs';

import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class UserService {
  private userUrl = `${environment.API_URL}/user/`;
  private studentsUrl = `${this.userUrl}students`;

  constructor(private http: HttpClient) {
  }

  getUser(): Observable<User> {
    return this.http.get<User>(this.userUrl).pipe(catchError(this.handleError<User>('userUrl')));
  }

  updateUser(updated: User, old_password: string, new_password1: string, new_password2: string): Observable<any> {
    let new_data = {
      username: updated.username,
      first_name: updated.first_name,
      last_name: updated.last_name,
      email: updated.email,
      old_password: old_password,
      new_password1: new_password1,
      new_password2: new_password2
    }
    return this.http.put<any>(this.userUrl, new_data)
  }

  getStudents(): Observable<User[]> {
    return this.http.get<User[]>(this.studentsUrl).pipe(catchError(this.handleError<User[]>('studentsUrl', [])));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(`${operation} : ${error}`); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
