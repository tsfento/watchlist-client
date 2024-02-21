import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/lists/lists.component').then((c) => c.ListsComponent),
    // canActivate: [authGuard]
  },
];
