import { Component, OnInit } from '@angular/core';
import { TmdbService } from '../../core/services/tmdb.service';
import { TmdbMovie } from '../../shared/models/tmdbmovie';
import { TmdbResponse } from '../../shared/models/tmdbresponse';
import { CommonModule } from '@angular/common';
import { AddTitleModalComponent } from '../add-title-modal/add-title-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [AddTitleModalComponent]
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

  constructor(private tmdbService:TmdbService, public addTitleModal:AddTitleModalComponent) {}

  ngOnInit(): void {
    this.tmdbService.getNowPlayingMovies().subscribe({
      next: (response:TmdbResponse) => {
        const tempNowPlayingMovies = response.results;

        tempNowPlayingMovies.forEach((m:TmdbMovie) => {
          this.titleDetails(m, 'movie');
          console.log(m.runtime);
        });
        this.nowPlayingMovies = tempNowPlayingMovies;
      },
      error: (error:any) => {
        console.error(error);
      }
    });

    this.tmdbService.getPopularMovies().subscribe({
      next: (response:TmdbResponse) => {
        const tempPopularMovies = response.results;

        tempPopularMovies.forEach((m:TmdbMovie) => {
          this.titleDetails(m, 'movie');
          console.log(m.runtime);
        });
        this.popularMovies = tempPopularMovies;
      },
      error: (error:any) => {
        console.error(error);
      }
    });

    this.tmdbService.getPopularTV().subscribe({
      next: (response:TmdbResponse) => {
        const tempPopularTV = response.results;

        // tempPopularTV.forEach((m:TmdbMovie) => {
        //   this.titleDetails(m, 'tv');
        // });
        this.popularTV = tempPopularTV;
      },
      error: (error:any) => {
        console.error(error);
      }
    });

    this.tmdbService.getTopRatedTV().subscribe({
      next: (response:TmdbResponse) => {
        const tempTopRatedTV = response.results;

        // tempTopRatedTV.forEach((t:TmdbMovie) => {
        //   this.titleDetails(t, 'tv');
        // });
        this.topRatedTV = tempTopRatedTV;
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
        this.titleDetails(this.nowPlayingMovies[this.nowPlayingMovieIndex], 'movie');
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

  titleDetails(tmdbTitle:TmdbMovie, contentType:string): TmdbMovie {
    this.tmdbService.getTitleDetails(tmdbTitle.id, contentType).subscribe({
      next: (response:TmdbMovie) => {
        tmdbTitle.runtime = response.runtime;
      },
      error: (error:any) => {
        console.error(error);
      }
    });

    return tmdbTitle;
  }

  onWheel(event:WheelEvent, drawer:HTMLElement) {
    event.preventDefault();
    drawer.scrollLeft += event.deltaY;
  }
}
