import { Component, KeyValueDiffers, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { Subscription } from 'rxjs';
import { WatchTitle } from '../../shared/models/watchtitle';
import { DatePipe, KeyValue, KeyValuePipe } from '@angular/common';
import { TitleService } from '../../core/services/title.service';
import { User } from '../../shared/models/user';
import { UserWatchTitle } from '../../shared/models/user-watch-title';

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
  currentUserWatchTitles:UserWatchTitle[] | null = null;
  currentUserWatchTitlesSub = new Subscription;
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
    });

    this.currentUserWatchTitlesSub = this.userService.currentUserWatchTitlesSubject.subscribe((user_watch_titles) => {
      if (user_watch_titles !== null && user_watch_titles.length !== 0) {
        this.currentUserWatchTitles = user_watch_titles;
      } else {
        this.userService.getUserWatchTitles();
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
    this.currentUserWatchTitlesSub.unsubscribe();
    this.watchDatesSub.unsubscribe();
  }

  getTmdbIdFromUserWatchTitles(tmdbId:number): boolean | undefined {
    if (this.currentUserWatchTitles !== null) {
      const userWatchTitle = this.currentUserWatchTitles?.find(u => u.watch_title.tmdb_id === tmdbId);

      return userWatchTitle?.watched;
    } else {
      return false;
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
