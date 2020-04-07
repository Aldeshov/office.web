import { Component, OnInit } from '@angular/core';
import { News } from '../oop/News';
import { UserService } from '../user.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  news: News[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getNews().subscribe(n => this.news = n);
  }

}
