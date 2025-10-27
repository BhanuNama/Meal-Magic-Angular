import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./components/signup/signup').then(m => m.SignupComponent) },
  { path: 'forgot-password', loadComponent: () => import('./components/forgot-password/forgot-password').then(m => m.ForgotPassword) },
  { path: 'error', loadComponent: () => import('./components/error-page/error-page').then(m => m.ErrorPage) },
  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin/dashboard', loadComponent: () => import('./components/admin/dashboard/dashboard').then(m => m.DashboardComponent) },
  { path: 'admin/dishes', loadComponent: () => import('./components/admin/admin-view-dishes/admin-view-dishes').then(m => m.AdminViewDishesComponent) },
  { path: 'admin/dishes/add', loadComponent: () => import('./components/admin/dish-form/dish-form').then(m => m.DishFormComponent) },
  { path: 'admin/dishes/edit/:id', loadComponent: () => import('./components/admin/dish-form/dish-form').then(m => m.DishFormComponent) },
  { path: 'admin/orders', loadComponent: () => import('./components/admin/order-placed/order-placed').then(m => m.OrderPlacedComponent) },
  { path: 'admin/reviews', loadComponent: () => import('./components/admin/admin-view-reviews/admin-view-reviews').then(m => m.AdminViewReviewsComponent) },
  { path: 'user', loadComponent: () => import('./components/user/user-view-dishes/user-view-dishes').then(m => m.UserViewDishesComponent) },
  { path: 'user/home', redirectTo: 'user', pathMatch: 'full' },
  { path: 'user/orders', loadComponent: () => import('./components/user/user-view-orders/user-view-orders').then(m => m.UserViewOrders) },
  { path: 'user/checkout', loadComponent: () => import('./components/user/checkout/checkout').then(m => m.Checkout) },
  { path: 'user/review/:dishId', loadComponent: () => import('./components/user/user-review/user-review').then(m => m.UserReview) },
  { path: 'user/my-reviews', loadComponent: () => import('./components/user/user-my-review/user-my-review').then(m => m.UserMyReview) },
  { path: 'user/reviews', redirectTo: 'user/my-reviews', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

