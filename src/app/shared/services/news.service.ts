import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {News} from '../models';
import {Observable, of} from 'rxjs';

import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})

export class NewsService {
  private newsUrl = `${environment.API_URL}/news/`;

  constructor(private http: HttpClient) {
  }

  getNews(): Observable<News[]> {
    return this.http.get<News[]>(this.newsUrl).pipe(catchError(this.handleError<News[]>('newsUrl', [])));
  }

  searchNews(term: string): Observable<News[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<News[]>(`${this.newsUrl}?title=${term}`).pipe(
      catchError(this.handleError<News[]>('search', []))
    );
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
