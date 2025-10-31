import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPassword {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private router: Router, private toastr: ToastrService) {}

  async onSubmit(): Promise<void> {
    // Validation
    if (!this.email.trim()) {
      this.toastr.error('Please enter your email address');
      return;
    }

    if (!this.newPassword.trim()) {
      this.toastr.error('Please enter a new password');
      return;
    }

    if (!this.confirmPassword.trim()) {
      this.toastr.error('Please confirm your new password');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.toastr.error('Passwords do not match');
      return;
    }

    if (this.newPassword.length < 6) {
      this.toastr.error('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/user/resetPassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: this.email,
          password: this.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        this.toastr.success('Password reset successful! Please login with your new password.');
        this.router.navigate(['/login']);
      } else {
        this.toastr.error(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      this.toastr.error('Failed to reset password. Please try again.');
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
