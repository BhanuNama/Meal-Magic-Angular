import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./components/signup/signup').then(m => m.SignupComponent) },
  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin/dashboard', loadComponent: () => import('./components/admin/dashboard/dashboard').then(m => m.DashboardComponent) },
  { path: 'admin/dishes', loadComponent: () => import('./components/admin/admin-view-dishes/admin-view-dishes').then(m => m.AdminViewDishesComponent) },
  { path: 'admin/dishes/add', loadComponent: () => import('./components/admin/dish-form/dish-form').then(m => m.DishFormComponent) },
  { path: 'admin/dishes/edit/:id', loadComponent: () => import('./components/admin/dish-form/dish-form').then(m => m.DishFormComponent) },
  { path: 'admin/orders', loadComponent: () => import('./components/admin/order-placed/order-placed').then(m => m.OrderPlacedComponent) },
  { path: 'admin/reviews', loadComponent: () => import('./components/admin/admin-view-reviews/admin-view-reviews').then(m => m.AdminViewReviewsComponent) },
  { path: 'user', loadComponent: () => import('./components/user/user-view-dishes/user-view-dishes').then(m => m.UserViewDishesComponent) },
  { path: '**', redirectTo: '/login' }
];
