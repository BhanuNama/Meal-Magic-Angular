# Meal Magic Angular - Complete API & Service Documentation

## Table of Contents
1. [Overview](#overview)
2. [Backend API Architecture](#backend-api-architecture)
3. [Complete API Reference](#complete-api-reference)
4. [Frontend Service Layer](#frontend-service-layer)
5. [Database Models](#database-models)
6. [Authentication & Security](#authentication--security)
7. [Error Handling](#error-handling)
8. [Usage Examples](#usage-examples)

---

## 1. Overview

### System Architecture
```
┌──────────────────────────────────────────┐
│   Angular Frontend (Port 4200)          │
│   ┌────────────────────────────────────┐ │
│   │  Components                        │ │
│   │    ↓ Uses                          │ │
│   │  Services (user, dish, order, etc) │ │
│   │    ↓ Calls                         │ │
│   │  ApiService (Base HTTP Client)     │ │
│   └────────────────────────────────────┘ │
└──────────────────┬───────────────────────┘
                   │
                   │ HTTP/REST API (JSON)
                   │ JWT Bearer Token
                   │
┌──────────────────▼───────────────────────┐
│   Node.js/Express Backend (Port 3001)   │
│   ┌────────────────────────────────────┐ │
│   │  Routes (userRoutes, etc)          │ │
│   │    ↓ Routes to                     │ │
│   │  Controllers (business logic)      │ │
│   │    ↓ Uses                          │ │
│   │  Models (Mongoose schemas)         │ │
│   └────────────────────────────────────┘ │
└──────────────────┬───────────────────────┘
                   │
                   │ Mongoose ODM
                   │
┌──────────────────▼───────────────────────┐
│   MongoDB Database (Atlas)               │
│   Collections: users, dishes, orders,   │
│   orderitems, reviews                    │
└──────────────────────────────────────────┘
```

### Technology Stack

**Backend:**
- **Runtime:** Node.js
- **Framework:** Express 5.1.0
- **Database:** MongoDB with Mongoose 8.19.2
- **Authentication:** JWT (jsonwebtoken 9.0.2)
- **Password Hashing:** bcrypt 6.0.0
- **CORS:** cors 2.8.5
- **Body Parser:** 50MB limit for base64 images
- **Environment Variables:** dotenv 17.2.3

**Frontend:**
- **Framework:** Angular 16.2.12
- **HTTP Client:** @angular/common/http
- **Service Architecture:** Dependency Injection pattern
- **State Management:** localStorage for cart and auth

---

## 2. Backend API Architecture

### Server Configuration

**File:** `backend/index.js`

```javascript
// Base URL: http://localhost:3001
const PORT = process.env.PORT || 3001;

// CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:4200',  // Angular dev server
    'http://127.0.0.1:4200'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Payload Limits (for base64 images)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
```

### API Endpoints Structure

```
Base URL: http://localhost:3001

/health                     - Health check endpoint
/user/*                     - User authentication & management
/dish/*                     - Dish catalog management
/order/*                    - Order processing
/review/*                   - Review system
```

### Middleware Available

**File:** `backend/middleware/auth.js`

```javascript
// JWT Token Authentication
authenticateToken(req, res, next) {
  // Extracts and verifies JWT token from Authorization header
  // Sets req.user with decoded token data
  // Returns 401 if no token, 403 if invalid/expired
}

// Admin Role Verification
requireAdmin(req, res, next) {
  // Checks if req.user.userRole === 'admin'
  // Returns 403 if not admin
}
```

**Note:** Middleware is defined but NOT currently applied to most routes. Consider adding for production.

---

## 3. Complete API Reference

### 3.1 USER API ENDPOINTS

#### Base Path: `/user`

---

#### POST `/user/register`
**Purpose:** Register a new user account

**Authentication:** None required

**Request Body:**
```json
{
  "username": "John Doe",
  "email": "john@example.com",
  "mobileNumber": "1234567890",
  "password": "securePassword123",
  "userRole": "User"
}
```

**Validation Rules:**
- All fields required
- Email must be unique
- Email must match regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Password hashed with bcrypt (10 salt rounds)

**Success Response (201):**
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

**Error Responses:**
- `400` - Missing required fields
- `400` - Email already exists
- `500` - Server error

**Controller:** `userController.register`

**Process Flow:**
1. Validate all required fields present
2. Check email uniqueness in database
3. Hash password using bcrypt (10 rounds)
4. Create new User document
5. Save to MongoDB
6. Return user data (password excluded)

---

#### POST `/user/login`
**Purpose:** Authenticate user and generate JWT token

**Authentication:** None required

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
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

**JWT Token Structure:**
```json
{
  "userId": "64abc123...",
  "email": "john@example.com",
  "userRole": "User",
  "iat": 1640000000,
  "exp": 1640086400
}
```

**Token Expiration:** 24 hours

**Error Responses:**
- `400` - Email or password missing
- `401` - Invalid email or password
- `500` - Server error

**Controller:** `userController.login`

**Process Flow:**
1. Validate email and password provided
2. Find user by email
3. Compare password hash using bcrypt
4. Generate JWT token (24h expiration)
5. Return token and user data

---

#### PUT `/user/resetPassword`
**Purpose:** Reset user password

**Authentication:** None required (should be protected in production)

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "newSecurePassword456"
}
```

**Success Response (200):**
```json
{
  "error": false,
  "message": "Password has been updated successfully",
  "data": null
}
```

**Error Responses:**
- `400` - Email or password missing
- `404` - User not found
- `500` - Server error

**Controller:** `userController.resetPassword`

**Process Flow:**
1. Validate email and password
2. Find user by email
3. Hash new password with bcrypt (10 rounds)
4. Update user password
5. Save to database

---

#### GET `/user/getAllUsers`
**Purpose:** Retrieve all users

**Authentication:** Should require admin (not currently enforced)

**Request:** No body required

**Success Response (200):**
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
    },
    {
      "_id": "64abc456...",
      "username": "Jane Smith",
      "email": "jane@example.com",
      "mobileNumber": "9876543210",
      "userRole": "Admin"
    }
  ]
}
```

**Note:** Password field excluded from response

**Error Responses:**
- `500` - Server error

**Controller:** `userController.getAllUsers`

---

#### GET `/user/getUserById/:id`
**Purpose:** Retrieve specific user details

**Authentication:** None required

**URL Parameters:**
- `id` - MongoDB ObjectId of user

**Example:** `GET /user/getUserById/64abc123...`

**Success Response (200):**
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

**Error Responses:**
- `404` - User not found
- `500` - Server error

**Controller:** `userController.getUserById`

---

### 3.2 DISH API ENDPOINTS

#### Base Path: `/dish`

---

#### POST `/dish/addDish`
**Purpose:** Create a new dish (Admin operation)

**Authentication:** Should require admin token (not currently enforced)

**Request Body:**
```json
{
  "dishName": "Chicken Tikka Masala",
  "description": "Tender chicken pieces in creamy tomato-based curry sauce",
  "cuisine": "Indian",
  "price": 15.99,
  "isAvailable": true,
  "coverImage": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Field Requirements:**
- `dishName`: String, required, trimmed
- `description`: String, required, trimmed
- `cuisine`: String, required, trimmed
- `price`: Number, required, min: 0
- `isAvailable`: Boolean, default: true
- `coverImage`: String (base64 encoded), required

**Image Requirements:**
- Format: JPG, JPEG, or PNG
- Max Size: 5MB
- Encoding: Base64 string with data URI prefix

**Success Response (201):**
```json
{
  "message": "Dish Added Successfully",
  "dish": {
    "_id": "64def456...",
    "dishName": "Chicken Tikka Masala",
    "description": "Tender chicken pieces in creamy tomato-based curry sauce",
    "cuisine": "Indian",
    "price": 15.99,
    "isAvailable": true,
    "coverImage": "data:image/jpeg;base64,...",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Validation error
- `500` - Server error

**Controller:** `dishController.addDish`

---

#### GET `/dish/getAllDishes`
**Purpose:** Retrieve all dishes

**Authentication:** None required

**Request:** No body or parameters

**Success Response (200):**
```json
[
  {
    "_id": "64def456...",
    "dishName": "Chicken Tikka Masala",
    "description": "Tender chicken pieces...",
    "cuisine": "Indian",
    "price": 15.99,
    "isAvailable": true,
    "coverImage": "data:image/jpeg;base64,...",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "64def789...",
    "dishName": "Margherita Pizza",
    "description": "Classic pizza with...",
    "cuisine": "Italian",
    "price": 12.99,
    "isAvailable": true,
    "coverImage": "data:image/jpeg;base64,...",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
]
```

**Error Responses:**
- `500` - Server error

**Controller:** `dishController.getAllDishes`

**Frontend Usage:** 
- Home page displays all available dishes
- Admin views all dishes for management
- User views only dishes with `isAvailable: true`

---

#### GET `/dish/getDishById/:id`
**Purpose:** Retrieve specific dish details

**Authentication:** None required

**URL Parameters:**
- `id` - MongoDB ObjectId of dish

**Example:** `GET /dish/getDishById/64def456...`

**Success Response (200):**
```json
{
  "_id": "64def456...",
  "dishName": "Chicken Tikka Masala",
  "description": "Tender chicken pieces in creamy tomato-based curry sauce",
  "cuisine": "Indian",
  "price": 15.99,
  "isAvailable": true,
  "coverImage": "data:image/jpeg;base64,...",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `404` - Dish not found with given ID
- `500` - Server error

**Controller:** `dishController.getDishById`

---

#### PUT `/dish/updateDish/:id`
**Purpose:** Update existing dish (Admin operation)

**Authentication:** Should require admin token (not currently enforced)

**URL Parameters:**
- `id` - MongoDB ObjectId of dish

**Request Body:** (All fields optional, only include fields to update)
```json
{
  "dishName": "Chicken Tikka Masala (Updated)",
  "description": "New description",
  "cuisine": "Indian",
  "price": 16.99,
  "isAvailable": false,
  "coverImage": "data:image/jpeg;base64,..."
}
```

**Success Response (200):**
```json
{
  "message": "Dish Updated Successfully",
  "dish": {
    "_id": "64def456...",
    "dishName": "Chicken Tikka Masala (Updated)",
    "description": "New description",
    "cuisine": "Indian",
    "price": 16.99,
    "isAvailable": false,
    "coverImage": "data:image/jpeg;base64,...",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T14:45:00.000Z"
  }
}
```

**Error Responses:**
- `404` - Dish not found with given ID
- `500` - Server error

**Controller:** `dishController.updateDish`

**Notes:**
- Uses Mongoose `findByIdAndUpdate` with `{new: true}` option
- Returns updated document
- Frontend sends complete dish object even for partial updates

---

#### DELETE `/dish/deleteDish/:id`
**Purpose:** Delete a dish (Admin operation)

**Authentication:** Should require admin token (not currently enforced)

**URL Parameters:**
- `id` - MongoDB ObjectId of dish

**Example:** `DELETE /dish/deleteDish/64def456...`

**Success Response (200):**
```json
{
  "message": "Dish Deleted Successfully"
}
```

**Error Responses:**
- `404` - Dish not found with given ID
- `500` - Server error

**Controller:** `dishController.deleteDish`

**Warning:** No cascade delete - OrderItems may still reference deleted dish

---

### 3.3 ORDER API ENDPOINTS

#### Base Path: `/order`

---

#### POST `/order/addOrder`
**Purpose:** Create a new order from cart items

**Authentication:** Should require user token (not currently enforced)

**Request Body:**
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

**Validation:**
- `user`: MongoDB ObjectId, required
- `orderItems`: Array with at least 1 item, required
- Each item: `{dish: ObjectId, quantity: Number}`
- `shippingAddress`: String, required
- `billingAddress`: String, required

**Success Response (201):**
```json
{
  "message": "Order Placed Successfully",
  "order": {
    "_id": "64ghi012...",
    "totalAmount": 44.97,
    "orderStatus": "Pending",
    "createdAt": "2024-01-15T14:30:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing required fields or empty order
- `404` - Dish not found
- `400` - Dish unavailable
- `500` - Server error

**Controller:** `orderController.addOrder`

**Complex Business Logic:**

1. **Create Base Order** (totalAmount: 0, status: "Pending")
```javascript
const newOrder = new Order({
  user: new mongoose.Types.ObjectId(user),
  orderItems: [],
  totalAmount: 0,
  orderStatus: "Pending",
  shippingAddress,
  billingAddress
});
await newOrder.save();
```

2. **Process Each Cart Item**
```javascript
for (const item of orderItems) {
  // a) Fetch dish from database
  const dish = await Dish.findById(item.dish);
  
  // b) Validate dish exists
  if (!dish) throw Error("Dish not found");
  
  // c) Validate dish available
  if (!dish.isAvailable) throw Error("Dish unavailable");
  
  // d) Create OrderItem (captures current price)
  const orderItem = new OrderItem({
    dish: dish._id,
    quantity: item.quantity,
    price: dish.price,  // ← Historical price record
    order: newOrder._id
  });
  await orderItem.save();
  
  // e) Accumulate total
  totalAmount += dish.price * item.quantity;
  orderItemIds.push(orderItem._id);
}
```

3. **Update Order with Totals**
```javascript
newOrder.orderItems = orderItemIds;
newOrder.totalAmount = totalAmount;
await newOrder.save();
```

**Key Design Decision:**
- Price stored in OrderItem preserves historical pricing
- If dish price changes later, past orders remain accurate
- OrderItem acts as snapshot of dish at order time

---

#### GET `/order/getAllOrders`
**Purpose:** Retrieve all orders (Admin function)

**Authentication:** Should require admin token (not currently enforced)

**Request:** No body or parameters

**Success Response (200):**
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
      },
      {
        "_id": "64jkl678...",
        "quantity": 1,
        "price": 12.99,
        "dish": {
          "dishName": "Margherita Pizza",
          "cuisine": "Italian",
          "coverImage": "data:image/jpeg;base64,...",
          "price": 12.99
        }
      }
    ],
    "totalAmount": 44.97,
    "orderStatus": "Pending",
    "shippingAddress": "123 Main St, Apt 4B, New York, NY 10001",
    "billingAddress": "123 Main St, Apt 4B, New York, NY 10001",
    "orderDate": "2024-01-15T14:30:00.000Z",
    "createdAt": "2024-01-15T14:30:00.000Z",
    "updatedAt": "2024-01-15T14:30:00.000Z"
  }
]
```

**Mongoose Population:**
```javascript
Order.find({})
  .populate("user", "username email mobileNumber")
  .populate({
    path: "orderItems",
    populate: {
      path: "dish",
      select: "dishName cuisine coverImage price"
    }
  });
```

**Error Responses:**
- `500` - Server error

**Controller:** `orderController.getAllOrders`

---

#### GET `/order/getOrderById/:id`
**Purpose:** Retrieve specific order details

**Authentication:** Should verify user owns order or is admin

**URL Parameters:**
- `id` - MongoDB ObjectId of order

**Example:** `GET /order/getOrderById/64ghi012...`

**Success Response (200):**
```json
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
  "shippingAddress": "123 Main St, Apt 4B, New York, NY 10001",
  "billingAddress": "123 Main St, Apt 4B, New York, NY 10001",
  "orderDate": "2024-01-15T14:30:00.000Z",
  "createdAt": "2024-01-15T14:30:00.000Z",
  "updatedAt": "2024-01-15T14:30:00.000Z"
}
```

**Error Responses:**
- `404` - Order not found
- `500` - Server error

**Controller:** `orderController.getOrderById`

---

#### GET `/order/getOrdersByUserId/:userId`
**Purpose:** Retrieve all orders for a specific user

**Authentication:** Should verify requesting user matches userId or is admin

**URL Parameters:**
- `userId` - MongoDB ObjectId of user

**Example:** `GET /order/getOrdersByUserId/64abc123...`

**Success Response (200):**
```json
[
  {
    "_id": "64ghi012...",
    "user": {
      "username": "John Doe",
      "email": "john@example.com",
      "mobileNumber": "1234567890"
    },
    "orderItems": [...],
    "totalAmount": 44.97,
    "orderStatus": "Pending",
    "shippingAddress": "123 Main St...",
    "billingAddress": "123 Main St...",
    "orderDate": "2024-01-15T14:30:00.000Z",
    "createdAt": "2024-01-15T14:30:00.000Z",
    "updatedAt": "2024-01-15T14:30:00.000Z"
  }
]
```

**Error Responses:**
- `500` - Server error

**Controller:** `orderController.getOrdersByUserId`

**Frontend Usage:** User views their order history

---

#### PUT `/order/updateOrder/:id`
**Purpose:** Update order (typically for status changes)

**Authentication:** Admin for status changes, User for addresses

**URL Parameters:**
- `id` - MongoDB ObjectId of order

**Request Body:** (All fields optional)
```json
{
  "orderStatus": "Processing",
  "shippingAddress": "Updated address",
  "billingAddress": "Updated billing address"
}
```

**Order Status Enum:**
- `"Pending"` - Initial state
- `"Processing"` - Being prepared
- `"Shipped"` - Out for delivery
- `"Delivered"` - Completed
- `"Cancelled"` - Cancelled by user or admin

**Success Response (200):**
```json
{
  "message": "Order updated successfully",
  "order": {
    "_id": "64ghi012...",
    "user": {...},
    "orderItems": [...],
    "totalAmount": 44.97,
    "orderStatus": "Processing",
    "shippingAddress": "123 Main St...",
    "billingAddress": "123 Main St...",
    "orderDate": "2024-01-15T14:30:00.000Z",
    "createdAt": "2024-01-15T14:30:00.000Z",
    "updatedAt": "2024-01-15T15:00:00.000Z"
  }
}
```

**Error Responses:**
- `404` - Order not found
- `500` - Server error

**Controller:** `orderController.updateOrder`

**Business Rules:**
- Only provided fields are updated
- Status transitions should follow logical flow
- Frontend validates status changes

---

#### DELETE `/order/deleteOrder/:id`
**Purpose:** Cancel/delete an order

**Authentication:** User can delete own orders (if Pending), Admin can delete any

**URL Parameters:**
- `id` - MongoDB ObjectId of order

**Example:** `DELETE /order/deleteOrder/64ghi012...`

**Success Response (200):**
```json
{
  "message": "Order deleted successfully"
}
```

**Error Responses:**
- `404` - Order not found
- `500` - Server error

**Controller:** `orderController.deleteOrder`

**Important:** 
- Cascading delete implemented
- Deletes all OrderItems associated with order first
- Then deletes Order document
```javascript
// First delete all order items
await OrderItem.deleteMany({ order: req.params.id });
// Then delete the order
await Order.findByIdAndDelete(req.params.id);
```

**Frontend Usage:** User cancels pending order

---

### 3.4 REVIEW API ENDPOINTS

#### Base Path: `/review`

---

#### POST `/review/addReview`
**Purpose:** Submit a review for a dish

**Authentication:** Should require user token (not currently enforced)

**Request Body:**
```json
{
  "reviewText": "Absolutely delicious! The best tikka masala I've ever had.",
  "rating": 5,
  "user": "64abc123...",
  "dish": "64def456..."
}
```

**Field Requirements:**
- `reviewText`: String, optional, trimmed
- `rating`: Number, required, min: 1, max: 5
- `user`: MongoDB ObjectId, required
- `dish`: MongoDB ObjectId, required
- `date`: Date, auto-generated (default: Date.now)

**Success Response (201):**
```json
{
  "message": "Review Added Successfully",
  "review": {
    "_id": "64mno678...",
    "reviewText": "Absolutely delicious! The best tikka masala I've ever had.",
    "rating": 5,
    "user": "64abc123...",
    "dish": "64def456...",
    "date": "2024-01-15T16:00:00.000Z",
    "createdAt": "2024-01-15T16:00:00.000Z",
    "updatedAt": "2024-01-15T16:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Validation error (invalid rating)
- `500` - Server error

**Controller:** `reviewController.addReview`

**Frontend Rating System:**
- 1 star: 😡 Very dissatisfied
- 2 stars: 😞 Disappointed  
- 3 stars: 😐 Average
- 4 stars: 😊 Satisfied
- 5 stars: 🤩 Excellent

---

#### GET `/review/getAllReviews`
**Purpose:** Retrieve all reviews (Admin function)

**Authentication:** Should require admin token

**Request:** No body or parameters

**Success Response (200):**
```json
[
  {
    "_id": "64mno678...",
    "reviewText": "Absolutely delicious!",
    "rating": 5,
    "user": {
      "username": "John Doe",
      "email": "john@example.com",
      "mobileNumber": "1234567890"
    },
    "dish": {
      "dishName": "Chicken Tikka Masala",
      "description": "Tender chicken pieces...",
      "cuisine": "Indian",
      "price": 15.99,
      "availability": true,
      "coverImage": "data:image/jpeg;base64,..."
    },
    "date": "2024-01-15T16:00:00.000Z",
    "createdAt": "2024-01-15T16:00:00.000Z",
    "updatedAt": "2024-01-15T16:00:00.000Z"
  }
]
```

**Mongoose Population:**
```javascript
Review.find({})
  .populate("user", "username email mobileNumber")
  .populate("dish", "dishName description cuisine price availability coverImage");
```

**Error Responses:**
- `500` - Server error

**Controller:** `reviewController.getAllReviews`

---

#### GET `/review/getReviewById/:id`
**Purpose:** Retrieve specific review details

**Authentication:** None required

**URL Parameters:**
- `id` - MongoDB ObjectId of review

**Example:** `GET /review/getReviewById/64mno678...`

**Success Response (200):**
```json
{
  "_id": "64mno678...",
  "reviewText": "Absolutely delicious!",
  "rating": 5,
  "user": {
    "username": "John Doe",
    "email": "john@example.com",
    "mobileNumber": "1234567890"
  },
  "dish": {
    "dishName": "Chicken Tikka Masala",
    "description": "Tender chicken pieces...",
    "cuisine": "Indian",
    "price": 15.99,
    "availability": true,
    "coverImage": "data:image/jpeg;base64,..."
  },
  "date": "2024-01-15T16:00:00.000Z",
  "createdAt": "2024-01-15T16:00:00.000Z",
  "updatedAt": "2024-01-15T16:00:00.000Z"
}
```

**Error Responses:**
- `404` - Review not found
- `500` - Server error

**Controller:** `reviewController.getReviewById`

---

#### GET `/review/getReviewsByUserId/:userId`
**Purpose:** Retrieve all reviews by a specific user

**Authentication:** Should verify user or admin

**URL Parameters:**
- `userId` - MongoDB ObjectId of user

**Example:** `GET /review/getReviewsByUserId/64abc123...`

**Success Response (200):**
```json
[
  {
    "_id": "64mno678...",
    "reviewText": "Absolutely delicious!",
    "rating": 5,
    "user": {
      "username": "John Doe",
      "email": "john@example.com",
      "mobileNumber": "1234567890"
    },
    "dish": {
      "dishName": "Chicken Tikka Masala",
      "description": "Tender chicken pieces...",
      "cuisine": "Indian",
      "price": 15.99,
      "availability": true,
      "coverImage": "data:image/jpeg;base64,..."
    },
    "date": "2024-01-15T16:00:00.000Z",
    "createdAt": "2024-01-15T16:00:00.000Z",
    "updatedAt": "2024-01-15T16:00:00.000Z"
  }
]
```

**Error Responses:**
- `404` - No reviews found for user
- `500` - Server error

**Controller:** `reviewController.getReviewsByUserId`

**Frontend Usage:** User views their review history

---

#### GET `/review/getReviewsByDishId/:dishId`
**Purpose:** Retrieve all reviews for a specific dish

**Authentication:** None required

**URL Parameters:**
- `dishId` - MongoDB ObjectId of dish

**Example:** `GET /review/getReviewsByDishId/64def456...`

**Success Response (200):**
```json
[
  {
    "_id": "64mno678...",
    "reviewText": "Absolutely delicious!",
    "rating": 5,
    "user": {
      "username": "John Doe",
      "email": "john@example.com",
      "mobileNumber": "1234567890"
    },
    "dish": {
      "dishName": "Chicken Tikka Masala",
      "description": "Tender chicken pieces...",
      "cuisine": "Indian",
      "price": 15.99,
      "availability": true,
      "coverImage": "data:image/jpeg;base64,..."
    },
    "date": "2024-01-15T16:00:00.000Z",
    "createdAt": "2024-01-15T16:00:00.000Z",
    "updatedAt": "2024-01-15T16:00:00.000Z"
  },
  {
    "_id": "64mno789...",
    "reviewText": "Very good, will order again!",
    "rating": 4,
    "user": {
      "username": "Jane Smith",
      "email": "jane@example.com",
      "mobileNumber": "9876543210"
    },
    "dish": {
      "dishName": "Chicken Tikka Masala",
      "description": "Tender chicken pieces...",
      "cuisine": "Indian",
      "price": 15.99,
      "availability": true,
      "coverImage": "data:image/jpeg;base64,..."
    },
    "date": "2024-01-14T12:00:00.000Z",
    "createdAt": "2024-01-14T12:00:00.000Z",
    "updatedAt": "2024-01-14T12:00:00.000Z"
  }
]
```

**Error Responses:**
- `404` - No reviews found for dish
- `500` - Server error

**Controller:** `reviewController.getReviewsByDishId`

**Frontend Usage:** Display reviews on dish detail page

---

#### PUT `/review/updateReview/:id`
**Purpose:** Update an existing review

**Authentication:** Should verify user owns review

**URL Parameters:**
- `id` - MongoDB ObjectId of review

**Request Body:** (All fields optional)
```json
{
  "reviewText": "Updated review text",
  "rating": 4
}
```

**Success Response (200):**
```json
{
  "message": "Review Updated Successfully",
  "review": {
    "_id": "64mno678...",
    "reviewText": "Updated review text",
    "rating": 4,
    "user": "64abc123...",
    "dish": "64def456...",
    "date": "2024-01-15T16:00:00.000Z",
    "createdAt": "2024-01-15T16:00:00.000Z",
    "updatedAt": "2024-01-15T17:30:00.000Z"
  }
}
```

**Error Responses:**
- `404` - Review not found
- `500` - Server error

**Controller:** `reviewController.updateReview`

---

#### DELETE `/review/deleteReview/:id`
**Purpose:** Delete a review

**Authentication:** Should verify user owns review or is admin

**URL Parameters:**
- `id` - MongoDB ObjectId of review

**Example:** `DELETE /review/deleteReview/64mno678...`

**Success Response (200):**
```json
{
  "message": "Review Deleted Successfully"
}
```

**Error Responses:**
- `404` - Review not found
- `500` - Server error

**Controller:** `reviewController.deleteReview`

**Frontend Usage:** User deletes their own review from "My Reviews" page

---

## 4. Frontend Service Layer

### 4.1 Architecture Overview

The frontend uses Angular's Dependency Injection to provide services throughout the application.

```
Component Layer
     ↓ (injects)
Feature Services (UserService, DishService, OrderService, ReviewService)
     ↓ (uses)
Base ApiService
     ↓ (uses)
Angular HttpClient
     ↓
Backend REST API
```

### 4.2 Base API Service

**File:** `src/app/services/api.service.ts`

**Purpose:** Centralized HTTP communication with automatic JWT token injection

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:3001';
  
  constructor(private http: HttpClient) {}
  
  // Automatically adds JWT token to all requests
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
  
  // Generic HTTP methods
  get<T>(url: string): Observable<T>
  post<T>(url: string, data: any): Observable<T>
  put<T>(url: string, data: any): Observable<T>
  delete<T>(url: string): Observable<T>
}
```

**Key Features:**
1. **Automatic Authentication:** Reads JWT token from localStorage and adds to headers
2. **Type Safety:** Generic methods with TypeScript types
3. **Centralized Configuration:** Single baseUrl configuration
4. **Observable Pattern:** Returns RxJS Observables for reactive programming

**Header Structure:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 4.3 User Service

**File:** `src/app/services/user.service.ts`

**Purpose:** User authentication and management

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private apiService: ApiService) {}
  
  // User login
  login(credentials: LoginRequest): Observable<any> {
    return this.apiService.post<any>('/user/login', credentials);
  }
  
  // User signup/registration
  signup(user: User): Observable<any> {
    return this.apiService.post<any>('/user/register', user);
  }
  
  // Get all users (admin)
  getAllUsers(): Observable<User[]> {
    return this.apiService.get<User[]>('/user/getAllUsers');
  }
  
  // Get user by ID
  getUserById(id: string): Observable<User> {
    return this.apiService.get<User>(`/user/getUserById/${id}`);
  }
}
```

**Usage Example:**

```typescript
// In Login Component
constructor(private userService: UserService, private router: Router) {}

onLogin() {
  const credentials = {
    email: this.email,
    password: this.password
  };
  
  this.userService.login(credentials).subscribe({
    next: (response) => {
      // Store user data and token
      localStorage.setItem('user', JSON.stringify({
        userId: response.data.user.id,
        email: response.data.user.email,
        role: response.data.user.userRole,
        username: response.data.user.username,
        token: response.data.token
      }));
      
      // Navigate based on role
      if (response.data.user.userRole === 'Admin') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/user']);
      }
    },
    error: (error) => {
      console.error('Login failed:', error);
      this.showError('Invalid credentials');
    }
  });
}
```

---

### 4.4 Dish Service

**File:** `src/app/services/dish.service.ts`

**Purpose:** Dish catalog management

```typescript
@Injectable({ providedIn: 'root' })
export class DishService {
  constructor(private apiService: ApiService) {}
  
  // Get all dishes
  getAllDishes(): Observable<Dish[]> {
    return this.apiService.get<Dish[]>('/dish/getAllDishes');
  }
  
  // Get dish by ID
  getDishById(id: string): Observable<Dish> {
    return this.apiService.get<Dish>(`/dish/getDishById/${id}`);
  }
  
  // Add new dish (admin)
  addDish(dish: Dish): Observable<Dish> {
    return this.apiService.post<Dish>('/dish/addDish', dish);
  }
  
  // Update existing dish (admin)
  updateDish(id: string, dish: Dish): Observable<Dish> {
    return this.apiService.put<Dish>(`/dish/updateDish/${id}`, dish);
  }
  
  // Delete dish (admin)
  deleteDish(id: string): Observable<any> {
    return this.apiService.delete<any>(`/dish/deleteDish/${id}`);
  }
}
```

**Usage Example:**

```typescript
// In Admin View Dishes Component
constructor(private dishService: DishService, private toastr: ToastrService) {}

ngOnInit() {
  this.loadDishes();
}

loadDishes() {
  this.dishService.getAllDishes().subscribe({
    next: (data) => {
      this.dishes = data.map(dish => ({
        id: dish._id,
        name: dish.dishName,
        cuisine: dish.cuisine,
        description: dish.description,
        price: dish.price,
        availability: dish.isAvailable ? 'In Stock' : 'Out of Stock',
        image: dish.coverImage
      }));
    },
    error: (error) => {
      console.error('Error loading dishes:', error);
      this.toastr.error('Failed to load dishes');
    }
  });
}

deleteDish(dishId: string) {
  if (confirm('Are you sure you want to delete this dish?')) {
    this.dishService.deleteDish(dishId).subscribe({
      next: () => {
        this.dishes = this.dishes.filter(d => d.id !== dishId);
        this.toastr.success('Dish deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting dish:', error);
        this.toastr.error('Failed to delete dish');
      }
    });
  }
}
```

---

### 4.5 Order Service

**File:** `src/app/services/order.service.ts`

**Purpose:** Order processing and management

```typescript
@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private apiService: ApiService) {}
  
  // Get all orders (admin)
  getAllOrders(): Observable<Order[]> {
    return this.apiService.get<Order[]>('/order/getAllOrders');
  }
  
  // Get order by ID
  getOrderById(id: string): Observable<Order> {
    return this.apiService.get<Order>(`/order/getOrderById/${id}`);
  }
  
  // Add new order
  addOrder(order: Order): Observable<Order> {
    return this.apiService.post<Order>('/order/addOrder', order);
  }
  
  // Update existing order (status change)
  updateOrder(id: string, order: Order): Observable<Order> {
    return this.apiService.put<Order>(`/order/updateOrder/${id}`, order);
  }
  
  // Delete/cancel order
  deleteOrder(id: string): Observable<any> {
    return this.apiService.delete<any>(`/order/deleteOrder/${id}`);
  }
  
  // Get orders by user ID
  getOrdersByUserId(userId: string): Observable<Order[]> {
    return this.apiService.get<Order[]>(`/order/getOrdersByUserId/${userId}`);
  }
}
```

**Usage Example:**

```typescript
// In Checkout Component
constructor(
  private orderService: OrderService,
  private router: Router,
  private toastr: ToastrService
) {}

placeOrder() {
  const userString = localStorage.getItem('user');
  const user = JSON.parse(userString);
  
  const orderData = {
    user: user.userId,
    orderItems: this.cartItems.map(item => ({
      dish: item.dishId,
      quantity: item.quantity
    })),
    shippingAddress: this.shippingAddress,
    billingAddress: this.billingAddress
  };
  
  this.orderService.addOrder(orderData).subscribe({
    next: (response) => {
      // Clear cart
      localStorage.removeItem('cart');
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      // Show success and navigate
      this.toastr.success('Order placed successfully!');
      this.router.navigate(['/user/orders']);
    },
    error: (error) => {
      console.error('Error placing order:', error);
      this.toastr.error('Failed to place order');
    }
  });
}
```

---

### 4.6 Review Service

**File:** `src/app/services/review.service.ts`

**Purpose:** Review submission and retrieval

```typescript
@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor(private apiService: ApiService) {}
  
  // Get all reviews (admin)
  getAllReviews(): Observable<Review[]> {
    return this.apiService.get<Review[]>('/review/getAllReviews');
  }
  
  // Get review by ID
  getReviewById(id: string): Observable<Review> {
    return this.apiService.get<Review>(`/review/getReviewById/${id}`);
  }
  
  // Get reviews by user ID
  getReviewsByUserId(userId: string): Observable<Review[]> {
    return this.apiService.get<Review[]>(`/review/getReviewsByUserId/${userId}`);
  }
  
  // Get reviews by dish ID
  getReviewsByDishId(dishId: string): Observable<Review[]> {
    return this.apiService.get<Review[]>(`/review/getReviewsByDishId/${dishId}`);
  }
  
  // Add new review
  addReview(review: Review): Observable<Review> {
    return this.apiService.post<Review>('/review/addReview', review);
  }
  
  // Update existing review
  updateReview(id: string, review: Review): Observable<Review> {
    return this.apiService.put<Review>(`/review/updateReview/${id}`, review);
  }
  
  // Delete review
  deleteReview(id: string): Observable<any> {
    return this.apiService.delete<any>(`/review/deleteReview/${id}`);
  }
}
```

**Usage Example:**

```typescript
// In User Review Component
constructor(
  private reviewService: ReviewService,
  private route: ActivatedRoute,
  private router: Router,
  private toastr: ToastrService
) {}

ngOnInit() {
  this.dishId = this.route.snapshot.paramMap.get('dishId');
  const userString = localStorage.getItem('user');
  this.user = JSON.parse(userString);
}

submitReview() {
  if (this.rating === 0) {
    this.toastr.warning('Please select a rating');
    return;
  }
  
  if (!this.reviewText.trim()) {
    this.toastr.warning('Please write a review');
    return;
  }
  
  const reviewData = {
    reviewText: this.reviewText,
    rating: this.rating,
    user: this.user.userId,
    dish: this.dishId,
    date: new Date()
  };
  
  this.reviewService.addReview(reviewData).subscribe({
    next: (response) => {
      this.toastr.success('Review submitted successfully!');
      // Reset form
      this.rating = 0;
      this.reviewText = '';
      // Navigate to my reviews
      setTimeout(() => {
        this.router.navigate(['/user/my-reviews']);
      }, 2000);
    },
    error: (error) => {
      console.error('Error submitting review:', error);
      this.toastr.error('Failed to submit review');
    }
  });
}
```

---

## 5. Database Models

### 5.1 User Model

**File:** `backend/models/user.js`

```javascript
const mongoose = require('mongoose');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: emailRegex 
  },
  mobileNumber: { 
    type: String, 
    required: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  userRole: { 
    type: String, 
    required: true 
  }
});

module.exports = mongoose.model('User', userSchema);
```

**Schema Details:**
- **Collection Name:** `users`
- **Indexes:** Unique index on `email`
- **No Timestamps:** Schema doesn't use timestamps option

**Validation:**
- Email validated with regex
- All fields required
- Password stored as bcrypt hash (10 salt rounds)

**User Roles:**
- `"Admin"` - Full system access
- `"User"` - Customer access

---

### 5.2 Dish Model

**File:** `backend/models/dish.js`

```javascript
const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema(
  {
    dishName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    description: { 
      type: String, 
      required: true, 
      trim: true 
    },
    cuisine: { 
      type: String, 
      required: true, 
      trim: true 
    },
    price: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    isAvailable: { 
      type: Boolean, 
      default: true 
    },
    coverImage: { 
      type: String, 
      required: true 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dish', dishSchema);
```

**Schema Details:**
- **Collection Name:** `dishes`
- **Timestamps:** `createdAt`, `updatedAt` auto-generated
- **No Indexes:** Default `_id` index only

**Field Constraints:**
- `trim: true` removes whitespace from strings
- `price` must be >= 0
- `coverImage` stores base64 encoded string

**Common Cuisines:**
- Indian
- Italian
- Chinese
- Mexican
- American
- Thai
- Japanese

---

### 5.3 Order Model

**File:** `backend/models/Order.js`

```javascript
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderDate: {
      type: Date,
      default: Date.now
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]
    },
    shippingAddress: {
      type: String,
      required: true
    },
    billingAddress: {
      type: String,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    orderItems: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem"
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
```

**Schema Details:**
- **Collection Name:** `orders`
- **Timestamps:** `createdAt`, `updatedAt` auto-generated
- **References:** `user` (User model), `orderItems` (OrderItem model)

**Status Enum:**
1. `"Pending"` - Just placed, awaiting acceptance
2. `"Processing"` - Being prepared
3. `"Shipped"` - Out for delivery
4. `"Delivered"` - Successfully delivered
5. `"Cancelled"` - Cancelled by user or admin

**Relationship Diagram:**
```
User (1) ──────< Order (N)
Order (1) ──────< OrderItem (N)
OrderItem (N) ──────> Dish (1)
```

---

### 5.4 OrderItem Model

**File:** `backend/models/OrderItem.js`

```javascript
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 1
    },
    dish: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dish"
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderItem", orderItemSchema);
```

**Schema Details:**
- **Collection Name:** `orderitems`
- **Timestamps:** `createdAt`, `updatedAt` auto-generated
- **References:** `dish` (Dish model), `order` (Order model)

**Purpose:**
- Junction table for Order-Dish many-to-many relationship
- Captures **historical price** at time of order
- Stores quantity ordered

**Why Store Price?**
```
Current Dish Price: $15.99
User Orders 2x at $15.99 = $31.98

Later, Admin updates Dish Price: $17.99

OrderItem still shows:
  quantity: 2
  price: $15.99  ← Historical record
  Total: $31.98  ← Correct historical total
```

---

### 5.5 Review Model

**File:** `backend/models/review.js`

```javascript
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewText: {
      type: String,
      trim: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    date: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    dish: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dish",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
```

**Schema Details:**
- **Collection Name:** `reviews`
- **Timestamps:** `createdAt`, `updatedAt` auto-generated
- **References:** `user` (User model), `dish` (Dish model)

**Field Constraints:**
- `reviewText` optional (can rate without text)
- `rating` required, must be 1-5 stars
- `date` auto-generated

**Relationship Diagram:**
```
User (1) ──────< Review (N)
Dish (1) ──────< Review (N)
```

**No Uniqueness Constraint:**
- Same user CAN write multiple reviews for same dish
- Consider adding compound unique index in production:
  ```javascript
  reviewSchema.index({ user: 1, dish: 1 }, { unique: true });
  ```

---

### 5.6 Database Relationships Summary

```
┌──────────────────────────────────────────────────┐
│                    Users                         │
│  _id, username, email, password, role            │
└───┬──────────────────────────┬───────────────────┘
    │                          │
    │ (1:N)                    │ (1:N)
    │                          │
    ▼                          ▼
┌───────────────────┐    ┌──────────────────┐
│     Orders        │    │     Reviews      │
│  _id, date,       │    │  _id, text,      │
│  status, total,   │    │  rating, date    │
│  addresses        │    │                  │
└────┬──────────────┘    └────┬─────────────┘
     │ (1:N)                  │ (N:1)
     │                        │
     ▼                        │
┌──────────────────┐          │
│   OrderItems     │          │
│  _id, quantity,  │          │
│  price           │          │
└────┬─────────────┘          │
     │ (N:1)                  │
     │                        │
     └────────────┬───────────┘
                  │
                  ▼
            ┌──────────────────────┐
            │       Dishes         │
            │  _id, name, desc,    │
            │  cuisine, price,     │
            │  available, image    │
            └──────────────────────┘
```

**Relationship Summary:**
1. **User → Orders**: One user has many orders
2. **User → Reviews**: One user writes many reviews
3. **Order → OrderItems**: One order contains many order items
4. **OrderItem → Dish**: Many order items reference one dish
5. **Review → Dish**: Many reviews reference one dish
6. **OrderItem → Order**: Many order items belong to one order
7. **Review → User**: Many reviews written by one user

---

## 6. Authentication & Security

### 6.1 JWT Authentication Flow

**Complete Authentication Lifecycle:**

```
┌─────────────┐
│  1. SIGNUP  │
└──────┬──────┘
       │
       │ POST /user/register
       │ { username, email, password, ... }
       ▼
┌────────────────────┐
│  Backend:          │
│  - Validate email  │
│  - Hash password   │
│  - Save user       │
└──────┬─────────────┘
       │
       │ { error: false, message: "Success" }
       ▼
┌─────────────┐
│  2. LOGIN   │
└──────┬──────┘
       │
       │ POST /user/login
       │ { email, password }
       ▼
┌────────────────────────────┐
│  Backend:                  │
│  - Find user by email      │
│  - Compare password hash   │
│  - Generate JWT token      │
│    Payload: {              │
│      userId, email, role   │
│    }                       │
│    Secret: JWT_SECRET      │
│    Expiry: 24h             │
└──────┬─────────────────────┘
       │
       │ { token: "eyJ...", user: {...} }
       ▼
┌────────────────────────────┐
│  Frontend:                 │
│  - Store in localStorage:  │
│    {                       │
│      userId, email, role,  │
│      username, token       │
│    }                       │
│  - Navigate based on role  │
└──────┬─────────────────────┘
       │
       │ User browses app
       ▼
┌─────────────────────────────┐
│  3. AUTHENTICATED REQUEST   │
└──────┬──────────────────────┘
       │
       │ GET /order/getOrdersByUserId/123
       │ Headers: {
       │   Authorization: "Bearer eyJ..."
       │ }
       ▼
┌────────────────────────────────┐
│  Backend Middleware:           │
│  (if authenticateToken used)   │
│  - Extract token from header   │
│  - Verify token with JWT_SECRET│
│  - Decode payload              │
│  - Set req.user = decoded      │
│  - Call next()                 │
└──────┬─────────────────────────┘
       │
       │ Token valid
       ▼
┌────────────────────────────────┐
│  Controller:                   │
│  - Access req.user.userId      │
│  - Process request             │
│  - Return response             │
└──────┬─────────────────────────┘
       │
       │ { orders: [...] }
       ▼
┌─────────────────────────────────┐
│  Frontend:                      │
│  - Receive response             │
│  - Update UI                    │
└─────────────────────────────────┘
```

### 6.2 Password Security

**Hashing Process:**

```javascript
// Registration
const password = "userPassword123";
const saltRounds = 10;  // 2^10 = 1024 iterations
const hashedPassword = await bcrypt.hash(password, saltRounds);
// Result: $2b$10$xyz...abc (60 characters)

// Storage in DB
{
  "_id": "64abc",
  "email": "user@example.com",
  "password": "$2b$10$xyz...abc",  // Hashed
  ...
}

// Login Verification
const inputPassword = "userPassword123";
const storedHash = "$2b$10$xyz...abc";
const isMatch = await bcrypt.compare(inputPassword, storedHash);
// Returns: true if match, false otherwise
```

**Security Features:**
- **Salt:** Randomly generated per password
- **Rounds:** 10 rounds (good balance of security/performance)
- **One-way:** Cannot reverse hash to get original password
- **Timing-safe:** bcrypt.compare prevents timing attacks

### 6.3 Token Structure

**JWT Token Anatomy:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGFiYzEyMyIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInVzZXJSb2xlIjoiVXNlciIsImlhdCI6MTY0MDAwMDAwMCwiZXhwIjoxNjQwMDg2NDAwfQ.abcdef123456...

├─────────────────────────┬───────────────────────────────────────────────────────────────────────────┬─────────────────┐
│        HEADER           │                            PAYLOAD                                        │   SIGNATURE     │
│  {                      │  {                                                                        │  HMACSHA256(    │
│    "alg": "HS256",      │    "userId": "64abc123",                                                  │    base64Header.│
│    "typ": "JWT"         │    "email": "john@example.com",                                           │    base64Payload│
│  }                      │    "userRole": "User",                                                    │    JWT_SECRET   │
│                         │    "iat": 1640000000,      // Issued at                                   │  )              │
│                         │    "exp": 1640086400       // Expires (24h later)                         │                 │
│                         │  }                                                                        │                 │
└─────────────────────────┴───────────────────────────────────────────────────────────────────────────┴─────────────────┘
```

**Token Generation:**

```javascript
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  {
    userId: user._id,
    email: user.email,
    userRole: user.userRole
  },
  process.env.JWT_SECRET,  // Secret key from .env
  { expiresIn: '24h' }
);
```

**Token Verification:**

```javascript
const authenticateToken = (req, res, next) => {
  // Extract token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ 
      error: true, 
      message: 'Access denied. No token provided.' 
    });
  }
  
  try {
    // Verify and decode
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { userId, email, userRole, iat, exp }
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ 
      error: true, 
      message: 'Invalid or expired token.' 
    });
  }
};
```

### 6.4 Role-Based Access Control

**Admin Check Middleware:**

```javascript
const requireAdmin = (req, res, next) => {
  // Requires authenticateToken to run first
  if (req.user.userRole !== 'admin') {
    return res.status(403).json({ 
      error: true, 
      message: 'Access denied. Admin privileges required.' 
    });
  }
  next();
};

// Usage Example
router.post('/addDish', authenticateToken, requireAdmin, addDish);
router.delete('/deleteDish/:id', authenticateToken, requireAdmin, deleteDish);
```

**Frontend Role Check:**

```typescript
// In navigation guards or components
const userString = localStorage.getItem('user');
const user = JSON.parse(userString);

if (user.role === 'Admin') {
  // Show admin navigation
  this.router.navigate(['/admin/dashboard']);
} else {
  // Show user navigation
  this.router.navigate(['/user']);
}
```

### 6.5 Current Security Status

**⚠️ Important Notes:**

1. **Middleware Not Applied:**
   - `authenticateToken` and `requireAdmin` are defined
   - BUT most routes don't use them
   - Anyone can call any API endpoint

2. **Recommended Production Changes:**
   ```javascript
   // User routes
   router.get('/getAllUsers', authenticateToken, requireAdmin, getAllUsers);
   router.get('/getUserById/:id', authenticateToken, getUserById);
   
   // Dish routes
   router.post('/addDish', authenticateToken, requireAdmin, addDish);
   router.put('/updateDish/:id', authenticateToken, requireAdmin, updateDish);
   router.delete('/deleteDish/:id', authenticateToken, requireAdmin, deleteDish);
   
   // Order routes
   router.post('/addOrder', authenticateToken, addOrder);
   router.get('/getOrdersByUserId/:userId', authenticateToken, verifyOwnResource, getOrdersByUserId);
   router.put('/updateOrder/:id', authenticateToken, updateOrder);
   router.delete('/deleteOrder/:id', authenticateToken, verifyOwnResource, deleteOrder);
   
   // Review routes
   router.post('/addReview', authenticateToken, addReview);
   router.put('/updateReview/:id', authenticateToken, verifyOwnResource, updateReview);
   router.delete('/deleteReview/:id', authenticateToken, verifyOwnResource, deleteReview);
   ```

3. **Missing Features:**
   - No token refresh mechanism
   - No password reset via email
   - No account verification
   - No rate limiting
   - No input sanitization against XSS
   - No CSRF protection

4. **localStorage Considerations:**
   - Tokens stored in localStorage vulnerable to XSS
   - Consider httpOnly cookies for production
   - Implement token rotation

---

## 7. Error Handling

### 7.1 Backend Error Responses

**Standard Error Format:**

```json
{
  "error": true,
  "message": "Descriptive error message"
}
```

**Common HTTP Status Codes:**

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation error, missing fields |
| 401 | Unauthorized | No token provided |
| 403 | Forbidden | Invalid token or insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server/database error |

**Example Error Scenarios:**

```javascript
// 400 - Bad Request
{
  "error": true,
  "message": "All fields are required"
}

// 400 - Duplicate Entry
{
  "error": true,
  "message": "Email already exists"
}

// 401 - No Token
{
  "error": true,
  "message": "Access denied. No token provided."
}

// 403 - Invalid Token
{
  "error": true,
  "message": "Invalid or expired token."
}

// 404 - Not Found
{
  "error": true,
  "message": "Cannot find any dish with ID 64abc123"
}

// 404 - User Not Found
{
  "error": true,
  "message": "User not found"
}

// 500 - Server Error
{
  "error": true,
  "message": "MongoError: connection timeout"
}
```

### 7.2 Frontend Error Handling

**Service Layer Pattern:**

```typescript
// In Component
this.dishService.getDishById(id).subscribe({
  next: (dish) => {
    // Handle success
    this.dish = dish;
  },
  error: (error) => {
    // Handle error
    console.error('Error loading dish:', error);
    
    if (error.status === 404) {
      this.toastr.error('Dish not found');
      this.router.navigate(['/admin/dishes']);
    } else if (error.status === 500) {
      this.toastr.error('Server error. Please try again later.');
    } else {
      this.toastr.error('An error occurred');
    }
  }
});
```

**Global Error Handler (Optional):**

```typescript
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private toastr: ToastrService) {}
  
  handleError(error: any): void {
    console.error('Global error:', error);
    
    if (error instanceof HttpErrorResponse) {
      // HTTP errors
      if (error.status === 401) {
        // Token expired, redirect to login
        localStorage.clear();
        window.location.href = '/login';
      } else {
        this.toastr.error(error.message || 'An error occurred');
      }
    } else {
      // Client-side errors
      this.toastr.error('An unexpected error occurred');
    }
  }
}

