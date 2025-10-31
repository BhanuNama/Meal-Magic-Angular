import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { SignupComponent } from './components/signup/signup';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { ErrorPage } from './components/error-page/error-page';
import { HomePage } from './components/home-page/home-page';
import { DashboardComponent } from './components/admin/dashboard/dashboard';
import { AdminViewDishesComponent } from './components/admin/admin-view-dishes/admin-view-dishes';
import { DishFormComponent } from './components/admin/dish-form/dish-form';
import { OrderPlacedComponent } from './components/admin/order-placed/order-placed';
import { AdminViewReviewsComponent } from './components/admin/admin-view-reviews/admin-view-reviews';
import { UserViewDishesComponent } from './components/user/user-view-dishes/user-view-dishes';
import { UserViewOrders } from './components/user/user-view-orders/user-view-orders';
import { Checkout } from './components/user/checkout/checkout';
import { UserReview } from './components/user/user-review/user-review';
import { UserMyReview } from './components/user/user-my-review/user-my-review';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'error', component: ErrorPage },
  { path: 'admin', redirectTo: 'admin/home', pathMatch: 'full' },
  { path: 'admin/home', component: HomePage },
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'admin/dishes', component: AdminViewDishesComponent },
  { path: 'admin/dishes/add', component: DishFormComponent },
  { path: 'admin/dishes/edit/:id', component: DishFormComponent },
  { path: 'admin/orders', component: OrderPlacedComponent },
  { path: 'admin/reviews', component: AdminViewReviewsComponent },
  { path: 'user', component: UserViewDishesComponent },
  { path: 'user/home', redirectTo: 'user', pathMatch: 'full' },
  { path: 'user/orders', component: UserViewOrders },
  { path: 'user/checkout', component: Checkout },
  { path: 'user/review/:dishId', component: UserReview },
  { path: 'user/my-reviews', component: UserMyReview },
  { path: 'user/reviews', redirectTo: 'user/my-reviews', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

