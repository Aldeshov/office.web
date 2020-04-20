import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService, UserService } from '../_services';
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
    private userService: UserService, 
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
    ) { 
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
          this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/welcome';
          this.router.navigate([this.returnUrl]);
      }
    }

  ngOnInit(){
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/welcome'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/welcome';
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }

      this.loading = true;
      this.authenticationService.login(this.f.username.value, this.f.password.value)
          .pipe(first())
          .subscribe(
              data => {
                this.router.navigate([this.returnUrl]);
              },
              error => {
                  this.error = error;
                  this.loading = false;
              });
  }
}
