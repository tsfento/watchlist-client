import { Component } from '@angular/core';
import { ListService } from '../../core/services/list.service';
import { LongPressDirective } from '../../shared/directives/long-press.directive';

@Component({
  selector: 'app-delete-list-modal',
  standalone: true,
  imports: [LongPressDirective],
  templateUrl: './delete-list-modal.component.html',
  styleUrl: './delete-list-modal.component.scss'
})
export class DeleteListModalComponent {
  holdCount:number = 0;

  constructor(private listService:ListService) {}

  deleteList() {
    this.holdCount = 0;
    // this.listService.deleteList();
  }

  onDown(btn:HTMLButtonElement) {
    btn.classList.add('holding');
  }

  onHold(btn:HTMLButtonElement) {
    if (this.holdCount < 25) {
      this.holdCount += 1;
    } else {
      console.log(this.holdCount);
    }
  }

  onRelease(btn:HTMLButtonElement) {
    this.holdCount = 0;
    btn.classList.remove('holding');
  }
}
