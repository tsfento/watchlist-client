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

  constructor(private authService:AuthenticationService, private router:Router) {}

  login() {
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;

      this.authService.login(username, password).subscribe({
        next: (response:any) => {
          // console.log(response);
          this.router.navigate(['/lists']);
        },
        error: (error:any) => {
          console.log('Error logging in', error);
        }
      });
    }
  }

  signUp() {
    if (this.signUpForm.valid) {
      const email = this.signUpForm.value.email;
      const username = this.signUpForm.value.username;
      const password = this.signUpForm.value.password;
      const password_confirmation = this.signUpForm.value.password_confirmation;

      this.authService.signUp(email, username, password, password_confirmation).subscribe({
        next: (response:any) => {
          this.isLoggingIn = true;
        },
        error: (error:any) => {
          console.log('Error signing up', error);
        }
      });
    }
  }

  switchLoginOrSignUp(option:string) {
    switch (option) {
      case 'login':
        this.isLoggingIn = true;
        break;
      case 'signup':
        this.isLoggingIn = false;
        break;
    }
  }
}
