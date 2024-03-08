import { Component, ElementRef } from '@angular/core';

declare var window:any;

@Component({
  selector: 'app-add-title-modal',
  standalone: true,
  imports: [],
  templateUrl: './add-title-modal.component.html',
  styleUrl: './add-title-modal.component.scss'
})
export class AddTitleModalComponent {
  showAddTitleModal() {

  }

  // for non-bootstrap
  // openAddTitleModal() {
  //   const modal:HTMLDialogElement | null = document.querySelector('.add-title-modal');

  //   modal!.showModal();
  // }

  // closeAddTitleModal() {
  //   const modal:HTMLDialogElement | null = document.querySelector('.add-title-modal');

  //   modal!.close();
  // }

  // outsideDialog(e:MouseEvent) {
  //   const dialog:HTMLDialogElement | null = document.querySelector('.add-title-modal');
  //   const dialogDimensions = dialog!.getBoundingClientRect()
  //   if (
  //     e.clientX < dialogDimensions.left ||
  //     e.clientX > dialogDimensions.right ||
  //     e.clientY < dialogDimensions.top ||
  //     e.clientY > dialogDimensions.bottom
  //   ) {
  //     dialog!.close()
  //   }
  // }
}
