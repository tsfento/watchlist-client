import { Component, KeyValueDiffers, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { Subscription } from 'rxjs';
import { WatchTitle } from '../../shared/models/watchtitle';
import { DatePipe, KeyValue, KeyValuePipe } from '@angular/common';
import { TitleService } from '../../core/services/title.service';
import { User } from '../../shared/models/user';
import { UserWatchTitle } from '../../shared/models/user-watch-title';
import { TmdbMovie } from '../../shared/models/tmdbmovie';

@Component({
  selector: 'app-watch-dates',
  standalone: true,
  imports: [KeyValuePipe, DatePipe],
  templateUrl: './watch-dates.component.html',
  styleUrl: './watch-dates.component.scss'
})
export class WatchDatesComponent implements OnInit, OnDestroy {
  currentUser:User | null = null;
  currentUserSub = new Subscription;
  poster_url:string = 'https://image.tmdb.org/t/p/w154'

  watchDates:{[key: string]: WatchTitle[]}[] = [];
  datesBeforeSearch:{[key: string]: WatchTitle[]}[] = [];
  watchDatesSub = new Subscription;
  isAscendingOrder:boolean = false;
  ascOrder:any = (a: KeyValue<string,WatchTitle[]>, b: KeyValue<string,WatchTitle[]>): number => {
    return 0;
  };
  descOrder:any = (a: KeyValue<string,WatchTitle[]>, b: KeyValue<string,WatchTitle[]>): number => {
    return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
  };
  todaysDate = new Date(Date.now()).toISOString().split('T')[0];
  isSearching = false;

  constructor(private userService:UserService, public titleService:TitleService) {}

  ngOnInit(): void {
    this.currentUserSub = this.userService.currentUserBehaviorSubject.subscribe((user) => {
      this.currentUser = user;

      if (this.currentUser !== null) {
        this.userService.getUserWatchDates();
      }
    });

    this.watchDatesSub = this.userService.watchDatesBehaviorSubject.subscribe((dates) => {
      if (dates?.length !== 0) {
        this.watchDates = dates;
        this.datesBeforeSearch = this.watchDates;
      } else {
        this.userService.getUserWatchDates();
      }
    });
  }

  ngOnDestroy(): void {
    this.currentUserSub.unsubscribe();
    this.watchDatesSub.unsubscribe();
  }

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // return true;
    // return false;
  }


  getTmdbIdFromUserWatchTitles(tmdbId:number): UserWatchTitle | undefined {
    if (this.currentUser !== null && this.currentUser.user_watch_titles.length > 0) {
      const userWatchTitle = this.currentUser.user_watch_titles?.find(u => u.watch_title.tmdb_id === tmdbId);

      return userWatchTitle;
    } else {
      return;
    }
  }

  setTitleWatched(title:TmdbMovie, contentType:string) {
    if (this.currentUser !== null && this.currentUser.user_watch_titles.length > 0) {
      const userWatchTitle = this.currentUser.user_watch_titles.find(u => u.watch_title.tmdb_id === title.tmdb_id);

      if (userWatchTitle !== undefined) {
        this.titleService.setTitleWatched(this.currentUser!.username, title, contentType, title.tmdb_id);
        userWatchTitle.watched = !userWatchTitle.watched;
      } else {
        this.titleService.setTitleWatched(this.currentUser!.username, title, contentType, title.tmdb_id);
      }
    }
  }

  setRating(rating:boolean, title:TmdbMovie, contentType:string) {
    if (this.currentUser !== null && this.currentUser.user_watch_titles.length > 0) {
    const userWatchTitle = this.currentUser.user_watch_titles.find(u => u.watch_title.tmdb_id === title.tmdb_id);

      if (userWatchTitle !== undefined) {
        if (userWatchTitle!.rating === rating) {
          this.titleService.setTitleRating(this.currentUser!.username, title, null, contentType, title.tmdb_id);
          userWatchTitle!.rating = null;
        } else {
          this.titleService.setTitleRating(this.currentUser!.username, title, rating, contentType, title.tmdb_id);
          userWatchTitle!.rating = rating;
        }
      } else {
        this.titleService.setTitleRating(this.currentUser!.username, title, rating, contentType, title.tmdb_id);
      }
    }
  }

  searchDate(dateInput:HTMLInputElement) {
    this.isSearching = true;
    this.userService.searchUserWatchDates(dateInput.value).subscribe({
      next: (response:any) => {
        this.watchDates = response;
      },
      error: (error:any) => {
        console.log(error);
      }
    })
  }

  resetSearch(dateInput:HTMLInputElement) {
    this.isSearching = false;
    dateInput.value = this.todaysDate;
    this.watchDates = this.datesBeforeSearch;
  }

  changeSort() {
    this.isAscendingOrder = !this.isAscendingOrder;
  }
}
