//CopyRight Azat - unknown

import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../_services'
import { User } from '../_models';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  
  u: User = null;

  loading = true;

  constructor(private authenticate: AuthenticationService) { }
  
  ngOnInit(): void {
    this.authenticate.currentUser.pipe(debounceTime(300)).subscribe(u => {
      this.u = u;
      this.loading = false;
    });
  }
}