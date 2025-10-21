import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// --- Custom Validator Function ---
// This function checks if the 'password' and 'confirmPassword' fields match
export function passwordMatchValidator(
  control: AbstractControl
): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  // If controls are not yet available, or confirmPassword hasn't been touched
  if (!password || !confirmPassword || !confirmPassword.value) {
    return null;
  }

  // Set error on confirmPassword control if they don't match
  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    // Clear the error if they do match
    if (confirmPassword.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    return null;
  }
}

// --- Component Definition ---
@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class SignupComponent implements OnInit {
  
  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: [
          '',
          [Validators.required, Validators.pattern('^[0-9]{10}$')],
        ],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        role: ['', [Validators.required]],
      },
      {
        // Add the custom validator to the form group
        validators: passwordMatchValidator,
      }
    );
  }

  // --- Getter methods for easy access in the template ---
  get username() {
    return this.signupForm.get('username');
  }
  get email() {
    return this.signupForm.get('email');
  }
  get phone() {
    return this.signupForm.get('phone');
  }
  get password() {
    return this.signupForm.get('password');
  }
  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }
  get role() {
    return this.signupForm.get('role');
  }

  // --- Form Submission ---
  onSubmit(): void {
    // Mark all fields as touched to display validation messages
    this.signupForm.markAllAsTouched();

    // Stop if the form is invalid
    if (this.signupForm.invalid) {
      return;
    }

    // --- SIMULATED success for this example ---
    console.log('Signup Form Submitted!', this.signupForm.value);
    alert('User Registration is Successful!');
    
    // Navigate back to login after successful registration
    this.goToLogin();
  }

  // Method to navigate back to login
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}