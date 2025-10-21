import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminNavComponent } from '../admin-nav/admin-nav';

// Display interface for the component
interface DishDisplay {
  id: any;
  name: string;
  cuisine: string;
  description: string;
  price: number;
  availability: string;
  image: string;
}

@Component({
  standalone: true,
  selector: 'app-admin-view-dishes',
  imports: [CommonModule, FormsModule, RouterModule, AdminNavComponent],
  templateUrl: './admin-view-dishes.html',
  styleUrls: ['./admin-view-dishes.css']
})
export class AdminViewDishesComponent implements OnInit {
  
  dishes: DishDisplay[] = [];
  filteredDishes: DishDisplay[] = [];
  searchTerm: string = '';
  selectedCuisine: string = 'All Cuisine';
  currentPage: number = 1;
  itemsPerPage: number = 4;
  
  // Delete confirmation dialog
  showDeleteDialog: boolean = false;
  dishToDelete: DishDisplay | null = null;
  
  cuisines: string[] = ['All Cuisine', 'Indian', 'American', 'Mediterranean', 'Japanese', 'Italian', 'Chinese'];
  apiUrl = 'http://localhost:3001/dish';

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadDishes();
  }

  async loadDishes() {
    try {
      const response = await fetch(`${this.apiUrl}/getAllDishes`);
      const data = await response.json();
      
      // Map backend data to component format
      this.dishes = data.map((dish: any) => ({
        id: dish._id,
        name: dish.dishName,
        cuisine: dish.cuisine,
        description: dish.description,
        price: dish.price,
        availability: dish.isAvailable ? 'In Stock' : 'Out of Stock',
        image: dish.coverImage
      }));
      this.filteredDishes = [...this.dishes];
    } catch (error) {
      console.error('Error loading dishes:', error);
      alert('Failed to load dishes. Please try again.');
    }
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

  getPaginatedDishes(): DishDisplay[] {
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

  onEdit(dish: DishDisplay) {
    console.log('Edit dish:', dish);
    this.router.navigate(['/admin/dishes/edit', dish.id]);
  }

  onDelete(dish: DishDisplay) {
    this.dishToDelete = dish;
    this.showDeleteDialog = true;
  }

  async confirmDelete() {
    if (this.dishToDelete) {
      const dishId = this.dishToDelete.id.toString();
      const dishName = this.dishToDelete.name;
      
      try {
        const response = await fetch(`${this.apiUrl}/deleteDish/${dishId}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        
        console.log('Delete response:', data);
        // Remove from local array
        this.dishes = this.dishes.filter(d => d.id !== this.dishToDelete!.id);
        this.applyFilters();
        alert(`${dishName} has been deleted successfully`);
        this.closeDeleteDialog();
      } catch (error) {
        console.error('Error deleting dish:', error);
        alert('Failed to delete dish. Please try again.');
        this.closeDeleteDialog();
      }
    } else {
      this.closeDeleteDialog();
    }
  }

  closeDeleteDialog() {
    this.showDeleteDialog = false;
    this.dishToDelete = null;
  }
}