// Register in AppModule
providers: [
  { provide: ErrorHandler, useClass: GlobalErrorHandler }
]
```

### 7.3 Validation Errors

**Backend Validation:**

```javascript
// userController.js
if (!username || !email || !mobileNumber || !password || !userRole) {
  return res.status(400).json({ 
    error: true, 
    message: 'All fields are required' 
  });
}

// dishController.js
if (!dish.dishName || !dish.price || price < 0) {
  return res.status(400).json({
    error: true,
    message: 'Invalid dish data'
  });
}
```

**Frontend Validation:**

```typescript
// Reactive Form Validation
this.signupForm = this.formBuilder.group({
  username: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
  password: ['', [Validators.required, Validators.minLength(8)]],
  confirmPassword: ['', Validators.required]
}, { validator: this.passwordMatchValidator });

// Custom Validator
passwordMatchValidator(control: AbstractControl) {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
  return null;
}

// Template Usage
<div *ngIf="signupForm.get('email').invalid && signupForm.get('email').touched">
  <p class="error">Please enter a valid email</p>
</div>
```

---

## 8. Usage Examples

### 8.1 Complete User Registration Flow

**Frontend Component:**

```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.html'
})
export class SignupComponent {
  signupForm: FormGroup;
  
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      userRole: ['User', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }
  
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }
  
  onSubmit() {
    if (this.signupForm.invalid) {
      this.toastr.warning('Please fill all fields correctly');
      return;
    }
    
    const userData = {
      username: this.signupForm.value.username,
      email: this.signupForm.value.email,
      mobileNumber: this.signupForm.value.mobileNumber,
      password: this.signupForm.value.password,
      userRole: this.signupForm.value.userRole
    };
    
    this.userService.signup(userData).subscribe({
      next: (response) => {
        if (!response.error) {
          this.toastr.success('Registration successful! Please login.');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        }
      },
      error: (error) => {
        console.error('Registration error:', error);
        if (error.error?.message === 'Email already exists') {
          this.toastr.error('Email already registered');
        } else {
          this.toastr.error('Registration failed. Please try again.');
        }
      }
    });
  }
}
```

**Backend Flow:**

```javascript
// backend/controllers/userController.js
exports.register = async (req, res) => {
  try {
    const { username, email, mobileNumber, password, userRole } = req.body;

    // 1. Validate required fields
    if (!username || !email || !mobileNumber || !password || !userRole) {
      return res.status(400).json({ 
        error: true, 
        message: 'All fields are required' 
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: true, 
        message: 'Email already exists' 
      });
    }

    // 3. Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Create new user
    const newUser = new User({
      username,
      email,
      mobileNumber,
      password: hashedPassword,
      userRole
    });

    await newUser.save();

    // 5. Return success (password excluded)
    res.status(201).json({ 
      error: false, 
      message: 'User Registration Successful', 
      data: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        userRole: newUser.userRole
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: true, 
      message: error.message 
    });
  }
};
```

### 8.2 Complete Order Placement Flow

**Frontend Checkout Component:**

```typescript
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DishService } from '../../../services/dish.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.html'
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  shippingAddress: string = '';
  billingAddress: string = '';
  totalAmount: number = 0;
  
  constructor(
    private dishService: DishService,
    private orderService: OrderService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  
  ngOnInit() {
    this.loadCart();
  }
  
  loadCart() {
    // 1. Get cart from localStorage
    const cartString = localStorage.getItem('cart');
    if (!cartString) {
      this.toastr.warning('Your cart is empty');
      this.router.navigate(['/user']);
      return;
    }
    
    const cart = JSON.parse(cartString);
    
    // 2. Fetch current prices from API
    this.dishService.getAllDishes().subscribe({
      next: (dishes) => {
        this.cartItems = cart.map((cartItem: any) => {
          const dish = dishes.find(d => d._id === cartItem.dishId);
          return {
            dishId: cartItem.dishId,
            dishName: cartItem.dishName,
            quantity: cartItem.quantity,
            price: dish?.price || 0,
            image: dish?.coverImage || ''
          };
        });
        
        // 3. Calculate total
        this.totalAmount = this.cartItems.reduce(
          (sum, item) => sum + (item.price * item.quantity), 
          0
        );
      },
      error: (error) => {
        console.error('Error loading dishes:', error);
        this.toastr.error('Failed to load cart items');
      }
    });
  }
  
  placeOrder() {
    // 1. Validate addresses
    if (!this.shippingAddress.trim() || !this.billingAddress.trim()) {
      this.toastr.warning('Please fill in both addresses');
      return;
    }
    
    // 2. Validate cart not empty
    if (this.cartItems.length === 0) {
      this.toastr.warning('Your cart is empty');
      return;
    }
    
    // 3. Get user from localStorage
    const userString = localStorage.getItem('user');
    if (!userString) {
      this.toastr.warning('Please login to place order');
      this.router.navigate(['/login']);
      return;
    }
    
    const user = JSON.parse(userString);
    
    // 4. Prepare order data
    const orderData = {
      user: user.userId,
      orderItems: this.cartItems.map(item => ({
        dish: item.dishId,
        quantity: item.quantity
      })),
      shippingAddress: this.shippingAddress,
      billingAddress: this.billingAddress
    };
    
    // 5. Submit order
    this.orderService.addOrder(orderData).subscribe({
      next: (response) => {
        // 6. Clear cart
        localStorage.removeItem('cart');
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        
        // 7. Show success and navigate
        this.toastr.success('Order placed successfully!');
        setTimeout(() => {
          this.router.navigate(['/user/orders']);
        }, 1500);
      },
      error: (error) => {
        console.error('Error placing order:', error);
        if (error.error?.message?.includes('unavailable')) {
          this.toastr.error('Some items are no longer available');
        } else {
          this.toastr.error('Failed to place order. Please try again.');
        }
      }
    });
  }
}
```

**Backend Order Controller:**

```javascript
// backend/controllers/orderController.js
exports.addOrder = async (req, res) => {
  try {
    const { orderItems, user, shippingAddress, billingAddress } = req.body;

    // 1. Validate request
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ 
        message: "Order must contain at least one item" 
      });
    }

    if (!user) {
      return res.status(400).json({ 
        message: "User ID is required" 
      });
    }

    // 2. Create base order
    const newOrder = new Order({
      user: new mongoose.Types.ObjectId(user),
      orderItems: [],
      totalAmount: 0,
      orderStatus: "Pending",
      shippingAddress,
      billingAddress
    });

    const savedOrder = await newOrder.save();

    // 3. Process each item
    let totalAmount = 0;
    const orderItemIds = [];

    for (const item of orderItems) {
      // a) Fetch dish
      const dish = await Dish.findById(item.dish);

      if (!dish) {
        return res.status(404).json({ 
          message: `Dish with ID ${item.dish} not found` 
        });
      }

      // b) Check availability
      if (!dish.isAvailable) {
        return res.status(400).json({ 
          message: `Dish ${dish.dishName} is currently unavailable` 
        });
      }

      // c) Create OrderItem with historical price
      const orderItem = new OrderItem({
        dish: dish._id,
        quantity: item.quantity,
        price: dish.price,  // Captures current price
        order: savedOrder._id
      });

      const savedItem = await orderItem.save();
      orderItemIds.push(savedItem._id);
      totalAmount += dish.price * item.quantity;
    }

    // 4. Update order with totals
    savedOrder.orderItems = orderItemIds;
    savedOrder.totalAmount = totalAmount;
    await savedOrder.save();

    // 5. Return confirmation
    res.status(201).json({ 
      message: "Order Placed Successfully", 
      order: {
        _id: savedOrder._id,
        totalAmount: savedOrder.totalAmount,
        orderStatus: savedOrder.orderStatus,
        createdAt: savedOrder.createdAt
      }
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: error.message });
  }
};
```

### 8.3 Image Upload Flow

**Frontend Dish Form:**

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DishService } from '../../../services/dish.service';

@Component({
  selector: 'app-dish-form',
  templateUrl: './dish-form.html'
})
export class DishFormComponent implements OnInit {
  dishName: string = '';
  description: string = '';
  cuisine: string = '';
  price: number = 0;
  isAvailable: boolean = true;
  imageBase64: string = '';
  imagePreview: string = '';
  isEditMode: boolean = false;
  dishId: string = '';
  
  cuisines = ['Indian', 'Italian', 'Chinese', 'Mexican', 'American', 'Thai', 'Japanese'];
  
  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}
  
  ngOnInit() {
    // Check if editing existing dish
    this.route.paramMap.subscribe(params => {
      this.dishId = params.get('id') || '';
      if (this.dishId) {
        this.isEditMode = true;
        this.loadDish();
      }
    });
  }
  
  loadDish() {
    this.dishService.getDishById(this.dishId).subscribe({
      next: (dish) => {
        this.dishName = dish.dishName;
        this.description = dish.description;
        this.cuisine = dish.cuisine;
        this.price = dish.price;
        this.isAvailable = dish.isAvailable;
        this.imagePreview = dish.coverImage;
        this.imageBase64 = dish.coverImage;
      },
      error: (error) => {
        console.error('Error loading dish:', error);
        this.toastr.error('Failed to load dish');
        this.router.navigate(['/admin/dishes']);
      }
    });
  }
  
  onFileChange(event: any) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // 1. Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      this.toastr.error('Only JPG and PNG images are allowed');
      return;
    }
    
    // 2. Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.toastr.error('Image size must be less than 5MB');
      return;
    }
    
    // 3. Convert to base64
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
      this.imageBase64 = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  
  onSubmit() {
    // 1. Validate form
    if (!this.dishName.trim()) {
      this.toastr.warning('Please enter dish name');
      return;
    }
    
    if (!this.description.trim()) {
      this.toastr.warning('Please enter description');
      return;
    }
    
    if (this.price <= 0) {
      this.toastr.warning('Price must be greater than 0');
      return;
    }
    
    if (!this.isEditMode && !this.imageBase64) {
      this.toastr.warning('Please upload an image');
      return;
    }
    
    // 2. Prepare dish data
    const dishData = {
      dishName: this.dishName,
      description: this.description,
      cuisine: this.cuisine,
      price: this.price,
      isAvailable: this.isAvailable,
      coverImage: this.imageBase64
    };
    
    // 3. Submit (add or update)
    if (this.isEditMode) {
      this.dishService.updateDish(this.dishId, dishData).subscribe({
        next: () => {
          this.toastr.success('Dish updated successfully!');
          this.router.navigate(['/admin/dishes']);
        },
        error: (error) => {
          console.error('Error updating dish:', error);
          this.toastr.error('Failed to update dish');
        }
      });
    } else {
      this.dishService.addDish(dishData).subscribe({
        next: () => {
          this.toastr.success('Dish added successfully!');
          this.router.navigate(['/admin/dishes']);
        },
        error: (error) => {
          console.error('Error adding dish:', error);
          this.toastr.error('Failed to add dish');
        }
      });
    }
  }
}
```

