# AgroFix - Bulk Vegetable and Fruit Ordering Platform

AgroFix is a full-stack web application that allows users to order vegetables and fruits in bulk. It features a user-friendly frontend and a robust backend API to manage products, orders, and admin functionalities.

---

## Live Demo

- **Frontend (Vercel)**: [https://agrofix-frontend-lemon.vercel.app/](https://agrofix-frontend-lemon.vercel.app/)


- **Backend (Vercel)**: [https://agrofix-backend-beta.vercel.app/](https://agrofix-backend-beta.vercel.app/)

---

## Tech Stack

### Frontend
- **Framework**: Next.js / React.js
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL (hosted on Neon.tech)
- **Deployment**: Vercel
- **Authentication**: Basic Admin Auth

---

## Folder Structure

### Frontend

```
/frontend
  /components
  /context
  /pages
  App.js
  index.js
```

### Backend

```
/backend
  /api
    index.js
  /prisma
  .env
  
```

---

## API Overview

### Base URLs

- **Local**: `http://localhost:5000/api`
- **Production**: `https://agrofix-backend-beta.vercel.app/api`

### Admin Routes

- Signup: `POST /admin/signup`
- Login: `POST /admin/login`
- Delete: `DELETE /admin/delete`
- Get All Orders: `GET /admin/orders`
- Update Order Status: `PUT /admin/orders/:id/status`

### User Routes

- Signup: `POST /user/signup`
- Login: `POST /user/login`
- Get Orders: `GET /user/orders?phone=xxx`
- Get Delivered Orders: `GET /user/orders?phone=xxx&status=delivered`

### Product Routes

- List Products: `GET /products`
- Add Product (Admin): `POST /products`
- Delete Product (Admin): `DELETE /products/:id`

### Orders

- Place Order: `POST /orders`

---

## How to Run Locally

### Backend

```bash
cd backend
npm install
npm start
```

Ensure you configure your `.env` with:

```
DATABASE_URL=your_neon_postgres_url
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Features

- User Signup/Login
- Admin Signup/Login
- Product Management (Admin)
- Place Orders (Users)
- Track Orders
- View All Orders (Admin)

---

## License

This project is licensed under the MIT License.