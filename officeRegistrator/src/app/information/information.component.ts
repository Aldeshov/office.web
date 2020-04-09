import { Component, OnInit } from '@angular/core';
import { User } from '../oop/User';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {

  u: User = null;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.checkCookie("userName","userPassword").subscribe(u => this.func(u));
  }

  func(u: User) {
    if(u != null)
    {
      this.u = u;
    }
    else
    {
      this.router.navigate(['']);
    }
  }

  save() {
    if((<HTMLInputElement> document.getElementById("new1")).value == (<HTMLInputElement> document.getElementById("new2")).value)
    {
      if((<HTMLInputElement> document.getElementById("new1")).value.length >= 8)
      {
        let p = (<HTMLInputElement> document.getElementById("new1")).value;
        let old = (<HTMLInputElement> document.getElementById("old")).value;
        this.userService.checkCookie("userName","userPassword").subscribe(u => this.check(u, p, old));
      }
      else
      {
        alert("New Password's length must be greater than 8")
      }
    }
    else
    {
      alert("Passwords don't match")
    }
  }

  check(u: User, p: string, old: string){
    if(u != null)
    {
      if(u.password == old){
        u.password = p;
        this.userService.changeUserPassword(u);
        alert("Password changed!");
        (<HTMLInputElement> document.getElementById("new1")).value = "";
        (<HTMLInputElement> document.getElementById("new2")).value = "";
        (<HTMLInputElement> document.getElementById("old")).value = "";
      }
    }
  }
}
