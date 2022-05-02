import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class FileService {
  private filesUrl = `${environment.API_URL}/files/`;

  constructor(private http: HttpClient) {
  }

  getFiles(teacher = 0, path = '%2F'): Observable<any> {
    if (teacher === 0)
      return this.http.get<any>(`${this.filesUrl}?path=${path}`).pipe(catchError(this.handleError<any>('filesUrl', [])));
    return this.http.get<any>(`${this.filesUrl}?teacher=${teacher}&path=${path}`).pipe(catchError(this.handleError<any>('filesUrl', [])));
  }

  getFile(id = 0): Observable<any> {
    return this.http.get<any>(`${this.filesUrl}${id}/`).pipe(catchError(this.handleError<any>('filesUrl')));
  }

  updateFile(id = 0, name: string, path: string, students = []): Observable<any> {
    let body = {
      name: name,
      path: path,
      students: students.map(student => {
        return student.id
      }),
    }
    return this.http.put<any>(`${this.filesUrl}${id}/`, body).pipe(catchError(this.handleError<any>('filesUrl')));
  }

  deleteFile(id = 0): Observable<any> {
    return this.http.delete<any>(`${this.filesUrl}${id}/`).pipe(catchError(this.handleError<any>('filesUrl')));
  }

  addFile(name = '', path = '%2F', students = []): Observable<any> {
    let body = {
      name: name,
      path: path,
      students: students.map(student => {
        return student.id
      }),
    }
    return this.http.post<any>(this.filesUrl, body).pipe(catchError(this.handleError<any>('filesUrl')));
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