**Base64 Encoding Process:**

```
User selects file
      ↓
File object: { name, size, type, ... }
      ↓
FileReader.readAsDataURL(file)
      ↓
Converts to base64 string:
"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD..."
      ↓
Store in component variable
      ↓
Send to backend in JSON
      ↓
Store directly in MongoDB
```

---

## Summary

This comprehensive API and Service documentation covers:

✅ **Complete Backend API Reference** - All 26 endpoints with detailed request/response examples  
✅ **Frontend Service Layer** - ApiService and all feature services  
✅ **Database Models** - Complete Mongoose schemas with relationships  
✅ **Authentication Flow** - JWT generation, verification, and storage  
✅ **Security Analysis** - Current status and recommendations  
✅ **Error Handling** - Backend and frontend error patterns  
✅ **Usage Examples** - Real-world code for registration, ordering, and image upload  

**Key Takeaways:**

1. **API Architecture:** RESTful design with clear endpoint structure
2. **Authentication:** JWT-based with 24-hour expiration (middleware available but not enforced)
3. **Data Flow:** Angular services → ApiService → Express controllers → Mongoose models → MongoDB
4. **Image Handling:** Base64 encoding with 5MB limit and 50MB body parser
5. **Order System:** Complex multi-step process with historical price preservation
6. **Security Status:** Basic implementation present, production hardening needed

**Recommended Next Steps:**

1. Apply authentication middleware to protected routes
2. Implement role-based access control enforcement
3. Add input validation and sanitization
4. Consider moving images to file storage (S3, Cloudinary)
5. Implement token refresh mechanism
6. Add comprehensive error logging
7. Set up API rate limiting
8. Implement automated API testing

This documentation serves as the technical reference for understanding, maintaining, and extending the Meal Magic Angular application.

