import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'

import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../shared/services';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  showPassword = false;
  submitted = false;
  loading = false;
  returnUrl: string;
  username = '';
  password = '';
  error = '';

  getInputType() {
    return this.showPassword ? 'text' : 'password'
  }

  toggleShowPassword(event) {
    this.showPassword = !this.showPassword;
    event.preventDefault()
  }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.tokenValue) {
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/office';
      this.router.navigate([this.returnUrl]).then(routed => {
        if (routed) console.log('User is already logged in: Redirect to /office');
        else console.log('Something went wrong while routing')
      });
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: new FormControl(this.username, [Validators.required]),
      password: new FormControl(this.password, [Validators.required])
    });

    // get return url from route parameters or default to '/main'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/office';
  }

  get fields() {
    return this.loginForm.controls;
  }

  usernameError() {
    return this.submitted && this.fields.username.errors && this.fields.username.errors.required
  }

  passwordError() {
    return this.submitted && this.fields.password.errors && this.fields.password.errors.required
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.error = '';
      this.loading = true;
      this.submitted = false;
      this.authenticationService.login(this.fields.username.value, this.fields.password.value).pipe(first())
        .subscribe(
          data => this.router.navigate([this.returnUrl]).then((routed) => {
            console.log(`Routed: ${routed}, Data: ${data}`)
          }),
          error => {
            this.loading = false;
            this.error = error.errors.non_field_errors || JSON.stringify(error.errors);
          });
    }
  }
}
