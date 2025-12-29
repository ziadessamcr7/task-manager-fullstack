# Task Management Application

This project is a simple Task Management application built as part of a Junior Software Engineer technical assessment.

---

# Backend — Task Management API

## Tech Stack
- Node.js
- Express.js
- JWT Authentication
- SQLite
- bcrypt

## Features
- User registration and login
- JWT-based authentication
- CRUD operations for tasks
- Users can access only their own tasks

## Project Structure


backend/
├── src/
│ ├── routes/
│ ├── controllers/
│ ├── middleware/
│ ├── db/
│ └── app.js
│ └── server.js
├── package.json
└── README.md


## Environment Variables
Create a `.env` file inside the `backend` folder:
JWT_SECRET=your_jwt_secret_key

## Install & Run Backend
cd backend
npm install
npm start


The backend server will run on: http://localhost:3000




## API Endpoints

### Authentication
- POST `/api/auth/register`
- POST `/api/auth/login`

### Tasks (Protected Routes)
- GET `/api/tasks`
- POST `/api/tasks`
- PUT `/api/tasks/:id`
- DELETE `/api/tasks/:id`

## Authentication Details
Send the JWT token in request headers:
Authorization: Bearer <token



---

# Frontend — Task Management App

## Tech Stack
- React
- Vite
- Axios
- CSS

## Features
- User authentication
- Task list view
- Add, update, and delete tasks
- Protected routes
- Loading and error handling


## Project Structure

frontend/
├── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ ├── types/
│ └── App.jsx
├── package.json
└── README.md

## Environment Variables
Create a `.env` file inside the `frontend` folder:
VITE_API_URL=http://localhost:3000



## Install & Run Frontend
cd frontend
npm install
npm run dev

The frontend application will run on: http://localhost:5173


## API Integration
- REST API communication using Axios
- JWT token stored on login and sent with protected requests

## Notes
- UI is intentionally simple and clean.
- Deployment is optional as per the assessment requirements.

