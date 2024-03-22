import { Component } from '@angular/core';
import { ListService } from '../../core/services/list.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-delete-list-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-list-modal.component.html',
  styleUrl: './delete-list-modal.component.scss'
})
export class DeleteListModalComponent {
  constructor(private listService:ListService) {}

  deleteList() {
    this.listService.deleteList();
  }
}
