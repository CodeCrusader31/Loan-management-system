# Postman API Testing Guide

This guide provides the raw JSON payloads and route information to test all endpoints, controllers, and middleware (authentication, role-based access control, and schema validation) in Postman.

## Base URL
Assuming your server is running locally on port 5000 (or as configured in your `.env`):
`http://localhost:5000/api`

---

## 1. Authentication Routes (`/api/auth`)

These routes handle user registration and login. The `registerSchema` and `loginSchema` validation middleware are applied here.

### 1.1 Register User
- **Route:** `POST /api/auth/register`
- **Description:** Register a new user. You can test different roles to check RBAC later.
- **Headers:** `Content-Type: application/json`
- **Body (Raw JSON):**
```json
{
  "name": "John Doe",
  "email": "borrower@example.com",
  "password": "password123",
  "role": "BORROWER" 
}
```
*(Roles available: `ADMIN`, `SALES`, `SANCTION`, `DISBURSEMENT`, `COLLECTION`, `BORROWER`)*

### 1.2 Login
- **Route:** `POST /api/auth/login`
- **Description:** Login to get the JWT token.
- **Headers:** `Content-Type: application/json`
- **Body (Raw JSON):**
```json
{
  "email": "borrower@example.com",
  "password": "password123"
}
```
**Important:** Copy the `token` from the response. You will need to add it as a **Bearer Token** in the Authorization tab for all protected routes below.

### 1.3 Get Current User
- **Route:** `GET /api/auth/me`
- **Middleware:** `protect`
- **Headers:** `Authorization: Bearer <your_token>`

---

## 2. Application Routes (`/api/application`)

These routes require a Bearer token and the user must have the `BORROWER` role (`authorize('BORROWER')` middleware). Validation middleware `applicationSchema` is used here.

### 2.1 Submit Personal Details
- **Route:** `POST /api/application/personal-details`
- **Middleware:** `protect`, `authorize('BORROWER')`, `validate(applicationSchema)`
- **Headers:** `Authorization: Bearer <your_token>`, `Content-Type: application/json`
- **Body (Raw JSON):**
```json
{
  "fullName": "John Doe",
  "pan": "ABCDE1234F",
  "dob": "1990-01-01",
  "monthlySalary": 50000,
  "employmentMode": "SALARIED",
  "salarySlipUrl": "https://example.com/slip.pdf" 
}
```
*(Employment Modes: `SALARIED`, `SELF_EMPLOYED`, `UNEMPLOYED`)*

### 2.2 Upload Salary Slip
- **Route:** `POST /api/application/upload-slip`
- **Middleware:** `protect`, `authorize('BORROWER')`
- **Headers:** `Authorization: Bearer <your_token>`, `Content-Type: application/json`
- **Body (Raw JSON):**
```json
{
  "salarySlipUrl": "https://example.com/new-slip.pdf"
}
```

---

## 3. Loan Routes (`/api/loan`)

These routes require a Bearer token and the user must have the `BORROWER` role. Validation middleware `loanApplySchema` is used.

### 3.1 Apply For Loan
- **Route:** `POST /api/loan/apply`
- **Middleware:** `protect`, `authorize('BORROWER')`, `validate(loanApplySchema)`
- **Headers:** `Authorization: Bearer <your_token>`, `Content-Type: application/json`
- **Body (Raw JSON):**
```json
{
  "principalAmount": 100000,
  "tenureDays": 180
}
```

### 3.2 Get My Loans
- **Route:** `GET /api/loan/my-loans`
- **Middleware:** `protect`, `authorize('BORROWER')`
- **Headers:** `Authorization: Bearer <your_token>`

---

## 4. Dashboard Routes (`/api/dashboard`)

These routes simulate internal dashboards and require specific employee roles using the `authorize()` middleware. **You must login with a user that has the corresponding role (e.g., `ADMIN` or the specific department role) to access these.**

### 4.1 Sales Dashboard
- **Route:** `GET /api/dashboard/sales`
- **Middleware:** `protect`, `authorize('ADMIN', 'SALES')`
- **Headers:** `Authorization: Bearer <sales_or_admin_token>`
- **Description:** Returns users registered but who have not submitted an application yet.

### 4.2 Sanction Dashboard (View Applied Loans)
- **Route:** `GET /api/dashboard/sanction`
- **Middleware:** `protect`, `authorize('ADMIN', 'SANCTION')`
- **Headers:** `Authorization: Bearer <sanction_or_admin_token>`

### 4.3 Update Loan Sanction Status
- **Route:** `PATCH /api/dashboard/loan/:id/sanction` *(replace `:id` with actual loan ID)*
- **Middleware:** `protect`, `authorize('ADMIN', 'SANCTION')`
- **Headers:** `Authorization: Bearer <sanction_or_admin_token>`, `Content-Type: application/json`
- **Body (Raw JSON):**
```json
{
  "status": "SANCTIONED" 
}
```
*(Status can be `SANCTIONED` or `REJECTED`)*

### 4.4 Disbursement Dashboard
- **Route:** `GET /api/dashboard/disbursement`
- **Middleware:** `protect`, `authorize('ADMIN', 'DISBURSEMENT')`
- **Headers:** `Authorization: Bearer <disbursement_or_admin_token>`

### 4.5 Update Loan Disbursement Status
- **Route:** `PATCH /api/dashboard/loan/:id/disburse` *(replace `:id` with actual loan ID)*
- **Middleware:** `protect`, `authorize('ADMIN', 'DISBURSEMENT')`
- **Headers:** `Authorization: Bearer <disbursement_or_admin_token>`
- **Body:** *(No body required)*

### 4.6 Collection Dashboard
- **Route:** `GET /api/dashboard/collection`
- **Middleware:** `protect`, `authorize('ADMIN', 'COLLECTION')`
- **Headers:** `Authorization: Bearer <collection_or_admin_token>`

---

## 5. Payment Routes (`/api/payment`)

These routes handle loan repayment entries, managed by the Collection team.

### 5.1 Add Payment
- **Route:** `POST /api/payment/:loanId` *(replace `:loanId` with actual loan ID)*
- **Middleware:** `protect`, `authorize('ADMIN', 'COLLECTION')`, `validate(paymentSchema)`
- **Headers:** `Authorization: Bearer <collection_or_admin_token>`, `Content-Type: application/json`
- **Body (Raw JSON):**
```json
{
  "utrNumber": "UTR987654321",
  "amount": 5000
}
```

---

## Testing RBAC (Role-Based Access Control) & Validation Middleware
- **To test RBAC (`authorize`):** Try accessing the `POST /api/payment/:loanId` route using a token generated by a user with the `BORROWER` role. It should return a `403 Forbidden` error.
- **To test Validation (`validate`):** Try sending an invalid PAN format or missing required fields in `POST /api/application/personal-details`. It should return a `400 Bad Request` with specific validation error messages from Zod.
