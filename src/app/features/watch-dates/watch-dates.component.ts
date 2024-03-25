import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-watch-dates',
  standalone: true,
  imports: [],
  templateUrl: './watch-dates.component.html',
  styleUrl: './watch-dates.component.scss'
})
export class WatchDatesComponent implements OnInit, OnDestroy {
  watchDates:any;
  watchDatesSub = new Subscription;

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
}
