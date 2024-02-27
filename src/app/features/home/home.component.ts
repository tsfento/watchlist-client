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
        console.log('Now Playing:', response);
      },
      error: (error:any) => {
        console.error(error);
      }
    });

    this.tmdbService.getPopularMovies().subscribe({
      next: (response:any) => {
        console.log('Popular:', response);
      },
      error: (error:any) => {
        console.error(error);
      }
    });
  }
}
