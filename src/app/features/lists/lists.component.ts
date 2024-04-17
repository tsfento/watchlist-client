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
import { UserWatchTitle } from '../../shared/models/user-watch-title';
import { TmdbMovie } from '../../shared/models/tmdbmovie';

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
  titles:WatchTitle[] = [];
  titlesBeforeSearching:WatchTitle[] = [];
  noMoreTitles:boolean = false;
  isSearching:boolean = false;
  searchValue:string = '';
  searchPageNum:number = 1;
  noMoreResults = true;
  listType:string = '';
  isLoading:boolean = false;
  listTitleError:string = '';
  gotListErrorSub = new Subscription;

  gotAllListsSub = new Subscription;
  gotUserListsSub = new Subscription;
  gotFollowedListsSub = new Subscription;
  gotTitlesSub = new Subscription;

  constructor(private listService:ListService, public titleService:TitleService, private userService:UserService) {}

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (!this.isViewingTitles) {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !this.isLoading) {
        this.isLoading = true;
        this.loadNextPageLists();
      }
    } else if (this.isViewingTitles) {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !this.isLoading && !this.isSearching) {
        this.isLoading = true;
        this.loadNextPageTitles();
      } else if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !this.isLoading && this.isSearching && !this.noMoreResults) {
        this.isLoading = true;
        this.loadNextPageSearchTitles();
      }
    }
  }

  ngOnInit(): void {
    this.listService.getAllLists();

    this.currentUserSub = this.userService.currentUserBehaviorSubject.subscribe((user) => {
      this.currentUser = user;

      if (this.currentUser !== null) {
        this.listService.getUserLists(this.currentUser!.username);
        this.listService.getFollowedLists(this.currentUser!.username);
        this.onToggle('user');
      } else {
        // this.listService.getAllLists();
        this.onToggle('all');
      }
    });

    this.gotAllListsSub = this.listService.gotAllLists.subscribe((gotLists) => {
      this.allLists = gotLists;

      if (this.listType === 'all') {
        this.displayLists = this.allLists;
      }
    });

    this.gotUserListsSub = this.listService.gotUserLists.subscribe((gotLists) => {
      this.userLists = gotLists;

      if (this.listType === 'user') {
        this.displayLists = this.userLists;
      }
    });

    this.gotFollowedListsSub = this.listService.gotFollowedLists.subscribe((gotLists) => {
      this.followedLists = gotLists;

      // if (this.listType === 'follow') {
      //   this.displayLists = this.followedLists;
      // }
    });

    this.gotTitlesSub = this.titleService.gotListTitles.subscribe((gotTitles) => {
      this.titles = gotTitles;
      // console.log(this.titles);
      // this.isLoading = false;
    });

    this.gotListErrorSub = this.listService.listErrorSubject.subscribe((error) => {
      if (error !== '') {
        this.listTitleError = 'List ' + error;
        setTimeout(() => {
          this.listTitleError = '';
        }, 2000);
      }
    });
  }

  ngOnDestroy(): void {
    this.titleService.resetTitles();
    this.listService.resetAllLists();
    this.listService.resetUserLists();
    this.listService.resetFollowedLists();
    this.currentUserSub.unsubscribe();
    this.gotAllListsSub.unsubscribe();
    this.gotUserListsSub.unsubscribe();
    this.gotFollowedListsSub.unsubscribe();
    this.gotTitlesSub.unsubscribe();
  }

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // return true;
    // return false;
  }

  createNewList() {
    if (this.newListForm.valid) {
      this.listService.createList(this.currentUser!.username, this.newListForm.value);
      this.onToggle('user');
      this.newListForm.reset({private: false});
    }
  }

  followList(listId:number) {
    this.listService.followList(this.currentUser!.username, listId);
  }

  unfollowList(listId:number) {
    this.listService.unfollowList(this.currentUser!.username, listId);
  }

  checkIfUserList(listId:number) {
    return this.userLists.some(l => l.id === listId);
  }

  checkIfFollowing(listId:number) {
    return this.followedLists.some(l => l.id === listId);
  }

  onToggle(input:string) {
    if (input === 'all') {
      this.listType = 'all';
      this.displayLists = this.allLists;
    }

    if (input === 'user') {
      this.listType = 'user';
      this.displayLists = this.userLists;
    }

    if (input === 'follow') {
      this.listType = 'follow';
      this.displayLists = this.followedLists;
    }
  }

  showTitles(listId:number, username:string) {
    this.isSearching = false;
    this.isLoading = true;
    this.titles = [];
    this.titleService.getTitles(listId, username);

    this.isViewingTitles = true;
    this.displayLists = [];
    this.listViewingId = listId;
    this.listViewingUsername = username;
    this.isLoading = false;
  }

  closeTitles(searchInput:HTMLInputElement) {
    this.isSearching = false;
    searchInput.value = '';
    this.titleService.resetTitles();
    switch (this.listType) {
      case 'all':
        this.allLists = [];
        this.listService.resetAllLists();
        this.listService.getAllLists();

        this.onToggle('all');
        break;
      case 'user':
        this.userLists = [];
        this.listService.resetUserLists();
        this.listService.getUserLists(this.currentUser!.username);

        this.onToggle('user');
        break;
      case 'follow':
        this.onToggle('follow');
        break;
    }
    this.isViewingTitles = false;
  }

  searchTitles(searchInput:HTMLInputElement) {
    this.titlesBeforeSearching = this.titles;
    this.titles = [];
    this.isSearching = true;
    this.searchValue = searchInput.value;
    this.listService.searchTitlesInList(this.listViewingId, this.searchValue, 1).subscribe({
      next: (response:(WatchTitle[])) => {
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
    this.isSearching = false;
    searchInput.value = '';
    this.titles = this.titlesBeforeSearching;
  }

  randomTitle(searchInput:HTMLInputElement) {
    searchInput.value = '';
    this.isSearching = true;
    this.listService.getRandomTitleFromList(this.listViewingId).subscribe({
      next: (response:WatchTitle) => {
        if (this.titlesBeforeSearching.length === 0) {
          this.titlesBeforeSearching = this.titles;
        }
        this.titles = [response];
      },
      error: (error:any) => {
        console.log(error);
      }
    })
  }

  getTmdbIdFromUserWatchTitles(tmdbId:number): UserWatchTitle | undefined {
    if (this.currentUser !== null && this.currentUser.user_watch_titles.length > 0) {
      const userWatchTitle = this.currentUser.user_watch_titles.find(u => u.watch_title.tmdb_id === tmdbId);

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

  setListPrivacy(listId:number) {
    const privacyElement:HTMLSpanElement | null = document.getElementById(`privacy${listId}`);

    this.listService.setListPrivacy(this.currentUser!.username, listId).subscribe({
      next: (response:WatchList) => {
        if (response.private === true) {
          privacyElement!.innerText = 'visibility_off';
        } else if (response.private === false) {
          privacyElement!.innerText = 'visibility';
        }
      },
      error: (error:any) => {
        console.log(error);
      }
    });
  }

  checkListPrivacy(listIndex:number) {
    return this.displayLists[listIndex].private;
  }

  deleteList(listId:number, listIndex:number, username:string) {
    this.listService.setListIdToDelete(listId, listIndex, username);
  }

  deleteTitle(tmdbId:number) {
    this.titleService.deleteTitle(this.currentUser!.username, this.listViewingId, tmdbId);
  }

  loadNextPageLists() {
    // this.isLoading = true;

    switch (this.listType) {
      case 'all':
        this.listService.getAllLists();
        break;
      case 'user':
        this.listService.getUserLists(this.currentUser!.username);
        break;
      case 'follow':
        this.listService.getFollowedLists(this.currentUser!.username);
        break;
    }

    this.isLoading = false;
  }

  loadNextPageTitles() {
    this.titleService.getTitles(this.listViewingId, this.listViewingUsername);
    this.isLoading = false;
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
        this.isLoading = false;
      },
      error: (error:any) => {
        console.log(error);
      }
    });
    this.searchPageNum++;
  }
}
