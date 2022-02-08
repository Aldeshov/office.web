import { Component, OnInit } from '@angular/core';
import { Course } from '../_models';
import { range } from 'rxjs';
import { CourseService } from '../_services';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})

export class ScheduleComponent implements OnInit {

  day = new Date().getDay() - 1;
  hour = new Date().getHours();
  min: number = new Date().getMinutes();

  sch: Course[][] = [];
  
  loading = true;
  anums: number[] = [];
  bnums: number[] = [];

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    if (this.day == -1) {
      this.day = 6;
    }

    this.sch = this.newArray(7, 13);

    range(0, 7).subscribe(x => this.anums[x] = x);
    range(0, 13).subscribe(x => this.bnums[x] = x);

    this.courseService.getCourses().subscribe(response => this.func(response));
  }

  func(courses: Course[]) {
    for (let i = 0; i < courses.length; i++) {
      for (let j = 0; j < courses[i].schedule.length; j++) {
        this.sch[courses[i].schedule[j][0]][courses[i].schedule[j][1]] = courses[i];
      }
    }
    this.loading = false;
  }

  newArray(x: number, y: number): Course[][] {
    let temp: Course[][] = [];
    for (let i = 0; i < y; i++) {
      temp[i] = [];
      for (let j = 0; j < x; j++) {
        temp[i][j] = null;
      }
    }
    return temp;
  }
}