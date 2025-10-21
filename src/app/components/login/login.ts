import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {

  // Properties Used
  loginForm: FormGroup;
  errors: { email: string; password: string } = { email: '', password: '' };
  errorMsg: string = '';
  apiUrl = 'http://localhost:3001/user';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    // Initialize loginForm in the constructor as required by strict types
    this.loginForm = this.fb.group({});
  }

  // ngOnInit Method
  ngOnInit(): void {
    // Initializes the loginForm with validators
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Subscribes to form value changes for real-time validation
    this.loginForm.get('email')?.valueChanges.subscribe(() => this.validateField('email'));
    this.loginForm.get('password')?.valueChanges.subscribe(() => this.validateField('password'));
  }

  // Validation Handling
  validateField(fieldName: 'email' | 'password'): void {
    const control = this.loginForm.get(fieldName);
    this.errors[fieldName] = ''; // Clear previous error

    if (control && control.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) {
        this.errors[fieldName] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      } else if (control.errors?.['email']) {
        // The email field follows a valid email pattern
        this.errors[fieldName] = 'Please enter a valid email format';
      } else if (control.errors?.['minlength']) {
        // The password field is at least 6 characters long
        this.errors[fieldName] = 'Password must be at least 6 characters long';
      }
    }
  }

  // handleSubmit Method
  async handleSubmit(): Promise<void> {
    this.errorMsg = ''; // Clear previous server error

    // Checks Validation Errors: Validates all form fields
    this.loginForm.markAllAsTouched();
    this.validateField('email');
    this.validateField('password');

    // If validation fails, prevents form submission.
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    
    try {
      const response = await fetch(`${this.apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        
        // Store user data and token in localStorage
        localStorage.setItem('user', JSON.stringify({
          email: data.data.user.email,
          role: data.data.user.userRole,
          username: data.data.user.username,
          token: data.data.token
        }));
        
        // Navigate based on role
        if (data.data.user.userRole === 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/user']);
        }
      } else {
        this.errorMsg = data.message || 'Invalid credentials. Please try again.';
      }
    } catch (error) {
      console.error('Login error:', error);
      this.errorMsg = 'Server error. Please try again later.';
    }
  }

  // Method to navigate to signup
  goToSignup(): void {
    this.router.navigate(['/signup']);
  }
}

