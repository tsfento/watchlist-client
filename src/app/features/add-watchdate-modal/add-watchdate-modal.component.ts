import { Component, OnDestroy, OnInit } from '@angular/core';
import { WatchTitleSend } from '../../shared/models/watchtitlesend';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../shared/models/user';
import { TitleService } from '../../core/services/title.service';
import { UserService } from '../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

declare var window:any;

@Component({
  selector: 'app-add-watchdate-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-watchdate-modal.component.html',
  styleUrl: './add-watchdate-modal.component.scss'
})
export class AddWatchdateModalComponent implements OnInit, OnDestroy {
  titleToAdd:WatchTitleSend = new WatchTitleSend(-1, '', '', '', '', '', -1, '');
  setTitleToAddSub = new Subscription;
  todaysDate = new Date(Date.now()).toISOString().split('T')[0];

  addWatchDateForm:FormGroup = new FormGroup({
    // today's date formatted and split to be YYYY-MM-DD:
    // new Date(Date.now()).toISOString().split('T')[0];
    date: new FormControl(this.todaysDate, Validators.required),
  });
  currentUser:User | null = null;
  currentUserSub = new Subscription;

  constructor(private titleService:TitleService, private userService:UserService, private http:HttpClient) {}

  ngOnInit(): void {
    this.setTitleToAddSub = this.titleService.titleToAddSubject.subscribe((gotTitle) => {
      this.titleToAdd = gotTitle;
    });

    this.currentUserSub = this.userService.currentUserBehaviorSubject.subscribe((user) => {
      this.currentUser = user;
    });

    // this.showAddWatchDateModal();
  }

  ngOnDestroy(): void {
    this.currentUserSub.unsubscribe();
    this.setTitleToAddSub.unsubscribe();
  }

  showAddWatchDateModal() {
    const watchDateModal:any = new window.bootstrap.Modal(document.getElementById('addWatchDateModal'));

    watchDateModal.show();
  }

  onAddWatchDate() {
    // Release Date YYYY-MM-DD

    // spread titleToAdd and addWatchDateForm.value into single object
    // {...this.titleToAdd, ...this.addWatchDateForm.value}

    this.http.post<WatchTitleSend>(`${environment.apiUrl}/users/${this.currentUser?.username}/add_watch_date`, {
      ...this.titleToAdd,
      ...this.addWatchDateForm.value
    }).subscribe({
      next: (response:any) => {
        this.userService.addWatchDate(response);
        this.userService.getUserWatchDates();
      },
      error: (error:any) => {
        console.log(error);
      }
    });
  }
}
