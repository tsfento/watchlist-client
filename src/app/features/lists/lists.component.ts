import { Component, OnInit } from '@angular/core';
import { ListService } from '../../core/services/list.service';
import { WatchList } from '../../shared/models/watchlist';
import { WatchTitle } from '../../shared/models/watchtitle';
import { TitleService } from '../../core/services/title.service';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.scss'
})
export class ListsComponent implements OnInit{
  poster_url:string = 'https://image.tmdb.org/t/p/w154'
  viewingTitles:boolean = false;
  lists:WatchList[] = [];
  titles:WatchTitle[] = [];

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
          this.viewingTitles = false;
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
          this.viewingTitles = false;
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
          this.viewingTitles = false;
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
        // console.log(this.titles);
      },
      error: (error:any) => {
        console.error('Error fetching titles', error);
      }
    });

    this.viewingTitles = true;
  }

  closeTitles() {
    this.viewingTitles = false;
  }
}
