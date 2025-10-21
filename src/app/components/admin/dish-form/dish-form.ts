import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminNavComponent } from '../admin-nav/admin-nav';

@Component({
  selector: 'app-dish-form',
  imports: [ReactiveFormsModule, RouterModule, CommonModule, AdminNavComponent],
  templateUrl: './dish-form.html',
  styleUrl: './dish-form.css'
})
export class DishFormComponent implements OnInit {
  
  dishForm: FormGroup;
  isEditMode: boolean = false;
  dishId: string | null = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  imageBase64: string = '';
  apiUrl = 'http://localhost:3001/dish';
  errors = {
    dishName: '',
    description: '',
    cuisine: '',
    price: '',
    coverImage: ''
  };
  errorMsg: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dishForm = this.fb.group({
      dishName: ['', Validators.required],
      description: ['', Validators.required],
      cuisine: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      availability: [true]
    });
  }

  ngOnInit() {
    // Check if we're in edit mode
    this.dishId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.dishId;

    if (this.isEditMode) {
      this.loadDishData(this.dishId!);
    }

    // Subscribe to form value changes for real-time validation
    Object.keys(this.dishForm.controls).forEach(key => {
      this.dishForm.get(key)?.valueChanges.subscribe(() => this.validateField(key));
    });
  }

  async loadDishData(id: string) {
    try {
      this.isLoading = true;
      const response = await fetch(`${this.apiUrl}/getDishById/${id}`);
      const data = await response.json();

      if (response.ok) {
        const dish = data;
        this.dishForm.patchValue({
          dishName: dish.dishName,
          description: dish.description,
          cuisine: dish.cuisine,
          price: dish.price,
          availability: dish.isAvailable
        });
        this.imagePreview = dish.coverImage;
        this.imageBase64 = dish.coverImage; // Store existing image
      } else {
        this.errorMsg = 'Failed to load dish data';
      }
    } catch (error) {
      console.error('Error loading dish:', error);
      this.errorMsg = 'Error loading dish data';
    } finally {
      this.isLoading = false;
    }
  }

  validateField(fieldName: string): void {
    const control = this.dishForm.get(fieldName);
    const key = fieldName as keyof typeof this.errors;
    this.errors[key] = '';

    if (control && control.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) {
        const label = fieldName === 'dishName' ? 'Dish Name' : 
                     fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        this.errors[key] = `${label} is required`;
      } else if (control.errors?.['min']) {
        this.errors[key] = 'Price must be positive';
      }
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        this.errors['coverImage'] = 'Invalid file type. Please upload JPG, JPEG, or PNG';
        this.selectedFile = null;
        this.imagePreview = null;
        this.imageBase64 = '';
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.errors['coverImage'] = 'File size exceeds 5MB';
        this.selectedFile = null;
        this.imagePreview = null;
        this.imageBase64 = '';
        return;
      }

      this.errors['coverImage'] = '';
      this.selectedFile = file;

      // Convert to base64 and create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.imageBase64 = e.target.result; // Store base64 string
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit() {
    this.errorMsg = '';
    
    // Mark all fields as touched to show validation
    this.dishForm.markAllAsTouched();
    Object.keys(this.dishForm.controls).forEach(key => {
      this.validateField(key);
    });

    // Check if cover image is required for new dish
    if (!this.isEditMode && !this.imageBase64) {
      this.errors['coverImage'] = 'Cover Image is required';
      return;
    }

    // Check form validity
    if (this.dishForm.invalid) {
      return;
    }

    if (this.isEditMode) {
      await this.updateDish();
    } else {
      await this.addDish();
    }
  }

  async addDish() {
    try {
      this.isLoading = true;
      const { dishName, description, cuisine, price, availability } = this.dishForm.value;

      const response = await fetch(`${this.apiUrl}/addDish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dishName,
          description,
          cuisine,
          price,
          isAvailable: availability,
          coverImage: this.imageBase64
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Dish added successfully:', data);
        alert('Dish Added Successfully!');
        this.router.navigate(['/admin/dishes']);
      } else {
        this.errorMsg = data.message || 'Failed to add dish';
      }
    } catch (error) {
      console.error('Error adding dish:', error);
      this.errorMsg = 'Server error. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async updateDish() {
    try {
      this.isLoading = true;
      const { dishName, description, cuisine, price, availability } = this.dishForm.value;

      const updateData: any = {
        dishName,
        description,
        cuisine,
        price,
        isAvailable: availability
      };

      // Only include coverImage if a new one was selected
      if (this.selectedFile && this.imageBase64) {
        updateData.coverImage = this.imageBase64;
      }

      const response = await fetch(`${this.apiUrl}/updateDish/${this.dishId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Dish updated successfully:', data);
        alert('Dish Updated Successfully!');
        this.router.navigate(['/admin/dishes']);
      } else {
        this.errorMsg = data.message || 'Failed to update dish';
      }
    } catch (error) {
      console.error('Error updating dish:', error);
      this.errorMsg = 'Server error. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  onCancel() {
    this.router.navigate(['/admin/dishes']);
  }
}