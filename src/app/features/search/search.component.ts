import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { TmdbService } from '../../core/services/tmdb.service';
import { Subscription } from 'rxjs';
import { TmdbMovie } from '../../shared/models/tmdbmovie';
import { DatePipe } from '@angular/common';
import { UserWatchTitle } from '../../shared/models/user-watch-title';
import { UserService } from '../../core/services/user.service';
import { TitleService } from '../../core/services/title.service';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit, OnDestroy {
  page:number = 1;
  perPage:number = 20;
  isLoading:boolean = false;

  poster_url:string = 'https://image.tmdb.org/t/p/w154'

  currentUser:User | null = null;
  currentUserSub = new Subscription;

  searchValue:string = '';
  searchSub = new Subscription;
  searchType:string = 'movie';
  searchLang:string = 'en';

  searchResults:TmdbMovie[] = [];
  searchResultsSub = new Subscription;

  constructor(private tmdbService:TmdbService, public titleService:TitleService, private userService:UserService) {}

  @HostListener('window:scroll',['$event'])
  onWindowScroll(){
    if(window.innerHeight+window.scrollY>=document.body.offsetHeight&&!this.isLoading){
      // console.log(event);
      this.loadNextPage(this.page + 1);
    }
  }

  ngOnInit(): void {
    this.currentUserSub = this.userService.currentUserBehaviorSubject.subscribe((user) => {
      this.currentUser = user;
    });

    this.searchSub = this.tmdbService.searchSubject.subscribe((search) => {
      this.searchValue = search;
      this.searchResults = [];
      this.tmdbService.getSearchResults(this.searchValue, this.searchType, this.searchLang);
    });

    this.searchResultsSub = this.tmdbService.gotSearchResults.subscribe((results) => {
      this.searchResults = [...this.searchResults, ...results];
    });
  }

  ngOnDestroy(): void {
    this.currentUserSub.unsubscribe();
    this.searchSub.unsubscribe();
    this.searchResultsSub.unsubscribe();
  }

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // return true;
    // return false;
  }

  getTmdbIdFromUserWatchTitles(tmdbId:number): UserWatchTitle | undefined {
    if (this.currentUser !== null && this.currentUser.user_watch_titles.length > 0) {
      const userWatchTitle = this.currentUser.user_watch_titles?.find(u => u.watch_title.tmdb_id === tmdbId);

      // console.log(userWatchTitle);

      return userWatchTitle;
    } else {
      return;
    }
  }

  setTitleWatched(title:TmdbMovie, contentType:string) {
    if (this.currentUser !== null && this.currentUser.user_watch_titles.length > 0) {
      const userWatchTitle = this.currentUser.user_watch_titles.find(u => u.watch_title.tmdb_id === title.id);

      if (userWatchTitle !== undefined) {
        this.titleService.setTitleWatched(this.currentUser!.username, title, contentType);
        userWatchTitle.watched = !userWatchTitle.watched;
      } else {
        this.titleService.setTitleWatched(this.currentUser!.username, title, contentType);
      }
    }
  }

  setRating(rating:boolean, title:TmdbMovie, contentType:string) {
    if (this.currentUser !== null && this.currentUser.user_watch_titles.length > 0) {
    const userWatchTitle = this.currentUser.user_watch_titles.find(u => u.watch_title.tmdb_id === title.id);

      if (userWatchTitle !== undefined) {
        if (userWatchTitle!.rating === rating) {
          this.titleService.setTitleRating(this.currentUser!.username, title, null, contentType, title.id);
          userWatchTitle!.rating = null;
        } else {
          this.titleService.setTitleRating(this.currentUser!.username, title, rating, contentType, title.id);
          userWatchTitle!.rating = rating;
        }
      } else {
        this.titleService.setTitleRating(this.currentUser!.username, title, rating, contentType, title.id);
      }
    }
  }

  setSearchType(type:string) {
    this.searchType = type;
    // console.log(this.searchType);
  }

  setSearchLang(lang:string) {
    this.searchLang = lang;
  }

  filterResults() {
    this.searchResults = [];
    this.tmdbService.getSearchResults(this.searchValue, this.searchType, this.searchLang);
  }

  loadNextPage(pageNum:number) {
    this.isLoading = true;
    this.tmdbService.getSearchResults(this.searchValue, this.searchType, this.searchLang, pageNum);
    this.page++;
    this.isLoading = false;
  }
}
