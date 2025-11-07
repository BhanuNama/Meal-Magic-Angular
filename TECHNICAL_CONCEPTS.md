# Technical Concepts - Meal Magic Angular

## 1. JSON Parser 50 MB Limit

### What is it?
The 50 MB limit is configured in the Express backend body-parser middleware:

```javascript
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
```

This tells the server: **"Accept incoming HTTP request bodies up to 50 megabytes in size"**

### Why do we use it?
**Default limit is only 100 KB** - too small for our needs!

We need the higher limit because:
- **Base64 encoded images are LARGE** - A 1 MB image becomes ~1.3 MB in base64 (30% larger)
- Dish images can be up to 5 MB (which becomes ~6.5 MB in base64)
- Without this limit, uploading dish images would **fail immediately** with a 413 Payload Too Large error

### Example Size Comparison
| Original Image | Base64 Size | Accepted? |
|---------------|-------------|-----------|
| 1 MB | ~1.3 MB | ✅ Yes |
| 5 MB | ~6.5 MB | ✅ Yes |
| 40 MB | ~52 MB | ❌ No (exceeds 50MB) |

---

## 2. Image Upload Flow

### Complete Process

```
1️⃣ USER SELECTS IMAGE
   └─ Admin picks a dish photo (e.g., pizza.jpg - 2 MB)

2️⃣ FRONTEND CONVERTS TO BASE64
   └─ FileReader.readAsDataURL() converts binary → text
   └─ Result: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
   └─ Size: ~2.6 MB (30% larger!)

3️⃣ SEND TO BACKEND
   └─ POST /dish/addDish
   └─ JSON body contains the base64 string
   └─ Body-parser accepts it (because 2.6 MB < 50 MB ✓)

4️⃣ STORE IN MONGODB
   └─ Mongoose saves entire base64 string in coverImage field
   └─ No separate file storage needed!

5️⃣ DISPLAY IMAGE
   └─ Frontend receives base64 from API
   └─ Sets <img src="data:image/jpeg;base64,...">
   └─ Browser renders it directly!
```

### Frontend Implementation

```typescript
onFileChange(event: any) {
  const file = event.target.files[0];
  
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
    this.imageBase64 = e.target.result;
    // Result: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  };
  reader.readAsDataURL(file);
}
```

### Backend Storage

```javascript
const dishSchema = new mongoose.Schema({
  dishName: { type: String, required: true },
  description: { type: String, required: true },
  cuisine: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  isAvailable: { type: Boolean, default: true },
  coverImage: { 
    type: String,      // Stores base64 string directly
    required: true 
  }
}, { timestamps: true });
```

### Key Points

| Aspect | Details |
|--------|---------|
| **Image Format** | Base64 encoded string (not separate files) |
| **Max Image Size** | 5 MB per image (frontend validation) |
| **Why 50 MB limit** | Allows multiple large base64 images in one request |
| **Storage** | Direct in MongoDB (no AWS S3, no file system) |
| **Pros** | ✅ Simple, no external storage needed |
| **Cons** | ❌ Database gets large, slower queries |

---

## 3. JWT Token Generation

### Complete Flow

```
┌─────────────────────────────────────────────┐
│  1. USER LOGS IN                            │
│  POST /user/login                           │
│  { email, password }                        │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│  2. BACKEND VALIDATES                       │
│  - Find user by email                       │
│  - Compare password hash with bcrypt        │
│  - If valid → Generate token                │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│  3. GENERATE JWT TOKEN                      │
│  jwt.sign(payload, secret, options)         │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│  4. RETURN TO FRONTEND                      │
│  { token: "eyJ...", user: {...} }           │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│  5. STORE IN LOCALSTORAGE                   │
│  Frontend saves token                       │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│  6. USE IN FUTURE REQUESTS                  │
│  Authorization: Bearer <token>              │
└─────────────────────────────────────────────┘
```

### Token Generation Code

