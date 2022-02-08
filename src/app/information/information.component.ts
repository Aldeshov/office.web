import { Component, OnInit } from '@angular/core';
import { User } from '../_models/User';
import { UserService } from '../_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})

export class InformationComponent implements OnInit {
  loading = true;
  error: string;

  user: User = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUser().subscribe(response => {
      this.loading = false;
      this.user = response;
    });
  }

  save() {
    document.getElementById('main').classList.add('disable');
    let old_password = (<HTMLInputElement>document.getElementById("old")).value;
    let new_password1 = (<HTMLInputElement>document.getElementById("new1")).value;
    let new_password2 = (<HTMLInputElement>document.getElementById("new2")).value;

    this.userService.updateUser(this.user, old_password, new_password1, new_password2).pipe(first())
      .subscribe(_ => { location.reload() }, error => {
        document.getElementById('main').classList.remove('disable');
        if (error.errors.old_password) {
          this.error = "Old Password: " + error.errors.old_password;
          return;
        }

        if (error.errors.new_password1) {
          this.error = "New Password: " + error.errors.new_password1;
          return;
        }

        if (error.errors.new_password2) {
          this.error = "Confirm Password: " + error.errors.new_password2;
          return;
        }

        if (error.errors.username) {
          this.error = "Login: " + error.errors.username;
          return;
        }
      });
  }
}
