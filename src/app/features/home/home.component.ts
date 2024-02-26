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
    this.tmdbService.getMoviesNowPlaying().subscribe({
      next: (response:any) => {
        console.log(response);
      },
      error: (error:any) => {
        console.error(error);
      }
    });
  }
}
