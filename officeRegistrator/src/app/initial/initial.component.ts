import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { UserService } from '../user.service'
import { User } from '../oop/User';

@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.css']
})
export class InitialComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.checkCookie("userName","userPassword").subscribe(u => this.check(u));
    if(this.userService.getCookie("userName") != "")
    {
      (<HTMLInputElement> document.getElementById("inname")).value = this.userService.getCookie("userName");
    }
  }

  go() {
    let userName = (<HTMLInputElement> document.getElementById("inname")).value;
    let userPassword = (<HTMLInputElement> document.getElementById("inpassword")).value;
    let c = (<HTMLInputElement> document.getElementById("save")).checked;

    this.userService.getUser(userName, userPassword).subscribe(u => this.check(u, c, true));
  }

  check(u: User, check = false, d = false): void {
    if(u != null) {
      let userName = u.login;
      let userPassword = u.password;

      if(check)
      {
        this.userService.setCookie("userName",userName, 99);
        this.userService.setCookie("userPassword",userPassword, 99);
      }
      else
      {
        if(d)
        {
          this.userService.setCookie("userName",userName, 0.001);
          this.userService.setCookie("userPassword",userPassword, 0.001);
        }
      }
      this.router.navigate(['/welcome']);
    }
    else
    {
      if(d)
      {
        (<HTMLInputElement> document.getElementById("inname")).style.borderBottomColor = "red";
        (<HTMLInputElement> document.getElementById("inpassword")).style.borderBottomColor = "red";
        (<HTMLInputElement> document.getElementById("inname")).value = "";
        (<HTMLInputElement> document.getElementById("inpassword")).value = "";
      }
    }
  }
}
