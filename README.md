# ykSells

A full-stack MERN ecommerce platform built for The Tech Pulses Weeks 7-8 capstone. Customers can browse products, manage a persistent cart, pay with Stripe test mode, review products, and track orders. Administrators can manage products, Cloudinary images, orders, customers, and revenue analytics.

## Features

### Customer

- Customer registration and login with bcrypt password hashing and JWT authentication
- Customer/Admin sign-in selection
- Responsive homepage with featured products
- Product search, category filtering, brand filtering, sorting, and pagination
- Product details with images, stock, discounts, reviews, ratings, and review counts
- Cart persisted in localStorage with stock-aware quantities
- Shipping address checkout with Stripe Card Element
- Order confirmation, order history, and individual order details
- Customer profile updates
- One review per customer per product

### Admin

- Automatic admin account creation from environment variables
- Protected admin routes and API middleware
- Dashboard statistics for revenue, orders, products, and customers
- Six-month revenue chart
- Create, edit, and delete products
- Upload product images to Cloudinary
- View and update order status
- View and delete customer accounts

## Technology

- Node.js, Express, MongoDB Atlas, and Mongoose
- React, Vite, React Router, Axios, and Context API
- JWT and bcryptjs authentication
- Stripe PaymentIntents and React Stripe.js
- Cloudinary and Multer image uploads
- Nodemailer order confirmation emails
- CSS styling without UI component libraries

## Project structure

```text
ecommerce-app/
|- server/
|  |- config/              MongoDB and Cloudinary configuration
|  |- controllers/         Authentication, catalog, order, and admin logic
|  |- middleware/          JWT authorization, uploads, and errors
|  |- models/              User, Product, Category, and Order models
|  |- routes/              REST API route definitions
|  |- seed.js              Repeatable demo catalog seed
|  `- server.js            Express entry point
|- client/
|  |- src/api/             Axios API client
|  |- src/context/         AuthContext and CartContext
|  |- src/App.jsx          Routes and application views
|  `- src/App.css          Application styling
`- README.md
```

## Local setup

### Prerequisites

- Node.js 18 or newer
- MongoDB Atlas cluster and database user
- Stripe account in test mode
- Cloudinary account for image uploads
- Gmail SMTP account or another SMTP provider for emails

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/ykSells?appName=WholeSale&authSource=admin
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=your_google_app_password
FROM_EMAIL=yourgmail@gmail.com
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=use-a-secure-password
```

Create `client/.env` from `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

Never commit either `.env` file. The root and project `.gitignore` files exclude them.

Install and run in two terminals:

```powershell
npm --prefix "server" install
npm --prefix "server" run dev
```

```powershell
npm --prefix "client" install
npm --prefix "client" run dev
```

Open `http://localhost:5173`.

## Seed demo products

The seed command creates or updates four categories and eight realistic products. It is safe to run repeatedly because products are matched by name.

```powershell
npm --prefix "server" run seed
```

## Accounts

New registrations always create customer accounts.

The admin account is created or synchronized when the server starts using `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Use a strong different password in production.

## API reference

Protected routes require:

```text
Authorization: Bearer <jwt_token>
```

### Health

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api` | Public | API status |
| GET | `/api/health` | Public | Health check |

### Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register a customer |
| POST | `/api/auth/login` | Public | Login with email, password, and role |
| GET | `/api/auth/me` | Protected | Get current user |
| PUT | `/api/auth/me` | Protected | Update profile or password |

### Products

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/products` | Public | List with filters, search, sorting, and pagination |
| GET | `/api/products/featured` | Public | List featured products |
| GET | `/api/products/:id` | Public | Product details and reviews |
| POST | `/api/products` | Admin | Create product with Cloudinary images |
| PUT | `/api/products/:id` | Admin | Update product and images |
| DELETE | `/api/products/:id` | Admin | Delete product |
| POST | `/api/products/:id/review` | Protected | Add a customer review |
| DELETE | `/api/products/:id/review` | Protected | Delete own review |

Product query parameters: `category`, `brand`, `search`, `sort`, `page`, and `limit`. Sort values: `price-asc`, `price-desc`, `newest`, and `top-rated`.

### Categories

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/categories` | Public | List categories |
| POST | `/api/categories` | Admin | Create a category |
| PUT | `/api/categories/:id` | Admin | Update a category |
| DELETE | `/api/categories/:id` | Admin | Delete a category |

### Orders and payments

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/orders` | Protected | Create order and Stripe PaymentIntent |
| POST | `/api/orders/:id/pay` | Protected | Verify payment, mark paid, decrement stock, and email |
| GET | `/api/orders/my` | Protected | Get customer orders |
| GET | `/api/orders/:id` | Protected | Get one customer order |
| DELETE | `/api/orders/:id` | Protected | Cancel a pending order |

### Admin

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/admin/stats` | Admin | Revenue, orders, products, and customers |
| GET | `/api/admin/revenue-chart` | Admin | Six-month monthly revenue |
| GET | `/api/admin/orders` | Admin | List all orders with optional status filter |
| PUT | `/api/admin/orders/:id/status` | Admin | Update order status |
| GET | `/api/admin/users` | Admin | List customer accounts |
| DELETE | `/api/admin/users/:id` | Admin | Delete a customer account |

## Stripe testing

Use Stripe test-mode keys only:

```text
Card: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any three digits
```

The backend verifies the PaymentIntent before marking an order paid. Failed payments are not marked as paid.

## Email confirmations

For Gmail, enable 2-Step Verification and create a Google App Password. Use the App Password as `SMTP_PASS`, not your normal Gmail password:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=your_google_app_password
FROM_EMAIL=yourgmail@gmail.com
```

Email delivery is optional for completing checkout. If SMTP is not configured, the order still completes and the server logs that email was skipped.

## Deployment

### Render backend

Create a Render Web Service from the GitHub repository:

```text
Root directory: server
Build command: npm install
Start command: npm start
```

Add all backend variables from `server/.env.example`. Set:

```env
PORT=10000
CLIENT_URL=https://your-vercel-domain.vercel.app
```

`CLIENT_URL` must be the Vercel origin only, without `/api` or a trailing slash. Add MongoDB, JWT, Stripe, Cloudinary, SMTP, and admin variables in Render. Local `.env` files are not uploaded.

In MongoDB Atlas, allow Render under **Security -> Network Access**. Render commonly requires `0.0.0.0/0` because outbound addresses can change.

Test the backend:

```text
https://your-render-service.onrender.com/api/health
```

### Vercel frontend

Import the same repository into Vercel:

```text
Root directory: client
Framework preset: Vite
Build command: npm run build
Output directory: dist
```

Add:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

The included `client/vercel.json` rewrites client-side routes to `index.html`. Redeploy after changing Vercel environment variables because Vite embeds them during the build.

## Security

- Never commit `.env` files, database URLs, SMTP passwords, Stripe secret keys, or Cloudinary secrets.
- Use Stripe test keys for development and demos.
- Use a strong unique JWT secret and production admin password.
- Rotate credentials if accidentally exposed.

## Verification checklist

- Backend responds at `/api/health`
- Customer can register and sign in
- Admin can sign in and see the dashboard
- Seeded products appear in the catalog
- Admin can upload product images to Cloudinary
- Customer can add products to the cart
- Stripe test payment succeeds
- Paid order appears in customer and admin order views
- Admin can update an order to `Shipped`
- Confirmation email arrives when SMTP is configured
