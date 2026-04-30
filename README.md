# Loan Management System

A comprehensive, full-stack Loan Management System designed to handle the entire lifecycle of a loan, from borrower application to approval, disbursement, and collection. The system features a robust backend with Role-Based Access Control (RBAC) and a modern, responsive frontend.

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Form Handling & Validation:** React Hook Form, Zod
- **API Client:** Axios
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (with Mongoose)
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **Validation:** Zod
- **File Uploads:** Multer, Cloudinary
- **Security:** Helmet, Express Rate Limit, CORS

## 🔑 Roles & Permissions (RBAC)

The system is built around strict Role-Based Access Control to ensure users only see and interact with what they are authorized to:

- `BORROWER`: Can submit personal details, upload salary slips, apply for loans, and view their own loan status.
- `SALES`: Views users who have registered but haven't submitted a loan application yet.
- `SANCTION`: Reviews applied loans and can update their status to `SANCTIONED` or `REJECTED`.
- `DISBURSEMENT`: Views sanctioned loans and updates their status upon successful disbursement.
- `COLLECTION`: Manages repayments and records payments (with UTR numbers) for disbursed loans.
- `ADMIN`: Has overarching access to various dashboards and management features.

## 📂 Project Structure

This repository contains both the frontend and backend applications:

```text
Loan-Management/
├── frontend/       # Next.js application (App Router)
└── backend/        # Express.js RESTful API
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (v20.x recommended)
- MongoDB instance (local or Atlas)
- Cloudinary account (for file uploads)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` root and configure the following variables (example):
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` root and configure the backend API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 API Documentation

The backend includes a comprehensive Postman testing guide outlining all available endpoints, required roles, and expected payloads. 
Please refer to `backend/POSTMAN_GUIDE.md` for detailed API documentation and testing instructions.

## ✨ Key Features

- **Secure Authentication:** JWT-based login and registration.
- **Dynamic Dashboards:** Tailored views for Sales, Sanction, Disbursement, and Collection teams.
- **File Management:** Secure upload and retrieval of salary slips via Cloudinary.
- **Data Validation:** End-to-end type safety and schema validation using Zod on both client and server sides.
- **Responsive UI:** A modern, mobile-friendly interface crafted with Tailwind CSS.
