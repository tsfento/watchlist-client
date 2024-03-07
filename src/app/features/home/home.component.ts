import { Component, OnDestroy, OnInit } from '@angular/core';
import { TmdbService } from '../../core/services/tmdb.service';
import { TmdbMovie } from '../../shared/models/tmdbmovie';
import { TmdbResponse } from '../../shared/models/tmdbresponse';
import { CommonModule } from '@angular/common';
import { AddTitleModalComponent } from '../add-title-modal/add-title-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [AddTitleModalComponent]
})
export class HomeComponent implements OnInit, OnDestroy {
  poster_url:string = 'https://image.tmdb.org/t/p/w154'

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

  constructor(private tmdbService:TmdbService, public addTitleModal:AddTitleModalComponent) {}

  ngOnInit(): void {
    this.tmdbService.getNowPlayingMovies();
    this.tmdbService.getPopularMovies();
    this.tmdbService.getPopularTV();
    this.tmdbService.getTopRatedTV();

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
