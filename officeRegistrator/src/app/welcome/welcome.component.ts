import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { UserService } from '../user.service'
import { User } from '../oop/User';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  
  u: User = null;

  constructor(private userService: UserService, private router: Router) { }
  
  ngOnInit(): void {
    this.userService.checkCookie("userName","userPassword").subscribe(u => {if(u){this.u = u;}else{this.router.navigate(['']);}});
  }
}