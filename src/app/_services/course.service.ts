//CopyRight Azat - unknown

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError} from 'rxjs/operators';
import { Course } from '../_models';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class CourseService {

  constructor(private http: HttpClient) { }

  private BASE_URL = "https://forcheck.herokuapp.com"

  private coursesUrl = 'api/courses';
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getCourse(id): Observable<Course> {
    return this.http.get<Course>(`${this.BASE_URL}/${this.coursesUrl}/${id}`).pipe(catchError(this.handleError<Course>('coursesUrl')));
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.BASE_URL}/${this.coursesUrl}`).pipe(catchError(this.handleError<Course[]>('coursesUrl', [])));
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
