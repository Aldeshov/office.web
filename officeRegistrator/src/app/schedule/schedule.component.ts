import { Component, OnInit } from '@angular/core';
import { Course } from '../oop/Course';
import { range } from 'rxjs';
import { Student } from '../oop/Student';
import { Teacher } from '../oop/Teacher';
import { UserService } from '../user.service';

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

  anums: number[] = [];
  bnums: number[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    if(this.day == -1)
    {
      this.day = 6;
    }

    this.sch = this.newArray(7,13);

    range(0,7).subscribe(x => this.anums[x] = x);
    range(0,13).subscribe(x => this.bnums[x] = x);

    this.userService.checkCookie("userName","userPassword").subscribe(u => this.func(u));
  }

  func(u){
    if(u.type == "Student")
    {
      for(let i = 0; i < (<Student> u).courses.length; i++)
      {
        for(let j = 0; j < (<Student> u).courses[i].schedule.length; j++)
        {
          this.sch[(<Student> u).courses[i].schedule[j][0]][(<Student> u).courses[i].schedule[j][1]] = (<Student> u).courses[i];
        }
      }
    }
    else 
    {
      if(u.type == "Teacher")
      {
        this.userService.getTeacherCourses((<Teacher> u).id).subscribe(cs => this.teachersch(cs));
      }
    }
  }

  newArray(x,y):Course[][] {
    let temp: Course[][] = [];
    for(let i = 0; i < y; i++) {
      temp[i] = [];
      for(let j = 0; j < x; j++) {
        temp[i][j] = null;
      }
    }
    return temp;
  }

  teachersch(courses: Course[]) {
    for(let i = 0; i < courses.length; i++)
    {
      for(let j = 0; j < courses[i].schedule.length; j++)
      {
        this.sch[courses[i].schedule[j][0]][courses[i].schedule[j][1]] = courses[i];
      }
    }
  }
}
