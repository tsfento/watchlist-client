import { Component, OnInit } from '@angular/core';
import { ListService } from '../../core/services/list.service';
import { List } from '../../shared/models/list';

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
  lists:List[] = [];

  constructor(private listService:ListService) {}

  ngOnInit(): void {
    this.listService.getUserLists().subscribe({
      next: (lists:List[]) => {
        this.lists = lists;
      },
      error: (error:any) => {
        console.error('Error fetching lists', error);
      }
    });
  }

  onToggle(input:string) {
    this.viewingTitles = false;

    if (input === 'user') {
      this.listService.getUserLists().subscribe({
        next: (lists:List[]) => {
          this.lists = lists;
        },
        error: (error:any) => {
          console.error('Error fetching lists', error);
        }
      });
    }

    if (input === 'follow') {
      this.listService.getFollowedLists().subscribe({
        next: (lists:List[]) => {
          this.lists = lists;
        },
        error: (error:any) => {
          console.error('Error fetching lists', error);
        }
      });
    }

    if (input === 'all') {
      this.listService.getAllLists().subscribe({
        next: (lists:List[]) => {
          this.lists = lists;
        },
        error: (error:any) => {
          console.error('Error fetching lists', error);
        }
      });
    }
  }

  showTitles(id:number) {
    console.log(id);
    this.viewingTitles = true;
  }

  closeTitles() {
    this.viewingTitles = false;
  }
}
