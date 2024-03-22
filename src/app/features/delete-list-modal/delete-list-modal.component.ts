import { Component } from '@angular/core';
import { ListService } from '../../core/services/list.service';

declare var window:any;

@Component({
  selector: 'app-delete-list-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-list-modal.component.html',
  styleUrl: './delete-list-modal.component.scss'
})
export class DeleteListModalComponent {
  deleteTimeout:any;

  constructor(private listService:ListService) {}

  deleteList(btn:HTMLButtonElement) {
    this.closeDeleteListModal(btn);
    this.listService.deleteList();
    clearTimeout(this.deleteTimeout);
  }

  onDown(btn:HTMLButtonElement) {
    btn.classList.remove('released');
    btn.classList.add('holding');

    this.deleteTimeout = setTimeout(() => {
      this.deleteList(btn);
    }, 3100);
  }

  onRelease(btn:HTMLButtonElement) {
    clearTimeout(this.deleteTimeout);
    btn.classList.remove('holding');
    btn.classList.add('released');
  }

  closeDeleteListModal(btn:HTMLButtonElement) {
    const deleteListModal:any = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteListModal'));

    deleteListModal.hide();
    btn.classList.remove('holding');
    btn.classList.add('released');
  }
}
