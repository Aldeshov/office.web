//CopyRight Azat - unknown

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError} from 'rxjs/operators';
import { User, Student, Course, News, CourseFile, LoginResponse } from '../_models';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class UserService {

    constructor(private http: HttpClient) { }

    private BASE_URL = "http://127.0.0.1:8000"
    private userUrl = 'api/user';
    private studentsUrl = 'api/user/students'
    private newsUrl = 'api/news';
    private coursesUrl = 'api/courses';
    private filesUrl = 'api/files';
    
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

    getNews(): Observable<News[]> {
        return this.http.get<News[]>(`${this.BASE_URL}/${this.newsUrl}`).pipe(catchError(this.handleError<News[]>('newsUrl', [])));
    }

    getCourse(id): Observable<Course> {
        return this.http.get<Course>(`${this.BASE_URL}/${this.coursesUrl}/${id}`).pipe(catchError(this.handleError<Course>('coursesUrl')));
    }

    getStudents(): Observable<Student[]> {
        return this.http.get<Student[]>(`${this.BASE_URL}/${this.studentsUrl}`).pipe(catchError(this.handleError<Student[]>('studentsUrl', [])));
    }

    getCourses(): Observable<Course[]> {
        return this.http.get<Course[]>(`${this.BASE_URL}/${this.coursesUrl}`).pipe(catchError(this.handleError<Course[]>('coursesUrl', [])));
    }

    getFiles(teacher = 0, path = "%2F"): Observable<any> {
        return this.http.get<any>(`${this.BASE_URL}/${this.filesUrl}/${teacher}/${path}/`).pipe(catchError(this.handleError<any>('filesUrl', [])));
    }

    getFile(teacher = 0, path = "%2F", name = ""): Observable<any> {
        return this.http.get<any>(`${this.BASE_URL}/${this.filesUrl}/${teacher}/${path}/${name}/`).pipe(catchError(this.handleError<any>('filesUrl')));
    }

    updateFile(teacher = 0, path = "%2F", name = "", students = [], new_name, new_path): Observable<any> {
        let s = [];
        for(let i = 0; i < students.length; i++){
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
        for(let i = 0; i < students.length; i++){
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

    searchNews(term: string): Observable<News[]> {
        if (!term.trim()) {
          // if not search term, return empty hero array.
          return of([]);
        }
        return this.http.get<News[]>(`${this.BASE_URL}/${this.newsUrl}/?title=${term}`).pipe(
          catchError(this.handleError<News[]>('search', []))
        );
    }
}