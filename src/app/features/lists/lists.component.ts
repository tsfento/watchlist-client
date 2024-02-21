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
  lists:List[] = [];

  constructor(private listService:ListService) {}

  ngOnInit(): void {
    this.listService.getAllLists().subscribe({
      next: (lists:List[]) => {
        this.lists = lists;
        // console.log(this.lists);
      },
      error: (error:any) => {
        console.error('Error fetching lists', error);
      }
    });
  }

  onToggle(input:string) {
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

    if (input === 'all') {
      this.listService.getAllLists().subscribe({
        next: (lists:List[]) => {
          this.lists = lists;
          // console.log(this.lists);
        },
        error: (error:any) => {
          console.error('Error fetching lists', error);
        }
      });
    }
  }
}
