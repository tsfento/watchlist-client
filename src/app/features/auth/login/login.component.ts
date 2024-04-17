import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isLoggingIn:boolean = true;
  loginForm:FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  signUpForm:FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    password_confirmation: new FormControl('', Validators.required)
  });

  emailError:string ='';
  usernameError:string ='';
  passwordError:string ='';
  confirmationError:string ='';
  loginError:string = '';

  constructor(private authService:AuthenticationService, private router:Router) {}

  login() {
    this.resetLoginErrors();
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;

      this.authService.login(username, password).subscribe({
        next: (response:any) => {
          this.router.navigate(['/lists']);
        },
        error: (error:any) => {
          if (error.error['error'] === 'unauthorized') {
            this.loginError = 'Invalid Credentials'
          }
        }
      });
    }
  }

  signUp() {
    this.resetSignupErrors();
    if (this.signUpForm.valid) {
      const email = this.signUpForm.value.email;
      const username = this.signUpForm.value.username;
      const password = this.signUpForm.value.password;
      const password_confirmation = this.signUpForm.value.password_confirmation;

      this.authService.signUp(email, username, password, password_confirmation).subscribe({
        next: (response:any) => {
          this.switchLoginOrSignUp('login');
        },
        error: (error:any) => {
          console.log(error.error);
          // if (error.error['email'][0] === 'has already been taken') {
          //   this.emailError = 'Email is forbidden';
          // } else {
          if (error.error['email']) {
            this.emailError = 'Email ' + error.error['email'][0];
          }
          if (error.error['username']) {
            this.usernameError = 'Username ' + error.error['username'][0];
          }
          if (error.error['password']) {
            this.passwordError = 'Password ' + error.error['password'][0];
          }
          if (error.error['password_confirmation']) {
            this.confirmationError = 'Confirmation ' + error.error['password_confirmation'];
          }
        }
      });
    }
  }

  switchLoginOrSignUp(option:string) {
    switch (option) {
      case 'login':
        this.isLoggingIn = true;
        this.signUpForm.reset();
        this.resetSignupErrors();
        break;
      case 'signup':
        this.isLoggingIn = false;
        this.loginForm.reset();
        this.resetLoginErrors();
        break;
    }
  }

  resetLoginErrors() {
    this.loginError = '';
  }

  resetSignupErrors() {
    this.emailError ='';
    this.usernameError ='';
    this.passwordError ='';
    this.confirmationError ='';
  }
}
