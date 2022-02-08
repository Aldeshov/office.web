import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Course } from '../_models';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })

export class CourseService {
  constructor(private http: HttpClient) { }

  private coursesUrl = `${environment.API_URL}/courses`;

  getCourse(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.coursesUrl}/${id}`).pipe(catchError(this.handleError<Course>('coursesUrl')));
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.coursesUrl).pipe(catchError(this.handleError<Course[]>('coursesUrl', [])));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error("Course Service: " + error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
