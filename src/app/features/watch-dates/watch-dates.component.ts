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

  watchDates:{[key: string]: WatchTitle[]}[] | null = null;
  watchDatesSub = new Subscription;
  isAscendingOrder:boolean = false;
  ascOrder:any = (a: KeyValue<string,WatchTitle[]>, b: KeyValue<string,WatchTitle[]>): number => {
    return 0;
  };
  descOrder:any = (a: KeyValue<string,WatchTitle[]>, b: KeyValue<string,WatchTitle[]>): number => {
    return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
  };

  constructor(private userService:UserService, public titleService:TitleService) {}

  ngOnInit(): void {
    this.currentUserSub = this.userService.currentUserBehaviorSubject.subscribe((user) => {
      this.currentUser = user;
      this.userService.getUserWatchTitles();
    });

    this.currentUserWatchTitlesSub = this.userService.currentUserWatchTitlesSubject.subscribe((user_watch_titles) => {
      this.currentUserWatchTitles = user_watch_titles;
    });

    this.userService.getUserWatchDates();

    this.watchDatesSub = this.userService.watchDatesBehaviorSubject.subscribe((dates) => {
      this.watchDates = dates;
      // console.log(this.watchDates);
    });
  }

  ngOnDestroy(): void {
    this.currentUserSub.unsubscribe();
    this.currentUserWatchTitlesSub.unsubscribe();
    this.watchDatesSub.unsubscribe();
  }

  getTmdbIdFromUserWatchTitles(tmdbId:number): boolean | undefined {
    if (this.currentUserWatchTitles !== null) {
      const userWatchTitle = this.currentUserWatchTitles?.find(t => t.watch_title.tmdb_id === tmdbId);

      return userWatchTitle?.watched;
    } else {
      return false;
    }
  }

  changeSort() {
    this.isAscendingOrder = !this.isAscendingOrder;
  }
}
