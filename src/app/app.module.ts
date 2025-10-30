import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app';
import { AdminNavComponent } from './components/admin/admin-nav/admin-nav';
import { ErrorPage } from './components/error-page/error-page';
import { AdminViewDishesComponent } from './components/admin/admin-view-dishes/admin-view-dishes';
import { AdminViewReviewsComponent } from './components/admin/admin-view-reviews/admin-view-reviews';
import { DashboardComponent } from './components/admin/dashboard/dashboard';
import { DishFormComponent } from './components/admin/dish-form/dish-form';
import { OrderPlacedComponent } from './components/admin/order-placed/order-placed';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { HomePage } from './components/home-page/home-page';
import { LoginComponent } from './components/login/login';
import { SignupComponent } from './components/signup/signup';
import { Checkout } from './components/user/checkout/checkout';
import { UserMyReview } from './components/user/user-my-review/user-my-review';
import { UserNavComponent } from './components/user/user-nav/user-nav';
import { UserReview } from './components/user/user-review/user-review';
import { UserViewDishesComponent } from './components/user/user-view-dishes/user-view-dishes';
import { UserViewOrders } from './components/user/user-view-orders/user-view-orders';

@NgModule({
  declarations: [
    App,
    AdminNavComponent,
    ErrorPage,
    AdminViewDishesComponent,
    AdminViewReviewsComponent,
    DashboardComponent,
    DishFormComponent,
    OrderPlacedComponent,
    ForgotPassword,
    HomePage,
    LoginComponent,
    SignupComponent,
    Checkout,
    UserMyReview,
    UserNavComponent,
    UserReview,
    UserViewDishesComponent,
    UserViewOrders
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [App]
})
export class AppModule { }

