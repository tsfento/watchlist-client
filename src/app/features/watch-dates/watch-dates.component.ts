import { Component, KeyValueDiffers, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { Subscription } from 'rxjs';
import { WatchTitle } from '../../shared/models/watchtitle';
import { KeyValue, KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-watch-dates',
  standalone: true,
  imports: [KeyValuePipe],
  templateUrl: './watch-dates.component.html',
  styleUrl: './watch-dates.component.scss'
})
export class WatchDatesComponent implements OnInit, OnDestroy {
  watchDates:{[key: string]: WatchTitle[]}[] | null = null;
  watchDatesSub = new Subscription;
  isAscendingOrder:boolean = false;
  ascOrder:any = (a: KeyValue<string,WatchTitle[]>, b: KeyValue<string,WatchTitle[]>): number => {
    return 0;
  };
  descOrder:any = (a: KeyValue<string,WatchTitle[]>, b: KeyValue<string,WatchTitle[]>): number => {
    return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
  };

  constructor(private userService:UserService) {}

  ngOnInit(): void {
    this.userService.getUserWatchDates();

    this.watchDatesSub = this.userService.watchDatesBehaviorSubject.subscribe((dates) => {
      this.watchDates = dates;
      console.log(this.watchDates);
    });
  }

  ngOnDestroy(): void {
    this.watchDatesSub.unsubscribe();
  }

  changeSort() {
    this.isAscendingOrder = !this.isAscendingOrder;
  }

  // ascOrder() {
  //   // TODO
  //   this.watchDatesOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
  //     return 0;
  //   }
  // }

  // descOrder() {
  //   // TODO
  //   this.watchDatesOrder = (a: KeyValue<string,WatchTitle[]>, b: KeyValue<string,WatchTitle[]>): number => {
  //     return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
  //   }
  // }
}
