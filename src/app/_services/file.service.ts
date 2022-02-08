import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })

export class FileService {

  constructor(private http: HttpClient) { }

  private filesUrl = `${environment.API_URL}/files/`;

  getFiles(teacher = 0, path = "%2F"): Observable<any> {
    return this.http.get<any>(`${this.filesUrl}${teacher}/${path}/`).pipe(catchError(this.handleError<any>('filesUrl', [])));
  }

  getFile(teacher = 0, path = "%2F", name = ""): Observable<any> {
    return this.http.get<any>(`${this.filesUrl}${teacher}/${path}/${name}/`).pipe(catchError(this.handleError<any>('filesUrl')));
  }

  updateFile(teacher = 0, path = "%2F", name = "", students = [], new_name: string, new_path: string): Observable<any> {
    let body = {
      name: new_name,
      path: new_path,
      students: students.map(student => { return student.id }),
    }
    return this.http.put<any>(`${this.filesUrl}${name}/${teacher}/${path}/`, body).pipe(catchError(this.handleError<any>('filesUrl')));
  }

  deleteFile(teacher = 0, path = "%2F", name = ""): Observable<any> {
    return this.http.delete<any>(`${this.filesUrl}${name}/${teacher}/${path}/`).pipe(catchError(this.handleError<any>('filesUrl')));
  }

  addFile(id = 0, path = "%2F", name = "", students = []): Observable<any> {
    let body = {
      name: name,
      path: path,
      students: students.map(student => { return student.id }),
    }
    return this.http.post<any>(`${this.filesUrl}${id}/${encodeURIComponent(path)}/`, body).pipe(catchError(this.handleError<any>('filesUrl')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error("File Service: " + error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
