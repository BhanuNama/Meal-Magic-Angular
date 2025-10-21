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
  errors = {
    dishName: '',
    description: '',
    cuisine: '',
    price: '',
    coverImage: ''
  };

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

  loadDishData(id: string) {
    // Sample data - in real app, fetch from API
    const dishes = {
      '1': {
        dishName: 'Biryani',
        description: 'Aromatic basmati rice cooked with tender chicken, spices, and herbs',
        cuisine: 'Indian',
        price: 250,
        availability: true,
        image: 'https://www.cubesnjuliennes.com/wp-content/uploads/2020/07/Chicken-Biryani-Recipe.jpg'
      }
    };

    const dish = dishes[id as keyof typeof dishes];
    if (dish) {
      this.dishForm.patchValue({
        dishName: dish.dishName,
        description: dish.description,
        cuisine: dish.cuisine,
        price: dish.price,
        availability: dish.availability
      });
      this.imagePreview = dish.image;
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
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.errors['coverImage'] = 'File size exceeds 5MB';
        this.selectedFile = null;
        this.imagePreview = null;
        return;
      }

      this.errors['coverImage'] = '';
      this.selectedFile = file;

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    // Mark all fields as touched to show validation
    this.dishForm.markAllAsTouched();
    Object.keys(this.dishForm.controls).forEach(key => {
      this.validateField(key);
    });

    // Check if cover image is required for new dish
    if (!this.isEditMode && !this.selectedFile) {
      this.errors['coverImage'] = 'Cover Image is required';
      return;
    }

    // Check form validity
    if (this.dishForm.invalid) {
      return;
    }

    const formData = {
      ...this.dishForm.value,
      coverImage: this.selectedFile
    };

    if (this.isEditMode) {
      console.log('Updating dish:', formData);
      alert('Dish Updated Successfully!');
    } else {
      console.log('Adding dish:', formData);
      alert('Dish Added Successfully!');
    }

    // Navigate back to dishes list
    this.router.navigate(['/admin/dishes']);
  }

  onCancel() {
    this.router.navigate(['/admin/dishes']);
  }
}