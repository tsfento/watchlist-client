import { Component, OnInit } from '@angular/core';
import { TmdbService } from '../../core/services/tmdb.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  constructor(private tmdbService:TmdbService) {}

  ngOnInit(): void {
    this.tmdbService.getNowPlayingMovies().subscribe({
      next: (response:any) => {
        console.log('Now Playing Movies:', response);
      },
      error: (error:any) => {
        console.error(error);
      }
    });

    this.tmdbService.getPopularMovies().subscribe({
      next: (response:any) => {
        console.log('Popular Movies:', response);
      },
      error: (error:any) => {
        console.error(error);
      }
    });

    this.tmdbService.getPopularTV().subscribe({
      next: (response:any) => {
        console.log('Popular TV:', response);
      },
      error: (error:any) => {
        console.error(error);
      }
    });

    this.tmdbService.getTopRatedTV().subscribe({
      next: (response:any) => {
        console.log('Top Rated TV:', response);
      },
      error: (error:any) => {
        console.error(error);
      }
    });
  }
}
