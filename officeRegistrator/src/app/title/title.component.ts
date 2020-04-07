import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit {
  @Input() u;

  title: String = "Welcome";

  hour = new Date().getHours();

  constructor() { }

  ngOnInit(): void {
    if(this.hour >= 0 && this.hour <= 4)
    {
      this.title = "Good night";
    }
    if(this.hour >= 5 && this.hour <= 11)
    {
      this.title = "Good morning";
    }
    if(this.hour >= 12 && this.hour <= 17)
    {
      this.title = "Good afternoon";
    }
    if(this.hour >= 18 && this.hour <= 22)
    {
      this.title = "Good evening";
    }
    if(this.hour >= 23)
    {
      this.title = "Good night";
    }
  }
}
