//CopyRight Azat - unknown

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError} from 'rxjs/operators';
import { News } from '../_models';
import { Observable, of } from 'rxjs';

import { BASE_URL } from './config'

@Injectable({ providedIn: 'root' })

export class NewsService {

  constructor(private http: HttpClient) { }

  private newsUrl = 'api/news';
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getNews(): Observable<News[]> {
    return this.http.get<News[]>(`${BASE_URL}/${this.newsUrl}`).pipe(catchError(this.handleError<News[]>('newsUrl', [])));
  }

  searchNews(term: string): Observable<News[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<News[]>(`${BASE_URL}/${this.newsUrl}/?title=${term}`).pipe(
      catchError(this.handleError<News[]>('search', []))
    );
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
