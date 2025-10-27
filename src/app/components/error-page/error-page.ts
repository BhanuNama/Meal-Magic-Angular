import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-error-page',
  imports: [CommonModule, RouterModule],
  templateUrl: './error-page.html',
  styleUrls: ['./error-page.css']
})
export class ErrorPage implements OnInit {
  errorMessage: string = 'We\'re sorry, but an error occurred. Please try again later.';
  errorCode: string = '500';

  constructor(
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    // You can get error details from navigation state if needed
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.errorMessage = navigation.extras.state['message'] || this.errorMessage;
      this.errorCode = navigation.extras.state['code'] || this.errorCode;
    }
  }

  goBack(): void {
    this.location.back();
  }

  goHome(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        const role = user.role || user.userRole;
        
        if (role === 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/user']);
        }
      } catch (error) {
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  tryAgain(): void {
    window.location.reload();
  }
}
