import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map} from 'rxjs/operators';

import { Observable, of } from 'rxjs';

import { User } from './oop/User';
import { News } from './oop/News';
import { Course } from './oop/Course';
import { CourseFile } from './oop/CourseFile';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl = 'api/Users';
  private newsUrl = 'api/News';
  private coursesUrl = 'api/Courses';
  private filesUrl = 'api/Files';

  constructor(private http: HttpClient) { }

  getUser(log: string, pass: string): Observable<User> {
    return this.http.get<User[]>(this.usersUrl).pipe(map(users => users.find(s => s.login == log && s.password == pass),catchError(this.handleError<User[]>('usersUrl', []))))
  }

  getNews(): Observable<News[]> {
    return this.http.get<News[]>(this.newsUrl).pipe(catchError(this.handleError<News[]>('newsUrl', [])));
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.coursesUrl).pipe(catchError(this.handleError<Course[]>('coursesUrl', [])));
  }

  getFiles(id: string): Observable<CourseFile[]> {
    return this.http.get<CourseFile[]>(`${this.filesUrl}/?path=${id}`).pipe(catchError(this.handleError<CourseFile[]>('coursesUrl', [])));
  }

  getTeacherCourses(teacherid: string): Observable<Course[]> {
    return this.http.get<Course[]>(this.coursesUrl).pipe(map(courses => courses.filter(c => c.teacher.id == teacherid),catchError(this.handleError<Course[]>('coursesUrl', []))))
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error("ERROR:" + error); // log to console instead
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  setCookie(parameter, value, exdays): void {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = parameter + "=" + value + ";" + expires + ";path=/";
  }

  getCookie(parameter) {
    var get = parameter + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(get) == 0) {
        return c.substring(get.length, c.length);
      }
    }
    return "";
  }

  checkCookie(un: String,pw: String): Observable<User> {
    var value1 = this.getCookie(un);
    var value2 = this.getCookie(pw);
    if (value1 != "" && value2 != "") 
    {
      return this.getUser(value1,value2);
    }
    return of(null);
  }
}
