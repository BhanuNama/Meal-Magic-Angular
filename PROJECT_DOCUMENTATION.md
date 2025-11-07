# Meal Magic Angular - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Database Schema](#database-schema)
5. [Backend API Documentation](#backend-api-documentation)
6. [Frontend Components](#frontend-components)
7. [Complete User Workflows](#complete-user-workflows)
8. [Detailed Feature Explanation](#detailed-feature-explanation)
9. [Authentication & Authorization](#authentication--authorization)
10. [Data Flow Diagrams](#data-flow-diagrams)

---

## 1. Project Overview

**Meal Magic** is a full-stack food ordering and management system built with Angular (frontend) and Node.js/Express (backend). The application serves two distinct user roles:

### Purpose
- **For Customers (Users)**: Browse dishes, add items to cart, place orders, track order status, and write reviews
- **For Administrators**: Manage dishes (CRUD operations), view all orders, manage order status, and monitor reviews

### Key Capabilities
- Role-based access control (Admin vs User)
- Real-time cart management with localStorage
- Complete order lifecycle management
- Review and rating system for dishes
- Image upload support (base64 encoding)
- Responsive UI with Material Design components

---

## 2. Technology Stack

### Frontend (Angular 16)
```json
{
  "Framework": "Angular 16.2.12",
  "UI Components": "Angular Material 16.2.12",
  "Forms": "Reactive Forms & Template-driven Forms",
  "Routing": "Angular Router",
  "HTTP Client": "Angular HttpClient",
  "Notifications": "ngx-toastr 19.1.0",
  "State Management": "localStorage (client-side)",
  "Styling": "CSS with Angular Material theming"
}
```

### Backend (Node.js/Express)
```json
{
  "Runtime": "Node.js",
  "Framework": "Express 5.1.0",
  "Database": "MongoDB with Mongoose 8.19.2",
  "Authentication": "JWT (jsonwebtoken 9.0.2)",
  "Password Hashing": "bcrypt 6.0.0",
  "CORS": "cors 2.8.5",
  "Environment": "dotenv 17.2.3"
}
```

### Database
- **MongoDB**: NoSQL document database
- **Collections**: Users, Dishes, Orders, OrderItems, Reviews

---

## 3. System Architecture

### Architecture Pattern
The application follows a **3-tier architecture**:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│     (Angular Frontend - Port 4200)      │
│  - Components, Services, Routing        │
└─────────────────┬───────────────────────┘
                  │ HTTP/REST API
                  │ (JSON)
┌─────────────────▼───────────────────────┐
│        Application Layer                │
│   (Node.js/Express - Port 3001)         │
│  - Controllers, Routes, Middleware      │
└─────────────────┬───────────────────────┘
                  │ Mongoose ODM
┌─────────────────▼───────────────────────┐
│          Data Layer                     │
│         (MongoDB Database)              │
│  - Collections, Documents, Indexes      │
└─────────────────────────────────────────┘
```

### Project Structure

#### Frontend Structure
```
src/app/
├── components/          # UI Components
│   ├── admin/          # Admin-specific components
│   │   ├── admin-nav/
│   │   ├── dashboard/
│   │   ├── admin-view-dishes/
│   │   ├── dish-form/
│   │   ├── order-placed/
│   │   └── admin-view-reviews/
│   ├── user/           # User-specific components
│   │   ├── user-nav/
│   │   ├── user-view-dishes/
│   │   ├── checkout/
│   │   ├── user-view-orders/
│   │   ├── user-review/
│   │   └── user-my-review/
│   └── shared/         # Shared components
│       ├── home-page/
│       ├── login/
│       ├── signup/
│       ├── forgot-password/
│       └── error-page/
├── services/           # API Communication
│   ├── api.service.ts
│   ├── user.service.ts
│   ├── dish.service.ts
│   ├── order.service.ts
│   └── review.service.ts
├── models/             # TypeScript Interfaces
│   ├── user.model.ts
│   ├── dish.model.ts
│   ├── order.model.ts
│   └── review.model.ts
└── app-routing.module.ts  # Routing Configuration
```

#### Backend Structure
```
backend/
├── controllers/        # Business Logic
│   ├── userController.js
│   ├── dishController.js
│   ├── orderController.js
│   └── reviewController.js
├── models/            # Database Schemas
│   ├── user.js
│   ├── dish.js
│   ├── Order.js
│   ├── OrderItem.js
│   └── review.js
├── routes/            # API Endpoints
│   ├── userRoutes.js
│   ├── dishRoutes.js
│   ├── orderRoutes.js
│   └── reviewRoutes.js
├── middleware/        # Authentication & Validation
│   └── auth.js
└── index.js          # Server Entry Point
```

---

## 4. Database Schema

### 4.1 User Collection
```javascript
{
  _id: ObjectId,
  username: String (required),
  email: String (required, unique, validated),
  mobileNumber: String (required),
  password: String (required, bcrypt hashed),
  userRole: String (required) // "Admin" or "User"
}
```

**Indexes**: 
- Unique index on `email` for fast lookups and duplicate prevention

**Validation**:
- Email must match regex pattern
- Password hashed with bcrypt (10 salt rounds)

### 4.2 Dish Collection
```javascript
{
  _id: ObjectId,
  dishName: String (required, trimmed),
  description: String (required, trimmed),
  cuisine: String (required, trimmed),
  price: Number (required, min: 0),
  isAvailable: Boolean (default: true),
  coverImage: String (required, base64 encoded),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

**Use Cases**:
- Admin creates/updates/deletes dishes
- Users view only available dishes
- Images stored as base64 strings in database

### 4.3 Order Collection
```javascript
{
  _id: ObjectId,
  orderDate: Date (default: Date.now),
  orderStatus: String (enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]),
  shippingAddress: String (required),
  billingAddress: String (required),
  totalAmount: Number (required, calculated),
  user: ObjectId (ref: "User", required),
  orderItems: [ObjectId] (ref: "OrderItem"),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

**Relationships**:
- Many-to-One with User (one user can have many orders)
- One-to-Many with OrderItems (one order contains many items)

### 4.4 OrderItem Collection
```javascript
{
  _id: ObjectId,
  quantity: Number (required),
  price: Number (required, min: 1),
  dish: ObjectId (ref: "Dish"),
  order: ObjectId (ref: "Order", required),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

**Purpose**:
- Junction table for Order-Dish many-to-many relationship
- Captures price at time of order (historical record)

### 4.5 Review Collection
```javascript
{
  _id: ObjectId,
  reviewText: String (optional, trimmed),
  rating: Number (required, min: 1, max: 5),
  date: Date (default: Date.now),
  user: ObjectId (ref: "User", required),
  dish: ObjectId (ref: "Dish", required),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

**Relationships**:
- Many-to-One with User (one user can write many reviews)
- Many-to-One with Dish (one dish can have many reviews)

---

## 5. Backend API Documentation

### 5.1 User Authentication APIs

#### POST `/user/register`
**Purpose**: Register a new user account

**Request Body**:
```json
{
  "username": "John Doe",
  "email": "john@example.com",
  "mobileNumber": "1234567890",
  "password": "securePassword123",
  "userRole": "User"
}
```

**Response** (Success - 201):
```json
{
  "error": false,
  "message": "User Registration Successful",
  "data": {
    "id": "64abc123...",
    "username": "John Doe",
    "email": "john@example.com",
    "userRole": "User"
  }
}
```

**Business Logic**:
1. Validates all required fields
2. Checks if email already exists
3. Hashes password with bcrypt (10 salt rounds)
4. Creates new user document
5. Returns sanitized user data (excludes password)

#### POST `/user/login`
**Purpose**: Authenticate user and generate JWT token

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response** (Success - 200):
```json
{
  "error": false,
  "message": "Login Successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64abc123...",
      "username": "John Doe",
      "email": "john@example.com",
      "userRole": "User"
    }
  }
}
```

**JWT Token Payload**:
```json
{
  "userId": "64abc123...",
  "email": "john@example.com",
  "userRole": "User",
  "iat": 1640000000,
  "exp": 1640086400  // 24 hours expiration
}
```

**Business Logic**:
1. Validates email and password fields
2. Finds user by email
3. Compares password hash using bcrypt
4. Generates JWT token with 24-hour expiration
5. Returns token and user data

#### PUT `/user/resetPassword`
**Purpose**: Reset user password

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "newSecurePassword456"
}
```

**Response** (Success - 200):
```json
{
  "error": false,
  "message": "Password has been updated successfully",
  "data": null
}
```

#### GET `/user/getAllUsers`
**Purpose**: Retrieve all users (Admin only - though auth not currently enforced)

**Response** (Success - 200):
```json
{
  "error": false,
  "message": "All Users found successfully",
  "data": [
    {
      "_id": "64abc123...",
      "username": "John Doe",
      "email": "john@example.com",
      "mobileNumber": "1234567890",
      "userRole": "User"
    }
  ]
}
```

#### GET `/user/getUserById/:id`
**Purpose**: Retrieve specific user details

**Response** (Success - 200):
```json
{
  "error": false,
  "message": "User found successfully",
  "data": {
    "_id": "64abc123...",
    "username": "John Doe",
    "email": "john@example.com",
    "mobileNumber": "1234567890",
    "userRole": "User"
  }
}
```

---

### 5.2 Dish Management APIs

#### POST `/dish/addDish`
**Purpose**: Create a new dish (Admin operation)

**Request Body**:
```json
{
  "dishName": "Chicken Tikka Masala",
  "description": "Creamy tomato-based curry with tender chicken pieces",
  "cuisine": "Indian",
  "price": 15.99,
  "isAvailable": true,
  "coverImage": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response** (Success - 201):
```json
{
  "message": "Dish Added Successfully",
  "dish": {
    "_id": "64def456...",
    "dishName": "Chicken Tikka Masala",
    "description": "Creamy tomato-based curry...",
    "cuisine": "Indian",
    "price": 15.99,
    "isAvailable": true,
    "coverImage": "data:image/jpeg;base64,...",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### GET `/dish/getAllDishes`
**Purpose**: Retrieve all dishes

**Response** (Success - 200):
```json
[
  {
    "_id": "64def456...",
    "dishName": "Chicken Tikka Masala",
    "description": "Creamy tomato-based curry...",
    "cuisine": "Indian",
    "price": 15.99,
    "isAvailable": true,
    "coverImage": "data:image/jpeg;base64,...",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### GET `/dish/getDishById/:id`
**Purpose**: Retrieve specific dish details

#### PUT `/dish/updateDish/:id`
**Purpose**: Update existing dish (Admin operation)

**Request Body**: Same as addDish (partial updates supported)

**Response** (Success - 200):
```json
{
  "message": "Dish Updated Successfully",
  "dish": { /* updated dish object */ }
}
```

#### DELETE `/dish/deleteDish/:id`
**Purpose**: Delete a dish (Admin operation)

**Response** (Success - 200):
```json
{
  "message": "Dish Deleted Successfully"
}
```

---

### 5.3 Order Management APIs

#### POST `/order/addOrder`
**Purpose**: Create a new order

**Request Body**:
```json
{
  "user": "64abc123...",
  "orderItems": [
    {
      "dish": "64def456...",
      "quantity": 2
    },
    {
      "dish": "64def789...",
      "quantity": 1
    }
  ],
  "shippingAddress": "123 Main St, Apt 4B, New York, NY 10001",
  "billingAddress": "123 Main St, Apt 4B, New York, NY 10001"
}
```

**Response** (Success - 201):
```json
{
  "message": "Order Placed Successfully",
  "order": {
    "_id": "64ghi012...",
    "totalAmount": 47.97,
    "orderStatus": "Pending",
    "createdAt": "2024-01-15T14:30:00.000Z"
  }
}
```

**Business Logic**:
1. Validates user and order items
2. Creates base order document
3. For each item:
   - Fetches dish details from database
   - Validates dish exists and is available
   - Creates OrderItem document with current price
   - Calculates item total (price × quantity)
4. Updates order with total amount and item references
5. Returns order confirmation

**Complex Process Flow**:
```
User submits order → Validate request
    ↓
Create Order (status: Pending, totalAmount: 0)
    ↓
For each cart item:
    ↓
    Fetch Dish → Validate availability
    ↓
    Create OrderItem (captures current price)
    ↓
    Add to totalAmount
    ↓
Update Order (add OrderItem IDs, set totalAmount)
    ↓
Return Order confirmation
```

#### GET `/order/getAllOrders`
**Purpose**: Retrieve all orders with populated user and dish details

**Response** (Success - 200):
```json
[
  {
    "_id": "64ghi012...",
    "user": {
      "username": "John Doe",
      "email": "john@example.com",
      "mobileNumber": "1234567890"
    },
    "orderItems": [
      {
        "_id": "64jkl345...",
        "quantity": 2,
        "price": 15.99,
        "dish": {
          "dishName": "Chicken Tikka Masala",
          "cuisine": "Indian",
          "coverImage": "data:image/jpeg;base64,...",
          "price": 15.99
        }
      }
    ],
    "totalAmount": 31.98,
    "orderStatus": "Pending",
    "shippingAddress": "123 Main St...",
    "billingAddress": "123 Main St...",
    "orderDate": "2024-01-15T14:30:00.000Z",
    "createdAt": "2024-01-15T14:30:00.000Z"
  }
]
```

**Mongoose Population**:
- Populates `user` with username, email, mobileNumber
- Populates `orderItems` → `dish` with dishName, cuisine, coverImage, price

#### GET `/order/getOrderById/:id`
**Purpose**: Retrieve specific order details (with populated data)

#### GET `/order/getOrdersByUserId/:userId`
**Purpose**: Retrieve all orders for a specific user

**Use Case**: User views their order history

#### PUT `/order/updateOrder/:id`
**Purpose**: Update order (typically for status changes by admin)

**Request Body**:
```json
{
  "orderStatus": "Processing"
}
```

**Allowed Fields**: `orderStatus`, `shippingAddress`, `billingAddress`

#### DELETE `/order/deleteOrder/:id`
**Purpose**: Cancel/delete an order

**Business Logic**:
1. Deletes all associated OrderItem documents
2. Deletes the Order document
3. Cascading delete ensures data integrity

---

### 5.4 Review Management APIs

#### POST `/review/addReview`
**Purpose**: Submit a review for a dish

**Request Body**:
```json
{
  "reviewText": "Absolutely delicious! The best tikka masala I've had.",
  "rating": 5,
  "user": "64abc123...",
  "dish": "64def456..."
}
```

**Response** (Success - 201):
```json
{
  "message": "Review Added Successfully",
  "review": {
    "_id": "64mno678...",
    "reviewText": "Absolutely delicious!...",
    "rating": 5,
    "user": "64abc123...",
    "dish": "64def456...",
    "date": "2024-01-15T16:00:00.000Z",
    "createdAt": "2024-01-15T16:00:00.000Z"
  }
}
```

#### GET `/review/getAllReviews`
**Purpose**: Retrieve all reviews with populated user and dish data

#### GET `/review/getReviewById/:id`
**Purpose**: Retrieve specific review details

#### GET `/review/getReviewsByUserId/:userId`
**Purpose**: Retrieve all reviews by a specific user

**Use Case**: User views their own review history

#### GET `/review/getReviewsByDishId/:dishId`
**Purpose**: Retrieve all reviews for a specific dish

**Use Case**: Display reviews on dish detail page

#### PUT `/review/updateReview/:id`
**Purpose**: Update an existing review

#### DELETE `/review/deleteReview/:id`
**Purpose**: Delete a review

---

## 6. Frontend Components

### 6.1 Shared Components

#### Home Page Component
**File**: `src/app/components/home-page/home-page.ts`

**Purpose**: Landing page showcasing available dishes

**Key Features**:
- Displays all available dishes (filtered by `isAvailable: true`)
- Hero section with call-to-action buttons
- Navigation to login/signup
- Smooth scrolling to dishes section

**Data Flow**:
```
ngOnInit() → loadDishes()
    ↓
Fetch GET /dish/getAllDishes
    ↓
Filter: dishes.isAvailable === true
    ↓
Render dish grid with images
```

**User Actions**:
- Click "Login" → Navigate to `/login`
- Click "View Dishes" → Scroll to dishes section
- Click "View Orders" → Check auth → Navigate based on role
- Click "View Reviews" → Check auth → Navigate based on role

#### Login Component
**File**: `src/app/components/login/login.ts`

**Purpose**: User authentication

**Form Validation**:
- Email: Required, valid email format
- Password: Required, minimum 6 characters
- Real-time validation with error messages

**Authentication Flow**:
```
User submits form → Validate fields
    ↓
POST /user/login with credentials
    ↓
Success → Store user data in localStorage:
  {
    userId: "...",
    email: "...",
    role: "Admin" | "User",
    username: "...",
    token: "JWT_TOKEN"
  }
    ↓
Navigate based on role:
  - Admin → /admin/dashboard
  - User → /user
```

**localStorage Structure**:
```javascript
localStorage.setItem('user', JSON.stringify({
  userId: data.data.user.id,
  email: data.data.user.email,
  role: data.data.user.userRole,
  username: data.data.user.username,
  token: data.data.token
}));
```

#### Signup Component
**File**: `src/app/components/signup/signup.ts`

**Purpose**: User registration

**Form Fields & Validation**:
- Username: Required
- Email: Required, valid email format
- Phone: Required, exactly 10 digits (pattern: `^[0-9]{10}$`)
- Password: Required, minimum 8 characters
- Confirm Password: Required, must match password
- Role: Required (dropdown: "User" or "Admin")

**Custom Validator**:
```typescript
passwordMatchValidator(control: AbstractControl) {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
  return null;
}
```

**Registration Flow**:
```
User fills form → Validate all fields
    ↓
POST /user/register
    ↓
Success → Display success message
    ↓
Wait 2 seconds → Navigate to /login
```

#### Forgot Password Component
**File**: `src/app/components/forgot-password/forgot-password.ts`

**Purpose**: Reset user password

**Form Fields**:
- Email address
- New password (min 6 characters)
- Confirm new password

**Password Reset Flow**:
```
User enters email and new password
    ↓
Validate: passwords match && length >= 6
    ↓
PUT /user/resetPassword
    ↓
Success → Show success toast
    ↓
Navigate to /login
```

---

### 6.2 Admin Components

#### Admin Navigation Component
**File**: `src/app/components/admin/admin-nav/admin-nav.ts`

**Purpose**: Navigation bar for admin pages

**Features**:
- Displays current admin username
- Navigation links: Dashboard, Dishes, Orders, Reviews
- Logout functionality with confirmation popup

**Auth Check**:
```typescript
ngOnInit() {
  this.currentUser = getCurrentUser();
  if (!this.currentUser) {
    this.router.navigate(['/login']);
  }
}
```

**Logout Process**:
```
Click Logout → Show confirmation popup
    ↓
Confirm → Remove from localStorage:
  - 'user'
  - 'cart'
    ↓
Navigate to /login
```

#### Admin Dashboard Component
**File**: `src/app/components/admin/dashboard/dashboard.ts`

**Purpose**: Overview of system statistics

**Dashboard Metrics**:
```typescript
stats = {
  totalUsers: 0,      // Count of non-admin users
  totalDishes: 0,     // Count of all dishes
  totalOrders: 0,     // Count of all orders
  totalReviews: 0     // Count of all reviews
}
```

**Data Loading**:
```
ngOnInit() → loadDashboardData()
    ↓
Parallel requests:
  - GET /user/getAllUsers
  - GET /dish/getAllDishes
  - GET /order/getAllOrders
  - GET /review/getAllReviews
    ↓
Filter users (exclude admins):
  users.filter(u => u.userRole.toLowerCase() !== 'admin')
    ↓
Update stats display
```

**User Display**:
- Lists all non-admin users
- Shows username, email, role for each user

#### Admin View Dishes Component
**File**: `src/app/components/admin/admin-view-dishes/admin-view-dishes.ts`

**Purpose**: Manage dish catalog (View, Edit, Delete)

**Features**:
1. **Search**: Filter by dish name or description (case-insensitive)
2. **Filter**: By cuisine type (dropdown)
3. **Pagination**: 4 dishes per page
4. **Actions**: Edit or Delete each dish

**Dish Display Interface**:
```typescript
interface DishDisplay {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  price: number;
  availability: string;  // "In Stock" or "Out of Stock"
  image: string;         // Base64 encoded
}
```

**Filter Logic**:
```typescript
applyFilters() {
  this.filteredDishes = this.dishes.filter(dish => {
    const matchesSearch = 
      dish.name.toLowerCase().includes(searchTerm) ||
      dish.description.toLowerCase().includes(searchTerm);
    
    const matchesCuisine = 
      selectedCuisine === 'All Cuisine' || 
      dish.cuisine === selectedCuisine;
    
    return matchesSearch && matchesCuisine;
  });
}
```

**Delete Confirmation**:
```
Click Delete → Show modal
    ↓
Confirm → DELETE /dish/deleteDish/:id
    ↓
Success → Remove from local array
    ↓
Display success toast
```

#### Dish Form Component
**File**: `src/app/components/admin/dish-form/dish-form.ts`

**Purpose**: Add new dish or edit existing dish

**Form Fields**:
- Dish Name (required)
- Description (required)
- Cuisine (required, dropdown)
- Price (required, min: 0)
- Availability (checkbox, default: true)
- Cover Image (required for new, optional for edit)

**Image Handling**:
```typescript
onFileChange(event) {
  const file = event.target.files[0];
  
  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!validTypes.includes(file.type)) {
    return error;
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return error;
  }
  
  // Convert to base64
  const reader = new FileReader();
  reader.onload = (e) => {
    this.imagePreview = e.target.result;
    this.imageBase64 = e.target.result;
  };
  reader.readAsDataURL(file);
}
```

**Add Dish Flow**:
```
Fill form → Validate fields
    ↓
Select image → Convert to base64
    ↓
POST /dish/addDish with:
  {
    dishName, description, cuisine, price,
    isAvailable, coverImage (base64)
  }
    ↓
Success → Show toast
    ↓
Navigate to /admin/dishes
```

**Edit Dish Flow**:
```
Load dish by ID from route params
    ↓
Populate form with existing data
    ↓
User modifies fields
    ↓
PUT /dish/updateDish/:id
  (only include coverImage if new image selected)
    ↓
Success → Navigate to /admin/dishes
```

#### Order Placed Component
**File**: `src/app/components/admin/order-placed/order-placed.ts`

**Purpose**: View and manage all orders

**Features**:
1. **Search**: Filter by Order ID or username
2. **Sort**: By order date (ascending/descending)
3. **Pagination**: 5 orders per page
4. **View Actions**:
   - View order items (modal)
   - View customer profile (modal)
5. **Status Management**: Update order status dropdown

**Order Status Options**:
- Pending
- Processing
- Shipped
- Delivered
- Cancelled

**Order Display Interface**:
```typescript
interface OrderDisplay {
  _id: string;
  orderId: string;
  username: string;
  email: string;
  mobile: string;
  items: Array<{
    dishName: string;
    quantity: number;
    price: number;
    coverImage: string;
    cuisine: string;
  }>;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  billingAddress: string;
  orderDate: Date;
}
```

**Status Update Flow**:
```
Admin changes status dropdown
    ↓
PUT /order/updateOrder/:id
  { orderStatus: newStatus }
    ↓
Success → Show toast
Error → Reload orders (revert)
```

**Modals**:
1. **View Items Modal**: Shows dish images, names, quantities, prices
2. **View Profile Modal**: Shows customer name, email, phone, addresses

#### Admin View Reviews Component
**File**: `src/app/components/admin/admin-view-reviews/admin-view-reviews.ts`

**Purpose**: Monitor all reviews across platform

**Features**:
1. **Search**: Filter by dish name or username
2. **Sort**: By review date (ascending/descending)
3. **Pagination**: 6 reviews per page
4. **Actions**:
   - View dish details (modal)
   - View user details (modal)

**Review Display**:
- Star rating (1-5 stars displayed as ★)
- Review text
- Reviewer username
- Dish name
- Review date

**Data Fetching**:
```
GET /review/getAllReviews
    ↓
Populate user and dish references
    ↓
Map to ReviewDisplay interface:
  {
    _id, dishName, rating, reviewText,
    date, username, userId, dishId
  }
```

---

### 6.3 User Components

#### User Navigation Component
**File**: `src/app/components/user/user-nav/user-nav.ts`

**Purpose**: Navigation bar for user pages

**Features**:
1. **Cart Badge**: Shows total item count
2. **Cart Overlay**: Quick view of cart items
3. **Navigation**: Dishes, Orders, My Reviews
4. **Logout**: With confirmation popup

**Cart Management**:
```typescript
// Load cart from localStorage
loadCart() {
  const cartString = localStorage.getItem('cart');
  this.cartItems = JSON.parse(cartString) || [];
  this.cartItemCount = this.cartItems.reduce(
    (sum, item) => sum + item.quantity, 0
  );
}

// Listen for cart updates (cross-tab sync)
window.addEventListener('storage', (event) => {
  if (event.key === 'cart') {
    this.loadCart();
  }
});

// Listen for same-tab updates
window.addEventListener('cartUpdated', () => {
  this.loadCart();
});
```

**Cart Overlay Features**:
- Display all cart items with names and quantities
- "Clear Cart" button (with confirmation)
- "Proceed to Checkout" button → Navigate to `/user/checkout`

#### User View Dishes Component
**File**: `src/app/components/user/user-view-dishes/user-view-dishes.ts`

**Purpose**: Browse and order dishes

**Features**:
1. **Search**: Filter by dish name or description
2. **Pagination**: 6 dishes per page
3. **Quantity Selection**: +/- buttons (max 10)
4. **Add to Cart**: Add selected quantity to cart
5. **View Reviews**: Show all reviews for dish (modal)
6. **Write Review**: Navigate to review form

**Dish Display** (only shows available dishes):
```typescript
this.dishes = data
  .filter(dish => dish.isAvailable)
  .map(dish => ({
    id: dish._id,
    name: dish.dishName,
    cuisine: dish.cuisine,
    description: dish.description,
    price: dish.price,
    availability: 'Available',
    image: dish.coverImage
  }));
```

**Add to Cart Flow**:
```
User selects quantity (1-10)
    ↓
Click "Add to Cart"
    ↓
Get existing cart from localStorage
    ↓
Check if item already exists:
  - Exists → Add to existing quantity
  - New → Push new item
    ↓
Save cart to localStorage:
  [{
    dishId: "...",
    dishName: "...",
    quantity: 2
  }]
    ↓
Dispatch 'cartUpdated' event
    ↓
Show success toast
Reset quantity to 0
```

**Reviews Modal**:
```
Click "View Reviews"
    ↓
GET /review/getReviewsByDishId/:dishId
    ↓
Display modal with:
  - Dish name
  - All reviews (username, rating stars, comment, date)
  - "Write Review" button
```

#### Checkout Component
**File**: `src/app/components/user/checkout/checkout.ts`

**Purpose**: Finalize order and place it

**Cart Display**:
- Fetches actual prices from dishes API
- Displays each item: name, quantity, price, subtotal
- Calculates total amount

**Form Fields**:
- Shipping Address (required)
- Billing Address (required)

**Order Placement Flow**:
```
Load cart from localStorage
    ↓
GET /dish/getAllDishes (to get current prices)
    ↓
Map cart items with prices
Calculate totalAmount
    ↓
User fills addresses
    ↓
Click "Place Order"
    ↓
Validate addresses and cart not empty
    ↓
Get userId from localStorage
    ↓
POST /order/addOrder:
  {
    user: userId,
    orderItems: [{ dish, quantity }, ...],
    shippingAddress,
    billingAddress
  }
    ↓
Success:
  - Clear cart from localStorage
  - Dispatch 'cartUpdated' event
  - Show success toast
  - Navigate to /user/orders
```

**Price Calculation**:
```typescript
this.totalAmount = this.cartItems.reduce((sum, item) => {
  return sum + (item.price || 0) * item.quantity;
}, 0);
```

#### User View Orders Component
**File**: `src/app/components/user/user-view-orders/user-view-orders.ts`

**Purpose**: View order history and track orders

**Features**:
1. **Order List**: All user's orders
2. **Track Order**: Status tracking modal
3. **View Items**: Order items modal
4. **Cancel Order**: Only for "Pending" status

**Data Loading**:
```
Get userId from localStorage
    ↓
GET /order/getOrdersByUserId/:userId
    ↓
Map to OrderDisplay with populated items
```

**Order Tracking Modal**:
- Shows progress bar with steps:
  1. Pending
  2. Accepted
  3. Preparing
  4. Out For Delivery
  5. Delivered
- Highlights current step
- Shows completed steps in green

**Cancel Order Flow**:
```
Click "Cancel Order"
    ↓
Check status === 'Pending'
  (only pending orders can be cancelled)
    ↓
Show confirmation modal
    ↓
Confirm → DELETE /order/deleteOrder/:id
    ↓
Success:
  - Remove from local orders array
  - Show success toast
```

#### User Review Component
**File**: `src/app/components/user/user-review/user-review.ts`

**Purpose**: Write a review for a dish

**Form Fields**:
- Rating (1-5 stars with emoji feedback)
  - 1 star: 😡 (Very Bad)
  - 2 stars: 😞 (Bad)
  - 3 stars: 😐 (OK)
  - 4 stars: 😊 (Good)
  - 5 stars: 🤩 (Excellent)
- Review Text (optional)

**Review Submission Flow**:
```
Get dishId from route params
Get userId from localStorage
    ↓
User selects rating (click on stars)
User writes review text
    ↓
Click "Submit Review"
    ↓
Validate: rating > 0 && reviewText not empty
    ↓
POST /review/addReview:
  {
    reviewText,
    rating,
    user: userId,
    dish: dishId,
    date: new Date()
  }
    ↓
Success:
  - Show success toast
  - Reset form
  - Wait 2 seconds
  - Navigate to /user/my-reviews
```

#### User My Reviews Component
**File**: `src/app/components/user/user-my-review/user-my-review.ts`

**Purpose**: View and manage user's own reviews

**Features**:
1. **Review List**: All reviews by current user
2. **View Dish**: Dish details modal
3. **Delete Review**: With confirmation modal

**Data Loading**:
```
Get userId from localStorage
    ↓
GET /review/getReviewsByUserId/:userId
    ↓
Map to ReviewDisplay:
  {
    _id, dishName, dishId,
    rating, reviewText, date
  }
```

**Delete Review Flow**:
```
Click "Delete" button
    ↓
Show confirmation modal
    ↓
Confirm → DELETE /review/deleteReview/:id
    ↓
Success:
  - Remove from local reviews array
  - Show success toast
```

**View Dish Modal**:
- Shows dish image, name, description, price, cuisine
- Triggered by clicking dish name in review

---

## 7. Complete User Workflows

### 7.1 New User Registration & First Order

**Step-by-Step Process**:

1. **Visit Home Page** (`/home`)
   - View featured dishes
   - Click "Get Started" or "Login"

2. **Navigate to Signup** (`/signup`)
   - Fill registration form:
     - Username: "Jane Smith"
     - Email: "jane@example.com"
     - Phone: "9876543210"
     - Password: "securePass123"
     - Confirm Password: "securePass123"
     - Role: "User"
   - Submit form
   - Wait for success message
   - Auto-redirect to login page

3. **Login** (`/login`)
   - Enter email: "jane@example.com"
   - Enter password: "securePass123"
   - Submit
   - System stores JWT token and user data in localStorage
   - Auto-redirect to `/user` (User View Dishes page)

4. **Browse Dishes** (`/user`)
   - Search for "Tikka"
   - View filtered results
   - Click "View Reviews" on Chicken Tikka
   - Read existing reviews in modal

5. **Add Items to Cart**
   - Increment quantity to 2 using + button
   - Click "Add to Cart"
   - See success toast: "Added 2 Chicken Tikka to cart!"
   - Notice cart badge updates to "2"
   - Browse more dishes
   - Add "Margherita Pizza" (quantity: 1)
   - Cart badge now shows "3"

6. **Review Cart**
   - Click cart icon in navigation
   - Cart overlay appears showing:
     - Chicken Tikka x2
     - Margherita Pizza x1
   - Click "Proceed to Checkout"

7. **Checkout** (`/user/checkout`)
   - Review order summary:
     - Chicken Tikka x2 @ $15.99 = $31.98
     - Margherita Pizza x1 @ $12.99 = $12.99
     - Total: $44.97
   - Enter Shipping Address: "456 Elm St, Brooklyn, NY 11201"
   - Enter Billing Address: "456 Elm St, Brooklyn, NY 11201"
   - Click "Place Order"
   - System creates order in database
   - Cart cleared
   - Success toast: "Order placed successfully!"
   - Auto-redirect to `/user/orders`

8. **View Order Status** (`/user/orders`)
   - See newly placed order with status "Pending"
   - Click "Track Order"
   - Modal shows progress: Step 1/5 (Pending)
   - Click "View Items"
   - Modal shows order details with dish images

9. **Write Review** (after receiving order)
   - Navigate back to dishes (`/user`)
   - Find "Chicken Tikka"
   - Click "Write Review"
   - Redirect to `/user/review/:dishId`
   - Select 5 stars (🤩 Excellent)
   - Write review: "Absolutely delicious! Best tikka I've ever had."
   - Submit review
   - Success toast
   - Auto-redirect to `/user/my-reviews`

10. **View My Reviews** (`/user/my-reviews`)
    - See all submitted reviews
    - Click on dish name to view dish details
    - Option to delete review if needed

### 7.2 Admin Order Management Workflow

**Step-by-Step Process**:

1. **Login as Admin** (`/login`)
   - Enter admin credentials
   - Auto-redirect to `/admin/dashboard`

2. **View Dashboard** (`/admin/dashboard`)
   - See statistics:
     - Total Users: 15
     - Total Dishes: 23
     - Total Orders: 47
     - Total Reviews: 89
   - View list of all registered users

3. **Manage Dishes** (`/admin/dishes`)
   - Click "Dishes" in navigation
   - Search for "Pizza"
   - Filter by cuisine: "Italian"
   - View filtered dishes
   - Click "Edit" on "Margherita Pizza"

4. **Edit Dish** (`/admin/dishes/edit/:id`)
   - Update price from $12.99 to $13.99
   - Optionally upload new image
   - Toggle availability if needed
   - Click "Update Dish"
   - Success toast
   - Redirect back to dishes list

5. **Add New Dish** (`/admin/dishes/add`)
   - Fill form:
     - Dish Name: "Butter Chicken"
     - Description: "Tender chicken in rich tomato cream sauce"
     - Cuisine: "Indian"
     - Price: $16.99
     - Availability: ✓
   - Upload image (validates: JPG/PNG, max 5MB)
   - Click "Add Dish"
   - Success toast: "Dish Added Successfully!"
   - Redirect to dishes list

6. **Process Orders** (`/admin/orders`)
   - Click "Orders" in navigation
   - Sort by date: "Descending" (newest first)
   - Search by customer name: "Jane"
   - Find Jane's order (status: "Pending")
   - Click "View Profile" to see customer details
   - Click "View Items" to see order contents
   - Update status dropdown to "Processing"
   - System auto-saves
   - Success toast: "Order status updated successfully!"

7. **Continue Order Processing**
   - Later, update status to "Shipped"
   - Customer can now track: Step 3/5 (Shipped)
   - Finally, update to "Delivered"
   - Order lifecycle complete

8. **Monitor Reviews** (`/admin/reviews`)
   - Click "Reviews" in navigation
   - Search for dish: "Tikka"
   - View all reviews for Tikka dishes
   - Click username to view user profile
   - Click dish name to view dish details
   - Sort by date to see recent reviews

### 7.3 Password Reset Workflow

1. **Forgot Password** (`/forgot-password`)
   - User clicks "Forgot Password" on login page
   - Enter email: "jane@example.com"
   - Enter new password: "newSecurePass456"
   - Confirm new password: "newSecurePass456"
   - Click "Reset Password"
   - System updates password hash in database
   - Success toast: "Password reset successful!"
   - Auto-redirect to `/login`

2. **Login with New Password**
   - Enter email and new password
   - Successfully login

---

## 8. Detailed Feature Explanation

### 8.1 Shopping Cart System

**Implementation**: Client-side using `localStorage`

**Data Structure**:
```typescript
interface CartItem {
  dishId: string;      // Reference to dish
  dishName: string;    // For display
  quantity: number;    // Selected quantity
}

// Stored as:
localStorage.setItem('cart', JSON.stringify([
  { dishId: "64abc", dishName: "Chicken Tikka", quantity: 2 },
  { dishId: "64def", dishName: "Pizza", quantity: 1 }
]));
```

**Cart Operations**:

1. **Add to Cart**:
```typescript
const cart = JSON.parse(localStorage.getItem('cart') || '[]');
const existingIndex = cart.findIndex(item => item.dishId === dishId);

if (existingIndex >= 0) {
  cart[existingIndex].quantity += quantity;  // Update existing
} else {
  cart.push({ dishId, dishName, quantity }); // Add new
}

localStorage.setItem('cart', JSON.stringify(cart));
window.dispatchEvent(new CustomEvent('cartUpdated')); // Notify components
```

2. **Update Cart Badge**:
```typescript
loadCart() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  this.cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
}
```

3. **Clear Cart**:
```typescript
localStorage.removeItem('cart');
window.dispatchEvent(new CustomEvent('cartUpdated'));
```

**Cross-Tab Synchronization**:
```typescript
// Sync cart across multiple tabs
window.addEventListener('storage', (event) => {
  if (event.key === 'cart') {
    this.loadCart(); // Reload cart when changed in another tab
  }
});
```

**Real-Time Updates**:
- Custom event `cartUpdated` dispatched on every cart modification
- Navigation component listens and updates badge immediately
- Cart overlay refreshes when opened

### 8.2 Order Processing System

**Order Creation Process** (Backend):

```javascript
// Step 1: Create base order
const newOrder = new Order({
  user: userId,
  orderItems: [],
  totalAmount: 0,
  orderStatus: "Pending",
  shippingAddress,
  billingAddress
});
await newOrder.save();

// Step 2: Process each cart item
let totalAmount = 0;
const orderItemIds = [];

for (const item of cartItems) {
  // Fetch current dish details
  const dish = await Dish.findById(item.dish);
  
  // Validate availability
  if (!dish.isAvailable) {
    throw new Error(`Dish ${dish.dishName} is unavailable`);
  }
  
  // Create OrderItem (captures price at order time)
  const orderItem = new OrderItem({
    dish: dish._id,
    quantity: item.quantity,
    price: dish.price,      // Historical price record
    order: newOrder._id
  });
  
  await orderItem.save();
  orderItemIds.push(orderItem._id);
  totalAmount += dish.price * item.quantity;
}

// Step 3: Update order with totals
newOrder.orderItems = orderItemIds;
newOrder.totalAmount = totalAmount;
await newOrder.save();
```

**Why Store Price in OrderItem?**
- Prices may change after order is placed
- OrderItem captures historical price for accurate records
- Allows dish price updates without affecting past orders

**Order Status Lifecycle**:
```
Pending → Processing → Shipped → Delivered
              ↓
          Cancelled (from Pending only)
```

### 8.3 Review System

**Review Submission**:
```javascript
POST /review/addReview
{
  reviewText: "Great taste!",
  rating: 5,              // 1-5 stars
  user: "userId",         // Who wrote it
  dish: "dishId"          // What they're reviewing
}
```

**Review Display** (with population):
```javascript
await Review.find()
  .populate("user", "username email")
  .populate("dish", "dishName price coverImage");
```

**Rating System**:
- 1 star: 😡 Very dissatisfied
- 2 stars: 😞 Disappointed
- 3 stars: 😐 Average
- 4 stars: 😊 Satisfied
- 5 stars: 🤩 Excellent

**Review Constraints**:
- User must be logged in
- Can review any dish
- Can have multiple reviews (no uniqueness constraint)
- Can delete their own reviews

### 8.4 Image Handling

**Upload Process** (Frontend):
```typescript
onFileChange(event: any) {
  const file = event.target.files[0];
  
  // 1. Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!validTypes.includes(file.type)) {
    this.errors.coverImage = 'Invalid file type';
    return;
  }
  
  // 2. Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    this.errors.coverImage = 'File too large';
    return;
  }
  
  // 3. Convert to base64
  const reader = new FileReader();
  reader.onload = (e: any) => {
    this.imagePreview = e.target.result;  // For preview
    this.imageBase64 = e.target.result;   // For API
  };
  reader.readAsDataURL(file);
}
```

**Storage**:
- Images stored as base64 strings in MongoDB
- Format: `data:image/jpeg;base64,/9j/4AAQSkZJRg...`
- Pros: Simple, no separate file storage needed
- Cons: Increases database size, slower for large images

**Display**:
```html
<img [src]="dish.coverImage" alt="dish image" />
<!-- Directly renders base64 string -->
```

### 8.5 Authentication & Authorization

**JWT Token Generation**:
```javascript
const token = jwt.sign(
  {
    userId: user._id,
    email: user.email,
    userRole: user.userRole
  },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

**Token Storage** (Frontend):
```typescript
localStorage.setItem('user', JSON.stringify({
  userId: "...",
  email: "...",
  role: "Admin" | "User",
  username: "...",
  token: "JWT_TOKEN"
}));
```

**Token Transmission**:
```typescript
// In ApiService
private getHeaders(): HttpHeaders {
  let headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  
  const userString = localStorage.getItem('user');
  if (userString) {
    const user = JSON.parse(userString);
    if (user.token) {
      headers = headers.set('Authorization', `Bearer ${user.token}`);
    }
  }
  
  return headers;
}
```

**Token Verification** (Backend Middleware):
```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ 
      error: true, 
      message: 'Access denied. No token provided.' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // { userId, email, userRole }
    next();
  } catch (error) {
    res.status(403).json({ 
      error: true, 
      message: 'Invalid or expired token.' 
    });
  }
};
```

**Role-Based Access**:
```javascript
const requireAdmin = (req, res, next) => {
  if (req.user.userRole !== 'admin') {
    return res.status(403).json({ 
      error: true, 
      message: 'Access denied. Admin privileges required.' 
    });
  }
  next();
};

// Usage:
router.post('/addDish', authenticateToken, requireAdmin, addDish);
```

**Note**: Currently, the middleware is defined but not applied to most routes. Consider adding it for production security.

### 8.6 Real-Time Notifications

**Toast Notifications** (ngx-toastr):
```typescript
// Configuration in app.module.ts
ToastrModule.forRoot({
  timeOut: 3000,
  positionClass: 'toast-top-right',
  preventDuplicates: true
})

// Usage in components
this.toastr.success('Order placed successfully!');
this.toastr.error('Failed to load data');
this.toastr.warning('Please login first');
this.toastr.info('Processing your request');
```

**Custom Toasts**:
```typescript
// In some components (legacy pattern)
showToast: boolean = false;
toastMessage: string = '';
toastType: 'success' | 'error' = 'success';

displayToast(message: string, type: 'success' | 'error') {
  this.toastMessage = message;
  this.toastType = type;
  this.showToast = true;
  
  setTimeout(() => {
    this.showToast = false;
  }, 3000);
}
```

---

## 9. Authentication & Authorization

### User Roles

1. **Admin Role**:
   - Full access to admin panel
   - Can create, update, delete dishes
   - Can view all orders and update status
   - Can view all reviews
   - Cannot place orders as customer

2. **User Role**:
   - Can browse dishes
   - Can add items to cart and place orders
   - Can view own order history
   - Can write and delete own reviews
   - No access to admin panel

### Route Protection

**Frontend Routes** (app-routing.module.ts):
```typescript
{
  path: 'admin/dashboard',
  component: DashboardComponent
  // Note: No route guard currently implemented
}
```

**Current Authentication**:
- Navigation components check localStorage for user
- Redirect to `/login` if no user found
- No Angular route guards implemented
- Consider adding `AuthGuard` and `AdminGuard` for production

**Suggested Implementation**:
```typescript
// auth.guard.ts
canActivate(): boolean {
  const user = localStorage.getItem('user');
  if (user) {
    return true;
  }
  this.router.navigate(['/login']);
  return false;
}

// admin.guard.ts
canActivate(): boolean {
  const userString = localStorage.getItem('user');
  if (userString) {
    const user = JSON.parse(userString);
    if (user.role === 'Admin') {
      return true;
    }
  }
  this.router.navigate(['/login']);
  return false;
}
```

---

## 10. Data Flow Diagrams

### 10.1 User Registration Flow

```
┌────────────┐     1. Submit Form      ┌────────────┐
│            │ ──────────────────────> │            │
│   Signup   │                         │  Backend   │
│ Component  │                         │ Controller │
│            │                         │            │
└────────────┘                         └─────┬──────┘
      ↑                                      │
      │                                      │ 2. Hash Password
      │                                      ↓
      │                                ┌──────────┐
      │                                │  bcrypt  │
      │                                └────┬─────┘
      │                                     │
      │                                     │ 3. Save User
      │                                     ↓
      │                                ┌─────────────┐
      │                                │   MongoDB   │
      │                                │    Users    │
      │                                └──────┬──────┘
      │                                       │
      │ 4. Success Response                   │
      │ <──────────────────────────────────── │
      │
      │ 5. Navigate to /login
      ↓
┌────────────┐
│   Login    │
│ Component  │
└────────────┘
```

### 10.2 Order Placement Flow

```
┌──────────────┐  1. Submit Order   ┌────────────────┐
│   Checkout   │ ─────────────────> │ Order          │
│  Component   │                    │ Controller     │
└──────────────┘                    └────────┬───────┘
       ↑                                     │
       │                                     │ 2. Create Order
       │                                     ↓
       │                             ┌───────────────┐
       │                             │   MongoDB     │
       │                             │   Orders      │
       │                             └───────┬───────┘
       │                                     │
       │                                     │ 3. For each item
       │                                     ↓
       │                             ┌───────────────┐
       │                             │   Fetch Dish  │
       │                             │   (validate)  │
       │                             └───────┬───────┘
       │                                     │
       │                                     │ 4. Create OrderItem
       │                                     ↓
       │                             ┌───────────────┐
       │                             │   MongoDB     │
       │                             │  OrderItems   │
       │                             └───────┬───────┘
       │                                     │
       │                                     │ 5. Update Order
       │                                     │    (add items, total)
       │                                     ↓
       │                             ┌───────────────┐
       │                             │   MongoDB     │
       │                             │   Orders      │
       │ 6. Order Confirmation       └───────┬───────┘
       │ <─────────────────────────────────  │
       │
       │ 7. Clear cart, Navigate to orders
       ↓
┌──────────────┐
│ User View    │
│   Orders     │
└──────────────┘
```

### 10.3 Review Submission Flow

```
┌──────────────┐  1. Submit Review  ┌────────────────┐
│ User Review  │ ─────────────────> │   Review       │
│  Component   │                    │  Controller    │
└──────────────┘                    └────────┬───────┘
       ↑                                     │
       │                                     │ 2. Create Review
       │                                     ↓
       │                             ┌───────────────┐
       │                             │   MongoDB     │
       │                             │   Reviews     │
       │                             │               │
       │                             │ {             │
       │                             │   user: ref,  │
       │                             │   dish: ref,  │
       │                             │   rating: 5,  │
       │                             │   text: "..." │
       │                             │ }             │
       │                             └───────┬───────┘
       │ 3. Success Response                │
       │ <──────────────────────────────────│
       │
       │ 4. Navigate to /user/my-reviews
       ↓
┌──────────────┐
│ User My      │
│  Reviews     │
└──────────────┘
```

---

## Summary

**Meal Magic** is a comprehensive food ordering platform with:

✅ **Full-Stack Architecture**: Angular + Node.js/Express + MongoDB  
✅ **Role-Based Access**: Admin and User roles with different capabilities  
✅ **Complete CRUD Operations**: For dishes, orders, reviews  
✅ **Real-Time Cart**: Client-side cart with cross-tab synchronization  
✅ **Order Lifecycle**: From pending to delivered with tracking  
✅ **Review System**: 5-star ratings with text reviews  
✅ **Image Handling**: Base64 encoding for dish images  
✅ **JWT Authentication**: Token-based auth with 24-hour expiration  
✅ **Responsive UI**: Angular Material components with custom styling  
✅ **Toast Notifications**: ngx-toastr for user feedback  

**Key Workflows**:
1. User Registration → Login → Browse → Add to Cart → Checkout → Place Order → Track Order
2. Admin Login → Manage Dishes → Process Orders → Monitor Reviews
3. User writes reviews after ordering

This documentation provides a complete understanding of the system architecture, data flow, and functionality of the Meal Magic Angular application.

