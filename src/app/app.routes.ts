import { Routes } from '@angular/router';

export const routes: Routes = [
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
