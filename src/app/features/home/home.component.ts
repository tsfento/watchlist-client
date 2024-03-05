import { Component, OnInit } from '@angular/core';
import { TmdbService } from '../../core/services/tmdb.service';
import { TmdbMovie } from '../../shared/models/tmdbmovie';
import { TmdbResponse } from '../../shared/models/tmdbresponse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  poster_url:string = 'https://image.tmdb.org/t/p/w154'

  nowPlayingMovies:TmdbMovie[] = [];
  nowPlayingMovieIndex:number = 0;
  nowPlayingDisplay:TmdbMovie = new TmdbMovie('');

  popularMovies:TmdbMovie[] = [];
  popularMovieIndex:number = 0;
  popularMovieDisplay:TmdbMovie = new TmdbMovie('');

  popularTV:TmdbMovie[] = [];
  popularTVIndex:number = 0;
  popularTVDisplay:TmdbMovie = new TmdbMovie('');

  topRatedTV:TmdbMovie[] = [];
  topRatedTVIndex:number = 0;
  topRatedTVDisplay:TmdbMovie = new TmdbMovie('');

  constructor(private tmdbService:TmdbService) {}

  ngOnInit(): void {
    this.tmdbService.getNowPlayingMovies().subscribe({
      next: (response:TmdbResponse) => {
        this.nowPlayingMovies = response.results;
      },
      error: (error:any) => {
        console.error(error);
      }
    });

    this.tmdbService.getPopularMovies().subscribe({
      next: (response:TmdbResponse) => {
        this.popularMovies = response.results;
      },
      error: (error:any) => {
        console.error(error);
      }
    });

    this.tmdbService.getPopularTV().subscribe({
      next: (response:TmdbResponse) => {
        this.popularTV = response.results;
      },
      error: (error:any) => {
        console.error(error);
      }
    });

    this.tmdbService.getTopRatedTV().subscribe({
      next: (response:TmdbResponse) => {
        this.topRatedTV = response.results;
      },
      error: (error:any) => {
        console.error(error);
      }
    });
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

  titleDetails(tmdbId:number, contentType:string) {
    this.tmdbService.getTitleDetails(tmdbId, contentType).subscribe({
      next: (response:TmdbMovie) => {
      },
      error: (error:any) => {
        console.error(error);
      }
    });
  }

  onWheel(event:WheelEvent, drawer:HTMLElement) {
    event.preventDefault();
    drawer.scrollLeft += event.deltaY;
  }
}
