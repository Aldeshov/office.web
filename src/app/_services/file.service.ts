//CopyRight Azat - unknown

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError} from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class FileService {

  constructor(private http: HttpClient) { }

  private BASE_URL = "https://forcheck.herokuapp.com"

  private filesUrl = 'api/files';
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getFiles(teacher = 0, path = "%2F"): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/${this.filesUrl}/${teacher}/${path}/`).pipe(catchError(this.handleError<any>('filesUrl', [])));
  }

  getFile(teacher = 0, path = "%2F", name = ""): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/${this.filesUrl}/${teacher}/${path}/${name}/`).pipe(catchError(this.handleError<any>('filesUrl')));
  }

  updateFile(teacher = 0, path = "%2F", name = "", students = [], new_name, new_path): Observable<any> {
    let s = [];
    for(let i = 0; i < students.length; i++)
    {
      s.push(students[i].id)
    }
    let body = 
    {
      name: new_name,
      path: new_path,
      students: s,
    }
    return this.http.put<any>(`${this.BASE_URL}/${this.filesUrl}/${name}/${teacher}/${path}/`,body, this.httpOptions).pipe(catchError(this.handleError<any>('filesUrl')));
  }

  deleteFile(teacher = 0, path = "%2F", name = ""): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/${this.filesUrl}/${name}/${teacher}/${path}/`).pipe(catchError(this.handleError<any>('filesUrl')));
  }

  addFile(id, path = "%2F", name = "", students =[]): Observable<any> {
    let s = [];
    for(let i = 0; i < students.length; i++)
    {
      s.push(students[i].id)
    }
    let body = 
    {
      name: name,
      path: path,
      students: s,
      owner_id: id
    }
    path = encodeURIComponent(path)
    return this.http.post<any>(`${this.BASE_URL}/${this.filesUrl}/${id}/${path}/`,body, this.httpOptions).pipe(catchError(this.handleError<any>('filesUrl')));
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
