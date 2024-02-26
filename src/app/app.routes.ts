import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'login',
    // pathMatch: 'full',
    loadComponent: () => import('./features/auth/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'lists',
    // pathMatch: 'full',
    loadComponent: () => import('./features/lists/lists.component').then((c) => c.ListsComponent),
    // canActivate: [authGuard]
  },
];
