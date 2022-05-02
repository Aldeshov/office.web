import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Course} from '../models';
import {Observable, of} from 'rxjs';

import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class CourseService {
  private coursesUrl = `${environment.API_URL}/courses`;

  constructor(private http: HttpClient) {
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.coursesUrl).pipe(catchError(this.handleError<Course[]>('coursesUrl', [])));
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
