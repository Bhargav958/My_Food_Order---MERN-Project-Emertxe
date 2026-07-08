# My Food Order - MERN Food Ordering App

My Food Order is a full-stack food ordering application built with the MERN stack. It lets users browse restaurants, view menus, add food items to a cart, authenticate, make Stripe checkout payments, and view their order history.

## Features

- Restaurant listing and search
- Restaurant menu browsing
- Food item details with stock-aware cart controls
- User signup, login, logout, profile, and password reset flow
- JWT authentication with protected API routes
- Cart management with Redux and localStorage
- Stripe checkout payment flow
- Order creation after successful payment
- User order history
- Admin-protected restaurant, menu, and food item management APIs
- Cloudinary support for image uploads
- MongoDB/Mongoose database models

## Tech Stack

**Frontend**

- React
- Vite
- React Router
- Redux Toolkit
- Axios
- React Bootstrap
- Font Awesome

**Backend**

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Stripe
- Cloudinary
- Nodemailer
- Pug email templates

## Project Structure

```txt
My_Food_Order/
  backend/
    config/
    controllers/
    middlewares/
    models/
    routes/
    utils/
    view/
    app.js
    server.js
  frontend/
    public/
    src/
    index.html
    vite.config.js
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Bhargav958/My_Food_Order---MERN-Project-Emertxe.git
cd My_Food_Order---MERN-Project-Emertxe/My_Food_Order
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Environment Variables

Create this file:

```txt
backend/config/config.env
```

Example:

```env
NODE_ENV=DEVELOPMENT
PORT=4000
DB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES=7d
JWT_EXPIRES_TIME=7

FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

STRIPE_API_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_USERNAME=your_email_username
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=your_sender_email
```

Do not commit real API keys, database URLs, JWT secrets, or email passwords.

## Run the App Locally

### Start Backend

From `My_Food_Order/backend`:

```bash
npm start
```

The backend runs on the port from `backend/config/config.env`, for example:

```txt
http://localhost:4000
```

### Start Frontend

From `My_Food_Order/frontend`:

```bash
npm run dev
```

The frontend usually runs at:

```txt
http://localhost:5173
```

## Main Frontend Pages

- `/` - restaurant listing
- `/eats/stores/search/:keyword` - restaurant search
- `/eats/stores/:id/menus` - restaurant menus
- `/cart` - cart page
- `/users/login` - login
- `/users/signup` - signup
- `/success` - order success after Stripe checkout
- `/orders/me` - user order history

## Main API Routes

### Auth

- `POST /api/v1/users/signup`
- `POST /api/v1/users/login`
- `GET /api/v1/users/logout`
- `GET /api/v1/users/me`
- `PUT /api/v1/users/me/update`
- `PUT /api/v1/users/password/update`
- `POST /api/v1/users/forgetPassword`
- `PATCH /api/v1/users/resetPassword/:token`

### Restaurants and Menus

- `GET /api/v1/eats/stores`
- `POST /api/v1/eats/stores`
- `GET /api/v1/eats/stores/:storeId`
- `DELETE /api/v1/eats/stores/:storeId`
- `GET /api/v1/eats/menus`
- `POST /api/v1/eats/menus`
- `PATCH /api/v1/eats/menus/:menuId/addItem`
- `DELETE /api/v1/eats/menus/:menuId`

### Food Items

- `POST /api/v1/eats/item`
- `GET /api/v1/eats/items/:storeId`
- `GET /api/v1/eats/item/:foodId`
- `PATCH /api/v1/eats/item/:foodId`
- `DELETE /api/v1/eats/item/:foodId`

### Cart, Payments, and Orders

- `POST /api/v1/eats/cart/add-to-cart`
- `POST /api/v1/eats/cart/update-cart-item`
- `DELETE /api/v1/eats/cart/delete-cart-item`
- `GET /api/v1/eats/cart/get-cart`
- `POST /api/v1/payment/process`
- `GET /api/v1/stripeapi`
- `POST /api/v1/eats/orders/new`
- `GET /api/v1/eats/orders/me/myOrders`
- `GET /api/v1/eats/orders/:id`

## Git Push Checklist

Before pushing to GitHub:

```bash
git status
git add .
git commit -m "Initial commit"
git push -u origin main
```

If `git push -u origin main` says `src refspec main does not match any`, it means there is no commit yet. Create the first commit, then push again.

## Notes

- `node_modules`, build output, logs, and environment files should stay ignored.
- The frontend cart currently uses Redux and localStorage.
- Backend secrets belong only in `backend/config/config.env`.
