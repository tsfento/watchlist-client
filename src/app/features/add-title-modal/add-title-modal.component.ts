import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListService } from '../../core/services/list.service';
import { WatchList } from '../../shared/models/watchlist';
import { Subscription } from 'rxjs';
import { User } from '../../shared/models/user';
import { UserService } from '../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { WatchTitleSend } from '../../shared/models/watchtitlesend';
import { TitleService } from '../../core/services/title.service';

declare var window:any;

@Component({
  selector: 'app-add-title-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-title-modal.component.html',
  styleUrl: './add-title-modal.component.scss'
})
export class AddTitleModalComponent implements OnInit, OnDestroy {
  titleToAdd:WatchTitleSend = new WatchTitleSend(-1, '', '', '', '', '', -1);
  setTitleToAddSub = new Subscription;

  addTitleForm:FormGroup = new FormGroup({
    watch_list: new FormControl('', [Validators.required, Validators.min(1)]),
  });
  currentUser:User | null = null;
  currentUserSub = new Subscription;

  userLists:WatchList[] = [];
  userListsSub = new Subscription;

  constructor(private listService:ListService, private userService:UserService, private http:HttpClient, private titleService:TitleService) {}

  ngOnInit(): void {
    this.currentUserSub = this.userService.currentUserBehaviorSubject.subscribe((user) => {
      this.currentUser = user;

      this.listService.getUserLists(user?.username);
    });

    this.userListsSub = this.listService.gotUserLists.subscribe((gotLists) => {
      this.userLists = gotLists;
    });

    this.setTitleToAddSub = this.titleService.titleToAddSubject.subscribe((gotTitle) => {
      this.titleToAdd = gotTitle;
    });

    // this.showAddTitleModal();
  }

  ngOnDestroy(): void {
    this.currentUserSub.unsubscribe();
    this.userListsSub.unsubscribe();
    this.setTitleToAddSub.unsubscribe();
  }

  showAddTitleModal() {
    const addTitleModal:any = new window.bootstrap.Modal(document.getElementById('addTitleModal'));

    addTitleModal.show();
  }

  onAddTitle() {
    const watchListId = this.addTitleForm.value.watch_list;

    this.http.post<WatchTitleSend>(`${environment.apiUrl}/users/${this.currentUser?.username}/lists/${watchListId}`, this.titleToAdd).subscribe();
  }
}