```javascript
// userController.js - login function

// After validating credentials
const token = jwt.sign(
  {                            // 📦 PAYLOAD (data to encode)
    userId: user._id,          // "64abc123..."
    email: user.email,         // "john@example.com"
    userRole: user.userRole    // "User" or "Admin"
  },
  process.env.JWT_SECRET,      // 🔑 SECRET KEY (from .env)
  { expiresIn: '24h' }         // ⏰ EXPIRES in 24 hours
);

// Return to frontend
res.status(200).json({ 
  error: false, 
  message: 'Login Successfully', 
  data: { token, user: {...} }
});
```

### Token Anatomy

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGFiYzEyMyIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInVzZXJSb2xlIjoiVXNlciIsImlhdCI6MTczMTAwODQwMCwiZXhwIjoxNzMxMDk0ODAwfQ.8x7kP2mL_3nQ9vR5zT1yK4wJ6aF8bE2cD

├─────────────────────────┬──────────────────────────────────────────┬─────────────────┐
│       HEADER            │              PAYLOAD                      │   SIGNATURE     │
│  {                      │  {                                        │                 │
│    "alg": "HS256",      │    "userId": "64abc123",                  │  HMACSHA256(    │
│    "typ": "JWT"         │    "email": "john@example.com",           │    header +     │
│  }                      │    "userRole": "User",                    │    payload,     │
│                         │    "iat": 1731008400,   ← Issued At      │    JWT_SECRET   │
│                         │    "exp": 1731094800    ← Expires (24h)  │  )              │
│                         │  }                                        │                 │
└─────────────────────────┴──────────────────────────────────────────┴─────────────────┘
```

### Token Verification

```javascript
// auth.js - authenticateToken middleware

const authenticateToken = (req, res, next) => {
  // 1. Extract token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ 
      error: true, 
      message: 'Access denied. No token provided.' 
    });
  }

  try {
    // 2. Verify with JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. decoded = { userId, email, userRole, iat, exp }
    req.user = decoded;  // ← Available in controller!
    next();              // ← Proceed to controller
    
  } catch (error) {
    // Token invalid or expired
    res.status(403).json({ 
      error: true, 
      message: 'Invalid or expired token.' 
    });
  }
};
```

### Frontend Usage

```typescript
// api.service.ts - Automatically adds token to all requests

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

### Token Lifecycle

| Phase | Action | Duration |
|-------|--------|----------|
| **Generation** | User logs in → Token created | Instant |
| **Storage** | Saved in localStorage | Until logout/clear |
| **Usage** | Sent with every API request | 24 hours |
| **Verification** | Backend validates each request | Instant |
| **Expiration** | Token becomes invalid | After 24 hours |
| **Renewal** | User must login again | Manual |

### Key Components

| Component | Purpose | Location |
|-----------|---------|----------|
| **jwt.sign()** | Creates the token | `userController.js` line 92 |
| **JWT_SECRET** | Secret key for signing | `.env` file |
| **Payload** | User data (userId, email, role) | Embedded in token |
| **Expiration** | 24 hours | Set at generation |
| **jwt.verify()** | Validates token | `auth.js` line 16 |
| **Storage** | localStorage | Frontend |

### Why JWT?

✅ **Stateless** - Server doesn't store sessions  
✅ **Self-contained** - Token has all user info  
✅ **Secure** - Signed with secret key (cannot be tampered)  
✅ **Expiring** - Automatically invalid after 24h  
✅ **Portable** - Works across devices/browsers  
✅ **Scalable** - No server-side session storage needed  

---

## Summary

### 50 MB Limit
- Maximum size of incoming HTTP request body
- Needed because base64 images are 30% larger than original files
- Default 100KB is too small for image uploads

### Image Upload
- Convert to base64 → Send in JSON → Store in MongoDB → Display directly
- No external file storage (S3, file system, etc.)
- Simple but makes database larger

### JWT Token
- Generated at login with user data (userId, email, role)
- Signed with secret key, expires in 24 hours
- Stored in localStorage, sent with every request
- Backend verifies signature and expiration
- Acts as a secure digital passport 🎫

---

**Your token is like a secure digital passport** - it proves who you are without the server needing to remember you! 🚀

