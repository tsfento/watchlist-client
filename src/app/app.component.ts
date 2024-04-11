import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { AddTitleModalComponent } from './features/add-title-modal/add-title-modal.component';
import { AddWatchdateModalComponent } from './features/add-watchdate-modal/add-watchdate-modal.component';
import { DeleteListModalComponent } from './features/delete-list-modal/delete-list-modal.component';
import { AboutModalComponent } from './features/about-modal/about-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, AboutModalComponent, AddTitleModalComponent, AddWatchdateModalComponent, DeleteListModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'watchlist-client';
}
