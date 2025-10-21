import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {

  // Properties Used
  loginForm: FormGroup;
  errors: { email: string; password: string } = { email: '', password: '' };
  errorMsg: string = '';

  // Demo users
  private demoUsers = {
    'admin@gmail.com': { password: 'admin123', role: 'Admin', username: 'DemoAdmin' },
    'user@gmail.com': { password: 'user1234', role: 'User', username: 'DemoUser' }
  };

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
  handleSubmit(): void {
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
    
    // Check demo users
    const user = this.demoUsers[email as keyof typeof this.demoUsers];
    
    if (user && user.password === password) {
      console.log('Login successful:', { email, role: user.role, username: user.username });
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify({
        email,
        role: user.role,
        username: user.username
      }));
      
      // Navigate based on role
      if (user.role === 'Admin') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/user']);
      }
    } else {
      this.errorMsg = 'Invalid credentials. Please try again.';
    }
  }

  // Method to navigate to signup
  goToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
