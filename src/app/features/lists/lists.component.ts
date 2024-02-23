import { Component, OnInit } from '@angular/core';
import { ListService } from '../../core/services/list.service';
import { WatchList } from '../../shared/models/watchlist';
import { WatchTitle } from '../../shared/models/watchtitle';
import { TitleService } from '../../core/services/title.service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.scss'
})
export class ListsComponent implements OnInit{
  poster_url:string = 'https://image.tmdb.org/t/p/w154'
  isViewingTitles:boolean = false;
  lists:WatchList[] = [];
  titles:WatchTitle[] = [];
  beforeFilteredTitles:WatchTitle[] = [];
  searchQuery: string = '';

  constructor(private listService:ListService, private titleService:TitleService) {}

  ngOnInit(): void {
    this.listService.getUserLists().subscribe({
      next: (lists:WatchList[]) => {
        this.lists = lists;
      },
      error: (error:any) => {
        console.error('Error fetching lists', error);
      }
    });
  }

  onToggle(input:string) {
    if (input === 'user') {
      this.listService.getUserLists().subscribe({
        next: (lists:WatchList[]) => {
          this.lists = lists;
          this.isViewingTitles = false;
        },
        error: (error:any) => {
          console.error('Error fetching lists', error);
        }
      });
    }

    if (input === 'follow') {
      this.listService.getFollowedLists().subscribe({
        next: (lists:WatchList[]) => {
          this.lists = lists;
          this.beforeFilteredTitles = this.titles;
          this.isViewingTitles = false;
        },
        error: (error:any) => {
          console.error('Error fetching lists', error);
        }
      });
    }

    if (input === 'all') {
      this.listService.getAllLists().subscribe({
        next: (lists:WatchList[]) => {
          this.lists = lists;
          this.beforeFilteredTitles = this.titles;
          this.isViewingTitles = false;
        },
        error: (error:any) => {
          console.error('Error fetching lists', error);
        }
      });
    }
  }

  showTitles(id:number, username:string) {
    this.titleService.getTitles(id, username).subscribe({
      next: (titles:WatchTitle[]) => {
        this.titles = titles;
        this.beforeFilteredTitles = this.titles;
        // console.log(this.titles);
      },
      error: (error:any) => {
        console.error('Error fetching titles', error);
      }
    });

    this.isViewingTitles = true;
  }

  closeTitles() {
    this.isViewingTitles = false;
  }

  // Working on filtering titles by search
  searchTitles() {
    this.beforeFilteredTitles = this.titles;

    this.titles.filter(title =>
      title.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      title.release_date.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      title.overview.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      title.runtime.toString().includes(this.searchQuery.toLowerCase())
    );
  }

  onSearchInput() {
    if (this.searchQuery === '') {
      this.resetSearch();
    }
  }

  resetSearch() {
    this.titles = this.beforeFilteredTitles;
  }
}
