import { Component, OnDestroy, OnInit } from '@angular/core';
import { TmdbService } from '../../core/services/tmdb.service';
import { TmdbMovie } from '../../shared/models/tmdbmovie';
import { TmdbResponse } from '../../shared/models/tmdbresponse';
import { CommonModule } from '@angular/common';
import { AddTitleModalComponent } from '../add-title-modal/add-title-modal.component';
import { Subscription } from 'rxjs';
import { TitleService } from '../../core/services/title.service';
import { UserWatchTitle } from '../../shared/models/user-watch-title';
import { UserService } from '../../core/services/user.service';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: []
})
export class HomeComponent implements OnInit, OnDestroy {
  med_poster_url:string = 'https://image.tmdb.org/t/p/w300';
  small_poster_url:string = 'https://image.tmdb.org/t/p/w154'

  currentUser:User | null = null;
  currentUserSub = new Subscription;

  userWatchTitles:UserWatchTitle[] = [];
  gotUserWatchTitlesSub = new Subscription;

  nowPlayingMovies:TmdbMovie[] = [];
  nowPlayingMovieIndex:number = 0;
  gotNowPlayingMoviesSub = new Subscription;

  popularMovies:TmdbMovie[] = [];
  popularMovieIndex:number = 0;
  gotPopularMoviesSub = new Subscription;

  popularTV:TmdbMovie[] = [];
  popularTVIndex:number = 0;
  gotPopularTVSub = new Subscription;

  topRatedTV:TmdbMovie[] = [];
  topRatedTVIndex:number = 0;
  gotTopRatedTVSub = new Subscription;

  constructor(private tmdbService:TmdbService, public titleService:TitleService, private userService:UserService) {}

  ngOnInit(): void {
    this.tmdbService.getNowPlayingMovies();
    this.tmdbService.getPopularMovies();
    this.tmdbService.getPopularTV();
    this.tmdbService.getTopRatedTV();

    this.currentUserSub = this.userService.currentUserBehaviorSubject.subscribe((user) => {
      this.currentUser = user;

      if (this.currentUser !== null) {
        this.titleService.getUserWatchTitles(this.currentUser.username);
      }
    });

    this.gotUserWatchTitlesSub = this.titleService.gotUserWatchTitles.subscribe((gotUserTitles) => {
      this.userWatchTitles = gotUserTitles;
      console.log(this.userWatchTitles);
    });

    this.gotNowPlayingMoviesSub = this.tmdbService.gotNowPlayingMovies.subscribe((gotTitles) => {
      this.nowPlayingMovies = gotTitles;
    });

    this.gotPopularMoviesSub = this.tmdbService.gotPopularMovies.subscribe((gotTitles) => {
      this.popularMovies = gotTitles;
    });

    this.gotPopularTVSub = this.tmdbService.gotPopularTV.subscribe((gotTitles) => {
      this.popularTV = gotTitles;
    });

    this.gotTopRatedTVSub = this.tmdbService.gotTopRatedTv.subscribe((gotTitles) => {
      this.topRatedTV = gotTitles;
    });
  }

  ngOnDestroy(): void {
    this.gotUserWatchTitlesSub.unsubscribe();
    this.gotNowPlayingMoviesSub.unsubscribe();
    this.gotPopularMoviesSub.unsubscribe();
    this.gotPopularTVSub.unsubscribe();
    this.gotTopRatedTVSub.unsubscribe();
  }

  changeIndex(type:string, index:number) {
    switch(type) {
      case 'nPMovie':
        this.nowPlayingMovieIndex = index;
        break;
      case 'popMovie':
        this.popularMovieIndex = index;
        break;
      case 'popTV':
        this.popularTVIndex = index;
        break;
      case 'topTV':
        this.topRatedTVIndex = index;
        break;
    }
  }

  onWheel(event:WheelEvent, drawer:HTMLElement) {
    event.preventDefault();
    drawer.scrollLeft += event.deltaY;
  }
}
