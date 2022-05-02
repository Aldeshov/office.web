import {Component, OnInit} from '@angular/core';
import {News} from '../../shared/models';
import {Observable, Subject} from 'rxjs';

import {debounceTime, distinctUntilChanged, switchMap, takeUntil} from 'rxjs/operators';

import {NewsService} from '../../shared/services';
import {NbSearchService} from '@nebular/theme';
import {BaseComponent} from '../base.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent extends BaseComponent implements OnInit {
  news$: Observable<News[]> = null;
  value: string = ''

  private searchTerms = new Subject<string>();

  constructor(private newsService: NewsService, private searchService: NbSearchService) {
    super();
    this.searchService.onSearchActivate()
      .subscribe((data: any) => {
        this.value = data.term
      })
    this.searchService.onSearchInput()
      .subscribe((data: any) => {
        this.search(data.term)
        this.value = data.term
      })
    this.searchService.onSearchSubmit()
      .subscribe((data: any) => {
        this.search(data.term)
        this.value = data.term
      })
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.news$ = this.searchTerms
      .pipe(
        // wait 300ms after each keystroke before considering the term
        debounceTime(500),

        // ignore new term if same as previous term
        distinctUntilChanged(),

        // switch to new search observable each time the term changes
        switchMap((term: string) => this.newsService.searchNews(term)),

        // finish observable when destroyed
        takeUntil(this.destroyed)
      );
  }
}
