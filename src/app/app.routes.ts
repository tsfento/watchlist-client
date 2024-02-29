import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'welcome',
    loadComponent: () => import('./features/auth/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'lists',
    loadComponent: () => import('./features/lists/lists.component').then((c) => c.ListsComponent),
  },
];
