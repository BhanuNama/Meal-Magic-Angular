import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminNavComponent } from '../admin-nav/admin-nav';

interface Dish {
  id: number;
  name: string;
  cuisine: string;
  description: string;
  price: number;
  availability: string;
  image: string;
}

@Component({
  selector: 'app-admin-view-dishes',
  imports: [CommonModule, FormsModule, RouterModule, AdminNavComponent],
  templateUrl: './admin-view-dishes.html',
  styleUrl: './admin-view-dishes.css'
})
export class AdminViewDishesComponent implements OnInit {
  
  dishes: Dish[] = [];
  filteredDishes: Dish[] = [];
  searchTerm: string = '';
  selectedCuisine: string = 'All Cuisine';
  currentPage: number = 1;
  itemsPerPage: number = 4;
  
  // Delete confirmation dialog
  showDeleteDialog: boolean = false;
  dishToDelete: Dish | null = null;
  
  cuisines: string[] = ['All Cuisine', 'Indian', 'American', 'Mediterranean', 'Japanese', 'Italian', 'Chinese'];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadDishes();
  }

  loadDishes() {
    // Sample data - in real app, this would come from API
    this.dishes = [
      {
        id: 1,
        name: 'Biryani',
        cuisine: 'Indian',
        description: 'Aromatic basmati rice cooked with tender chicken, spices, and herbs',
        price: 250,
        availability: 'In Stock',
        image: 'https://www.cubesnjuliennes.com/wp-content/uploads/2020/07/Chicken-Biryani-Recipe.jpg'
      },
      {
        id: 2,
        name: 'Burger',
        cuisine: 'American',
        description: 'Juicy grilled beef patty with cheese, lettuce, tomato, and sauce in a soft bun',
        price: 180,
        availability: 'In Stock',
        image: 'https://www.southernliving.com/thmb/x4IHh8b0-bdyHHLzNoHY-SP6E8M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Extra_Easy_Cheeseburger_006-b68cf-35c15b759d9a4e5a80f8a67c41a7a01f.jpg'
      },
      {
        id: 3,
        name: 'Salad',
        cuisine: 'Mediterranean',
        description: 'Fresh mixed greens with cucumber, tomato, olives, and feta cheese',
        price: 150,
        availability: 'In Stock',
        image: 'https://natashaskitchen.com/wp-content/uploads/2019/01/Caesar-Salad-Recipe-3.jpg'
      },
      {
        id: 4,
        name: 'Sushi',
        cuisine: 'Japanese',
        description: 'Delicate rolls of vinegared rice with fresh fish and vegetables',
        price: 400,
        availability: 'In Stock',
        image: 'https://www.justonecookbook.com/wp-content/uploads/2020/01/Salmon-Sushi-Roll-0286-I.jpg'
      },
      {
        id: 5,
        name: 'Pizza',
        cuisine: 'Italian',
        description: 'Fresh dough topped with mozzarella cheese and premium ingredients',
        price: 300,
        availability: 'In Stock',
        image: 'https://www.recipetineats.com/wp-content/uploads/2020/05/Pizza_6-SQ.jpg'
      },
      {
        id: 6,
        name: 'Noodles',
        cuisine: 'Chinese',
        description: 'Stir-fried noodles with vegetables and savory sauce',
        price: 220,
        availability: 'In Stock',
        image: 'https://www.recipetineats.com/wp-content/uploads/2023/09/Chicken-Chow-Mein_2.jpg'
      }
    ];
    
    this.filteredDishes = [...this.dishes];
  }

  onSearch() {
    this.applyFilters();
  }

  onCuisineChange() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredDishes = this.dishes.filter(dish => {
      const matchesSearch = dish.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           dish.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCuisine = this.selectedCuisine === 'All Cuisine' || dish.cuisine === this.selectedCuisine;
      return matchesSearch && matchesCuisine;
    });
    this.currentPage = 1;
  }

  getPaginatedDishes(): Dish[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredDishes.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredDishes.length / this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onEdit(dish: Dish) {
    console.log('Edit dish:', dish);
    this.router.navigate(['/admin/dishes/edit', dish.id]);
  }

  onDelete(dish: Dish) {
    this.dishToDelete = dish;
    this.showDeleteDialog = true;
  }

  confirmDelete() {
    if (this.dishToDelete) {
      console.log('Delete dish:', this.dishToDelete);
      // In real app, call API to delete
      this.dishes = this.dishes.filter(d => d.id !== this.dishToDelete!.id);
      this.applyFilters();
      alert(`${this.dishToDelete.name} has been deleted successfully`);
    }
    this.closeDeleteDialog();
  }

  closeDeleteDialog() {
    this.showDeleteDialog = false;
    this.dishToDelete = null;
  }
}