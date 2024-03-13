import { Component, OnDestroy, OnInit } from '@angular/core';
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
  poster_url:string = 'https://image.tmdb.org/t/p/w154'

  currentUser:User | null = null;
  currentUserSub = new Subscription;

  searchValue:string = '';
  searchSub = new Subscription;

  searchResults:TmdbMovie[] = [];
  searchResultsSub = new Subscription;

  constructor(private tmdbService:TmdbService, public titleService:TitleService, private userService:UserService) {}

  ngOnInit(): void {
    this.currentUserSub = this.userService.currentUserBehaviorSubject.subscribe((user) => {
      this.currentUser = user;
    });

    this.searchSub = this.tmdbService.searchSubject.subscribe((search) => {
      this.searchValue = search;
      this.tmdbService.getSearchResults(this.searchValue);
    });

    this.searchResultsSub = this.tmdbService.gotSearchResults.subscribe((results) => {
      this.searchResults = results;
      console.log(this.searchResults);
    });
  }

  ngOnDestroy(): void {
    this.currentUserSub.unsubscribe();
    this.searchSub.unsubscribe();
    this.searchResultsSub.unsubscribe();
  }

  getTmdbIdFromUserWatchTitles(tmdbId:number): UserWatchTitle | undefined {
    const userWatchTitle = this.currentUser?.user_watch_titles.find(t => t.watch_title.tmdb_id === tmdbId);

    return userWatchTitle;
  }

  filterResults(type:string, lang:string) {
    this.tmdbService.getSearchResults(this.searchValue, type, lang);
  }
}
