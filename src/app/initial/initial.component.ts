import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.css']
})
export class InitialComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  remember = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.tokenValue) {
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/welcome';
      this.router.navigate([this.returnUrl]);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/welcome'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/welcome';
  }

  get fields() { return this.loginForm.controls; }

  onSubmit() {
    if (this.loginForm.valid) {
      this.error = '';
      this.loading = true;
      this.submitted = true;
      this.authenticationService.login(this.fields.username.value, this.fields.password.value).pipe(first())
        .subscribe(
          _ => { this.router.navigate([this.returnUrl]); },
          error => {
            this.loading = false;
            this.submitted = false;
            this.error = error.errors.non_field_errors || JSON.stringify(error.errors);
          });
    }
  }
}