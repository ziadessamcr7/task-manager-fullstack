# Task Management API - Endpoints Documentation

**Base URL:** `http://localhost:3000`

---

## Authentication Endpoints

### 1. Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Name, email, and password are required"
}
```

---

### 2. Login User
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

---

## Task Endpoints (Protected - Requires JWT Token)

**All task endpoints require authentication. Include the JWT token in the Authorization header:**
```
Authorization: Bearer <your-jwt-token>
```

---

### 3. Get All Tasks
**GET** `/api/tasks`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Complete project",
      "description": "Finish the task management app",
      "status": "in_progress",
      "created_at": "2024-01-15 10:30:00"
    },
    {
      "id": 2,
      "user_id": 1,
      "title": "Review code",
      "description": null,
      "status": "pending",
      "created_at": "2024-01-15 11:00:00"
    }
  ]
}
```

---

### 4. Create Task
**POST** `/api/tasks`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Complete project",
  "description": "Finish the task management app",
  "status": "pending"
}
```

**Note:** 
- `title` is **required**
- `description` is optional
- `status` is optional (defaults to "pending"). Valid values: `"pending"`, `"in_progress"`, `"done"`

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "title": "Complete project",
    "description": "Finish the task management app",
    "status": "pending",
    "created_at": "2024-01-15 10:30:00"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Title is required"
}
```

---

### 5. Update Task
**PUT** `/api/tasks/:id`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "in_progress"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "title": "Updated title",
    "description": "Updated description",
    "status": "in_progress",
    "created_at": "2024-01-15 10:30:00"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Task not found"
}
```

---

### 6. Delete Task
**DELETE** `/api/tasks/:id`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Task not found"
}
```

---

## Health Check

### 7. Health Check
**GET** `/health`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## Error Responses

### Authentication Errors (401)
```json
{
  "success": false,
  "error": "Access token required"
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": "Route not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Frontend Integration Example

### Using Fetch API:

```javascript
// Base URL
const API_BASE_URL = 'http://localhost:3000';

// Register
const register = async (name, email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return await response.json();
};

// Login
const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return await response.json();
};

// Get Tasks (with token)
const getTasks = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/tasks`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};

// Create Task (with token)
const createTask = async (token, taskData) => {
  const response = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(taskData)
  });
  return await response.json();
};

// Update Task (with token)
const updateTask = async (token, taskId, taskData) => {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(taskData)
  });
  return await response.json();
};

// Delete Task (with token)
const deleteTask = async (token, taskId) => {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};
```

---

## Task Status Values

Valid status values for tasks:
- `"pending"` - Task is not started
- `"in_progress"` - Task is currently being worked on
- `"done"` - Task is completed

