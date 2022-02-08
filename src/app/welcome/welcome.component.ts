import { Component, OnInit } from '@angular/core';

import { UserService } from '../_services'
import { User } from '../_models';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  
  loading = true;
  user: User = null;

  constructor(private userService: UserService) { }
  
  ngOnInit(): void {
    this.userService.getUser().subscribe(response => {
      this.loading = false;
      this.user = response;
    });
  }
}