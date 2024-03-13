import { Component, OnDestroy, OnInit } from '@angular/core';
import { TmdbService } from '../../core/services/tmdb.service';
import { Subscription } from 'rxjs';
import { TmdbMovie } from '../../shared/models/tmdbmovie';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit, OnDestroy {
  poster_url:string = 'https://image.tmdb.org/t/p/w154'
  searchValue:string = '';
  searchSub = new Subscription;

  searchResults:TmdbMovie[] = [];
  searchResultsSub = new Subscription;

  constructor(private tmdbService:TmdbService) {}

  ngOnInit(): void {
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
    this.searchResultsSub.unsubscribe();
  }
}
