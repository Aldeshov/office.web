import { Component, OnInit } from '@angular/core';
import { News } from '../_models/News';
import { NewsService } from '../_services';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  news: News[] = [];

  loading = true;

  constructor(private newsService: NewsService) { }

  ngOnInit(): void {
    this.newsService.getNews().subscribe(n => {
      this.news = n;
      this.loading = false;
    });
  }

}
