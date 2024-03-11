import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  searchForm:FormGroup = new FormGroup({
    search: new FormControl('', Validators.required)
  });

  currentUser:User | null = null;
  currentUserSub = new Subscription;

  isSearching:boolean = false;

  constructor(public router:Router, private authService:AuthenticationService, private userService:UserService) {}

  ngOnInit(): void {
    this.currentUserSub = this.userService.currentUserBehaviorSubject.subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    this.currentUserSub.unsubscribe();
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
  }

  toggleSearching() {
    this.isSearching = !this.isSearching;
  }

  onSearch() {
    console.log(this.searchForm.value.search);
  }

  onRoute(route:string) {
    return this.router.url.includes(route);
  }
}
