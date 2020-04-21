import { Component, OnInit } from '@angular/core';
import { User } from '../_models/User';
import { UserService, AuthenticationService } from '../_services';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})

export class InformationComponent implements OnInit {

  u: User = null;

  loading = true;

  error = "";
  
  constructor(private userService: UserService, private router: Router, private authenticate: AuthenticationService) { }

  ngOnInit(): void {
    this.authenticate.currentUser.subscribe(u => {
      this.u = u;
      this.loading = false;
    });
  }

  save() {
    let old_password = (<HTMLInputElement> document.getElementById("old")).value;
    let new_password1 = (<HTMLInputElement> document.getElementById("new1")).value;
    let new_password2 = (<HTMLInputElement> document.getElementById("new2")).value;
    this.userService.updateUser(this.u, old_password, new_password1, new_password2).pipe(first()).subscribe(msg => {
      this.error = "";
      if(msg.ERROR)
      {
        if(msg.ERROR.old_password)
        {
          this.error += "Password: " + msg.ERROR.old_password
        }
        if(msg.ERROR.new_password1)
        {
          this.error += "New Password: " + msg.ERROR.new_password1
        }
        if(msg.ERROR.new_password2)
        {
          this.error += "New Password: " + msg.ERROR.new_password2
        }
        if(msg.ERROR.username)
        {
          this.error += "login: " + msg.ERROR.new_password2
        }
        console.log(JSON.stringify(msg))
      }
      else
      {
        alert("Changed! \
        Page will reload ")
        this.authenticate.logout()
        this.router.navigate(['/login']);
      }
    });
  }
}
