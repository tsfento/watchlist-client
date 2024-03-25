import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'welcome',
    loadComponent: () => import('./features/auth/login/login.component').then((c) => c.LoginComponent),
    // canActivate: [noAuthGuard]
  },
  {
    path: 'lists',
    loadComponent: () => import('./features/lists/lists.component').then((c) => c.ListsComponent),
  },
  {
    path: 'search',
    loadComponent: () => import('./features/search/search.component').then((c) => c.SearchComponent),
    canActivate: [authGuard]
  },
  {
    path: 'history',
    loadComponent: () => import('./features/watch-dates/watch-dates.component').then((c) => c.WatchDatesComponent),
    canActivate: [authGuard]
  },
];
