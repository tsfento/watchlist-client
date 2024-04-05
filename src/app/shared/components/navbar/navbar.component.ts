import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../models/user';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { TmdbService } from '../../../core/services/tmdb.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser:User | null = null;
  currentUserSub = new Subscription;

  mobileSearchActive:boolean = false;

  isSearching:boolean = false;
  searchElement:HTMLInputElement | null = null;
  searchSubject = new BehaviorSubject<string>('');

  constructor(public router:Router, private authService:AuthenticationService, private userService:UserService, private tmdbService:TmdbService) {}

  ngOnInit(): void {
    this.currentUserSub = this.userService.currentUserBehaviorSubject.subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    this.currentUserSub.unsubscribe();
  }

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // return true;
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

  clearSearch() {
    if (this.searchElement !== null) {
      this.searchElement.value = '';
    }
  }

  onSearch(search:HTMLInputElement) {
    this.searchElement = search;
    this.mobileSearchActive = false;

    if (search.value) {
      this.tmdbService.setSearch(search.value);

      if (this.router.url !== '/search') {
        this.router.navigate(['/search']);
      }
    }
  }

  clickedMobileSearch() {
    this.mobileSearchActive = !this.mobileSearchActive;
  }

  onRoute(route:string) {
    return this.router.url.includes(route);
  }
}
