import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ShellComponent } from './layout/shell.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'menu',
        loadComponent: () => import('./features/menu/menu.component').then(m => m.MenuComponent),
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent),
      },
      {
        path: 'chefs',
        loadComponent: () => import('./features/chefs/chefs.component').then(m => m.ChefsComponent),
      },
      {
        path: 'blog',
        loadComponent: () => import('./features/blog/blog.component').then(m => m.BlogComponent),
      },
      {
        path: 'subscriptions',
        loadComponent: () => import('./features/subscriptions/subscriptions.component').then(m => m.SubscriptionsComponent),
      },
      {
        path: 'testimonials',
        loadComponent: () => import('./features/testimonials/testimonials.component').then(m => m.TestimonialsComponent),
      },
      {
        path: 'stats',
        loadComponent: () => import('./features/stats/stats.component').then(m => m.StatsComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
