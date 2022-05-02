import {Component, Input} from '@angular/core';
import {User} from '../../shared/models';
import {first} from 'rxjs/operators';
import {UserService} from '../../shared/services';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})

export class InformationComponent {
  @Input() user: User;
  error: string;

  constructor(private userService: UserService) {
  }

  save() {
    document.getElementById('main').classList.add('disable');
    let old_password = (<HTMLInputElement>document.getElementById('old')).value;
    let new_password1 = (<HTMLInputElement>document.getElementById('new1')).value;
    let new_password2 = (<HTMLInputElement>document.getElementById('new2')).value;

    this.userService.updateUser(this.user, old_password, new_password1, new_password2).pipe(first())
      .subscribe(_ => {
        location.reload()
      }, error => {
        document.getElementById('main').classList.remove('disable');
        if (error.errors.old_password) {
          this.error = 'Old Password: ' + error.errors.old_password;
          return;
        }

        if (error.errors.new_password1) {
          this.error = 'New Password: ' + error.errors.new_password1;
          return;
        }

        if (error.errors.new_password2) {
          this.error = 'Confirm Password: ' + error.errors.new_password2;
          return;
        }

        if (error.errors.username) {
          this.error = 'Login: ' + error.errors.username;
          return;
        }
      });
  }
}
