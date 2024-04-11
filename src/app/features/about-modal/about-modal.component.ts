import { Component, OnInit } from '@angular/core';

declare var window:any;

@Component({
  selector: 'app-about-modal',
  standalone: true,
  imports: [],
  templateUrl: './about-modal.component.html',
  styleUrl: './about-modal.component.scss'
})
export class AboutModalComponent implements OnInit {
  ngOnInit(): void {
    // auto-open for testing/styling
    this.showAboutModal();
  }

  // auto-open for testing/styling
  showAboutModal() {
    const aboutModal:any = new window.bootstrap.Modal(document.getElementById('aboutModal'));

    aboutModal.show();
  }
}
