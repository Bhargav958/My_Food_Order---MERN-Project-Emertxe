# My Food Order - MERN Food Ordering App with Admin Dashboard

My Food Order is a modern, responsive, full-stack food ordering and delivery management application built on the **MERN (MongoDB, Express, React, Node.js)** stack. It offers customers a rich interface for catalog exploration, dynamic carts, and Stripe payments, while providing administrators with a secure portal to manage stores and menus in real-time.

---

## 🚀 Core Features

### 🛒 Customer Features
*   **User Onboarding & Security:** Secure registration and login flow with Bcrypt password hashing, JWT tokens, and Cloudinary-integrated user profile avatar uploads.
*   **Dynamic Restaurant Exploration:**
    *   Keyword searching across active store names.
    *   Veg-only dietary filters.
    *   Multi-criteria sorting (by ratings or popular reviews count).
*   **Responsive Menu Cards:** Dynamic view of menu cards per restaurant indicating price, ingredients, stock availability, and delivery charges.
*   **Centralized Cart Management:** Stock-aware shopping cart powered by Redux Toolkit that syncs with `localStorage` to persist items across tab refreshes.
*   **Stripe Payment Integration:** Secure checkout payment sheet allowing customers to execute card payments and process transactions safely.
*   **Order Tracking:** Live order details summary (Processing, Dispatched, Delivered) and chronological order history pages.

### 💼 Admin Features
*   **Role-Based Access Control:** Fully guarded pages and routes allowing only authenticated admin profiles (`role === 'admin'`) to access dashboard pages.
*   **Restaurant Catalog Builder:** Forms to add new restaurants (with coordinates, delivery timeframes, delivery fees, and custom banners) and edit existing profiles.
*   **Menu & Inventory Manager:** Add, edit, or remove food items from individual store menus on the fly.

---

## 🛠️ Technology Stack

| Tier | Component | Technology / Library |
| :--- | :--- | :--- |
| **Frontend** | Build & Core | React 18 (Vite template), React Router Dom V7 |
| | State Management | Redux Toolkit (`@reduxjs/toolkit` & `react-redux`) |
| | UI & Icons | React Bootstrap, Styled Components, Font Awesome, React Icons |
| | Utilities | Axios (API client), React Toastify (Toast feedback) |
| **Backend** | Framework | Node.js, Express (RESTful Routers) |
| | Middleware | Cookie Parser, CORS, JSON Web Token (JWT), BCryptJS |
| | Utilities | Express Fileupload, Nodemailer (emails), HTML-to-text, Pug templates |
| **Database** | Storage & Modeling | MongoDB & Mongoose (Object-Document Mapper) |
| **Services** | Payments & Media | Stripe API (Credit card processing), Cloudinary SDK (Image storage) |

---

## 📂 Project Structure

```txt
My_Food_Order/
├── backend/
│   ├── config/              # Server configuration and environment profiles
│   ├── controllers/         # Business logic handlers (auth, cart, restaurants, orders)
│   ├── middlewares/         # Authorization, role verification, and error handlers
│   ├── models/              # Mongoose data schemas (User, Restaurant, Menu, Order, Cart)
│   ├── routes/              # Express API route declarations
│   ├── utils/               # JWT token generators, emails, and Cloudinary configuration
│   ├── view/                # Pug HTML/email templates
│   ├── app.js               # Express application initialization
│   └── server.js            # Node HTTP server execution point
└── frontend/
    ├── public/              # Static public assets
    ├── src/
    │   ├── assets/          # Shared visual elements
    │   ├── Components/      # React functional components & custom admin dashboards
    │   │   ├── layout/      # Shared headers, footers, and loaders
    │   │   └── css/         # Custom styling sheets
    │   ├── redux/           # Central store.js and custom slice state reducers
    │   ├── utils/           # Axios interceptors and global constants
    │   ├── App.jsx          # Front-end routing declaration
    │   └── main.jsx         # Client mount entry point
```

---

## ⚙️ Getting Started

### 1. Clone & Set Up the Repository
```bash
git clone https://github.com/Bhargav958/My_Food_Order---MERN-Project-Emertxe.git
cd My_Food_Order---MERN-Project-Emertxe/My_Food_Order
```

### 2. Configure Environment Variables
Create a configuration file at `backend/config/config.env` and populate it with your database and API credentials:
```env
NODE_ENV=DEVELOPMENT
PORT=4000
DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/MyFoodOrder

JWT_SECRET=your_super_secret_jwt_string
JWT_EXPIRES=7d
JWT_EXPIRES_TIME=7

FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

STRIPE_API_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USERNAME=your_mailtrap_username
EMAIL_PASSWORD=your_mailtrap_password
EMAIL_FROM=noreply@myfoodorder.com
```

### 3. Install & Start Backend Services
```bash
cd backend
npm install
npm start
```
The server will boot up locally at `http://localhost:4000`.

### 4. Install & Start Frontend Client
```bash
cd ../frontend
npm install
npm run dev
```
The client dashboard will open up in Vite's development server, typically at `http://localhost:5173`.

---

## 🛣️ API & Route Directory

### 🖥️ Client (React Router) Pages
*   **Customer Pages:**
    *   `/` — Landing homepage with restaurant listings.
    *   `/eats/stores/search/:keyword` — Filtered catalog search list.
    *   `/eats/stores/:id/menus` — Individual store menus.
    *   `/cart` — Cart review and price subtotal calculator.
    *   `/users/login` & `/users/signup` — Access portals.
    *   `/success` — Stripe checkout success page.
    *   `/orders/me` — Customer purchase history.
    *   `/orders/:id` — Detail card for past transactions.
*   **Admin Dashboard Pages:**
    *   `/admin/restaurant/new` — Create new restaurant listing.
    *   `/admin/restaurant/edit/:id` — Modify existing store details.
    *   `/admin/restaurant/:id/menu/new-item` — Add new food items to menus.
    *   `/admin/restaurant/:id/menu/edit-item/:foodId` — Configure food item pricing or stock.

### 📡 Server REST Endpoints (`/api/v1/`)

| Module | Route | HTTP Verb | Purpose |
| :--- | :--- | :--- | :--- |
| **Auth** | `/users/signup` | POST | Registers a new account (processes avatars to Cloudinary) |
| | `/users/login` | POST | Authenticates credentials and returns secure cookies/JWT |
| | `/users/me` | GET | Fetches authenticated user profiles |
| | `/users/me/update` | PUT | Modifies active user names or phone numbers |
| **Stores** | `/eats/stores` | GET / POST | Retrieves list of restaurants / Admin posts a new store |
| | `/eats/stores/:storeId` | GET / DELETE | Fetches a single store / Admin deletes a store profile |
| **Menus** | `/eats/menus` | GET / POST | Fetches menu cards / Admin sets up a menu listing |
| | `/eats/item` | POST | Admin appends a new food item config |
| | `/eats/item/:foodId` | PATCH / DELETE| Admin edits details / Admin deletes a food item |
| **Cart** | `/eats/cart/add-to-cart` | POST | Updates backend shopping cart state |
| **Payments** | `/payment/process` | POST | Prepares a Stripe session for transactions |
| **Orders** | `/eats/orders/new` | POST | Saves order details to database upon payment validation |
| | `/eats/orders/me/myOrders`| GET | Retrieves customer-specific orders list |

