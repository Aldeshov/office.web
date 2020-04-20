import { Component, OnInit } from '@angular/core';
import { News } from '../_models/News';
import { Observable, Subject } from 'rxjs';

import {
  debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { UserService } from '../_services';
 
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  news$: Observable<News[]> = null;
  private searchTerms = new Subject<string>();

  constructor(private userService: UserService) { }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.news$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.userService.searchNews(term)),
    );
  }

  go(){
  }
}
