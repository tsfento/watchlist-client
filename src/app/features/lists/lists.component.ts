import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ListService } from '../../core/services/list.service';
import { WatchList } from '../../shared/models/watchlist';
import { WatchTitle } from '../../shared/models/watchtitle';
import { TitleService } from '../../core/services/title.service';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { User } from '../../shared/models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, FormsModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.scss'
})
export class ListsComponent implements OnInit, OnDestroy {
  currentUser:User | null = null;
  currentUserSub = new Subscription;
  newListForm:FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    private: new FormControl(false, Validators.required)
  });
  poster_url:string = 'https://image.tmdb.org/t/p/w154'
  isViewingTitles:boolean = false;
  listViewingId:number = 0;
  listViewingUsername:string = '';
  isUserLists:boolean = true;
  displayLists:WatchList[] = [];
  allLists:WatchList[] = [];
  userLists:WatchList[] = [];
  followedLists:WatchList[] = [];
  listsDone:boolean = false;
  titles:WatchTitle[] = [];
  noMoreTitles:boolean = false;
  isSearching:boolean = false;
  searchValue:string = '';
  searchPageNum:number = 1;
  noMoreResults = true;
  listType:string = '';
  isLoading:boolean = false;
  listPageNum:number = 1;
  titlePageNum:number = 1;
  pageX:number = 0;
  pageY:number = 0;

  gotAllListsSub = new Subscription;
  gotUserListsSub = new Subscription;
  gotFollowedListsSub = new Subscription;
  gotTitlesSub = new Subscription;

  constructor(private listService:ListService, private titleService:TitleService, private userService:UserService) {}

  @HostListener('window:scroll',['$event'])
  onWindowScroll(){
    // console.log('Titles: ', this.noMoreTitles);
    // console.log('Results: ', this.noMoreResults);

    if (!this.isViewingTitles) {
      if(window.innerHeight+window.scrollY>=document.body.offsetHeight&&!this.isLoading&&!this.listsDone){
        // console.log(event);
        this.loadNextPageLists();
      }
    } else if (this.isViewingTitles) {
      if(window.innerHeight+window.scrollY>=document.body.offsetHeight&&!this.isLoading&&!this.noMoreTitles){
        this.loadNextPageTitles();
      } else if(window.innerHeight+window.scrollY>=document.body.offsetHeight&&!this.isLoading&&this.isSearching&&!this.noMoreResults){
        this.loadNextPageSearchTitles();
      }
    }
  }

  ngOnInit(): void {
    this.listPageNum = 1;
    this.titlePageNum = 1;

    this.currentUserSub = this.userService.currentUserBehaviorSubject.subscribe((user) => {
      this.currentUser = user;

      // if (this.currentUser !== null) {
      //   this.listType = 'all';
      // } else {
      //   this.listType = 'user';
      // }

      // if (this.currentUser !== null) {
      //   this.listService.getUserLists(this.currentUser!.username, this.listPageNum);
      //   this.listService.getFollowedLists(this.currentUser!.username, this.listPageNum);
      // }
      // this.listService.getAllLists(this.listPageNum);
    });

    this.gotAllListsSub = this.listService.gotAllLists.subscribe((gotLists) => {
      if (gotLists.length !== 0) {
        this.allLists = [...this.allLists, ...gotLists];
        this.displayLists = this.allLists;
        this.listsDone = false;
      } else {
        this.listsDone = true;
      }

      if (this.currentUser === null) {
        this.listType = 'all';
        this.displayLists = this.allLists;
      }
    });

    this.gotUserListsSub = this.listService.gotUserLists.subscribe((gotLists) => {
      if (gotLists.length !== 0) {
          this.userLists = [...this.userLists, ...gotLists];
          this.listsDone = false;
      } else {
        this.listsDone = true;
      }

      if (this.currentUser !== null) {
        this.listType = 'user';
        this.displayLists = this.userLists;
      }
    });

    this.gotFollowedListsSub = this.listService.gotFollowedLists.subscribe((gotLists) => {
      if (gotLists.length !== 0) {
        this.followedLists = [...this.followedLists, ...gotLists];
        this.listsDone = false;
        if (this.listType === 'follow') {
          this.displayLists = this.followedLists;
        }
      } else {
        this.listsDone = true;
      }
    });

    this.gotTitlesSub = this.titleService.gotListTitles.subscribe((gotTitles) => {
      if (gotTitles.length === 0) {
        this.noMoreTitles = true;
      } else if (gotTitles.length < 20) {
        this.noMoreTitles = true;
        this.titles = [...this.titles, ...gotTitles];
      } else {
        this.noMoreTitles = false;
        this.titles = [...this.titles, ...gotTitles];
      }
    });
  }

  ngOnDestroy(): void {
    this.currentUserSub.unsubscribe();
    this.gotAllListsSub.unsubscribe();
    this.gotUserListsSub.unsubscribe();
    this.gotFollowedListsSub.unsubscribe();
    this.gotTitlesSub.unsubscribe();
  }

  createNewList() {
    if (this.newListForm.valid) {
      this.listService.createList(this.currentUser!.username, this.newListForm.value);
      this.onToggle('user');
      this.newListForm.reset({private: false});
    }
  }

  followList(listId:number) {
    this.listService.followList(this.currentUser!.username, listId, this.listPageNum);
  }

  unfollowList(listId:number) {
    this.listService.unfollowList(this.currentUser!.username, listId, this.listPageNum);
  }

  checkIfUserList(listId:number) {
    return this.userLists.some(l => l.id === listId);
  }

  checkIfFollowing(listId:number) {
    return this.followedLists.some(l => l.id === listId);
  }

  onToggle(input:string) {
    if (input === 'all') {
      this.allLists = [];
      this.listsDone = false;
      this.listType = 'all';
      this.listPageNum = 1;
      this.isLoading = true;
      this.listService.getAllLists(this.listPageNum);
      this.displayLists = this.allLists;
      this.isLoading = false;
    }

    if (input === 'user') {
      this.userLists = [];
      this.listsDone = false;
      this.listType = 'user';
      this.listPageNum = 1;
      this.isLoading = true;
      this.listService.getUserLists(this.currentUser!.username, this.listPageNum);
      this.displayLists = this.userLists;
      this.isLoading = false;
    }

    if (input === 'follow') {
      this.followedLists = [];
      this.listsDone = false;
      this.listType = 'follow';
      this.listPageNum = 1;
      this.isLoading = true;
      this.listService.getFollowedLists(this.currentUser!.username, this.listPageNum);
      this.displayLists = this.followedLists;
      this.isLoading = false;
    }
  }

  showTitles(listId:number, username:string) {
    this.titles = [];
    this.titleService.getTitles(listId, username, this.titlePageNum);

    this.isViewingTitles = true;
    this.displayLists = [];
    this.listViewingId = listId;
    this.listViewingUsername = username;
  }

  closeTitles(searchInput:HTMLInputElement) {
    this.isSearching = false;
    this.noMoreTitles = false;
    this.noMoreResults = false;
    searchInput.value = '';
    this.titles = [];
    this.listPageNum = 1;
    this.titlePageNum = 1;
    switch (this.listType) {
      case 'all':
        this.onToggle('all');
        break;
      case 'user':
        this.onToggle('user');
        break;
      case 'follow':
        this.onToggle('follow');
        break;
    }
    this.isViewingTitles = false;
  }

  searchTitles(searchInput:HTMLInputElement) {
    this.titles = [];
    this.listPageNum = 1;
    this.isSearching = true;
    this.searchValue = searchInput.value;
    this.listService.searchTitlesInList(this.listViewingId, this.searchValue, 1).subscribe({
      next: (response:(WatchTitle[])) => {
        // TODO flash no results
        if (response.length === 0) {
          this.noMoreResults = true;
        } else if (response.length < 20) {
          this.noMoreResults = true;
          this.titles = response;
        } else {
          this.noMoreResults = false;
          this.titles = response;
        }
      },
      error: (error:any) => {
        console.log(error);
      }
    });
  }

  resetSearch(searchInput:HTMLInputElement) {
    this.listPageNum = 1;
    this.titlePageNum = 1;
    this.isSearching = false;
    searchInput.value = '';
    this.titles = [];
    this.titleService.getTitles(this.listViewingId, this.listViewingUsername, 1);
  }

  randomTitle(searchInput:HTMLInputElement) {
    searchInput.value = '';
    this.listService.getRandomTitleFromList(this.listViewingId).subscribe({
      next: (response:WatchTitle) => {
        this.titles = [response];
      },
      error: (error:any) => {
        console.log(error);
      }
    })
  }

  deleteList(listId:number, listIndex:number, username:string) {
    // this.newListForm.reset();
    this.listService.setListIdToDelete(listId, listIndex, username);
  }

  deleteTitle(tmdbId:number) {
    this.titleService.deleteTitle(this.currentUser!.username, this.listViewingId, tmdbId);
  }

  loadNextPageLists() {
    this.isLoading = true;

    switch (this.listType) {
      case 'all':
        this.listService.getAllLists(this.listPageNum + 1);
        break;
      case 'user':
        this.listService.getUserLists(this.currentUser!.username, this.listPageNum + 1);
        break;
      case 'follow':
        this.listService.getFollowedLists(this.currentUser!.username, this.listPageNum + 1);
        break;
    }

    this.listPageNum++;
    this.isLoading = false;
  }

  loadNextPageTitles() {
    this.titleService.getTitles(this.listViewingId, this.listViewingUsername, this.titlePageNum + 1);
    this.titlePageNum++;
  }

  loadNextPageSearchTitles() {
    this.isSearching = true;
    this.listService.searchTitlesInList(this.listViewingId, this.searchValue, this.searchPageNum + 1).subscribe({
      next: (response:(WatchTitle[])) => {
        if (response.length === 0) {
          this.noMoreResults = true;
        } else if (response.length < 20) {
          this.noMoreResults = true;
          this.titles = [...this.titles, ...response];
        } else {
          this.noMoreResults = false;
          this.titles = [...this.titles, ...response];
        }
      },
      error: (error:any) => {
        console.log(error);
      }
    });
    this.searchPageNum++;
  }
}
