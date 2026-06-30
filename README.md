# RentEase — Furniture & Appliance Rental Platform

A full-stack MVP for a monthly furniture & appliance rental platform, built with:

- **Frontend:** React (Vite) + Tailwind CSS + React Router
- **Backend:** Node.js + Express + JWT auth
- **Database:** MongoDB (Mongoose)

## Features implemented

**Users**
- Register / login (JWT-based auth)
- Browse products by category (Furniture / Appliances) and sub-category, with icon-based product visuals and loading skeletons
- View product details, rent, deposit, tenure options
- Add to cart, choose tenure, two-step checkout (delivery details → simulated payment) with toast confirmations
- View rental history and live status
- Request maintenance on an active rental
- Request a return

**Admin** (`admin@rentease.com` / `admin123` after seeding)
- Add / edit / deactivate products, set pricing & quantity
- View all rentals, update status (confirmed → delivered → active → returned, etc.)
- Resolve maintenance requests
- Dashboard with KPIs (active rentals, MRR, utilization rate, users, open maintenance) plus charts: monthly rent by category and rentals by status

**Engineering**
- Toast notification system across key actions
- Basic backend smoke tests (Jest + Supertest)
- `/docs/RentEase_PRD.docx` — full Product Requirements Document with architecture & ER diagrams

## Project structure

```
rentease/
  backend/     Express API + MongoDB models
  frontend/    React (Vite) client
```

## Prerequisites

- Node.js 18+ and npm
- MongoDB running locally (or a MongoDB Atlas connection string)
  - Local install: https://www.mongodb.com/docs/manual/installation/
  - Or use Atlas free tier: https://www.mongodb.com/atlas

## 1. Backend setup

```bash
cd rentease/backend
cp .env.example .env
# edit .env if your MongoDB URI or port differs
npm install
npm run seed     # creates sample products + an admin user
npm run dev       # starts the API on http://localhost:5000
```

`.env` values:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/rentease
JWT_SECRET=change_this_to_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

## 2. Frontend setup

Open a new terminal:

```bash
cd rentease/frontend
cp .env.example .env
npm install
npm run dev       # starts the app on http://localhost:5173
```

Visit **http://localhost:5173**.

## 3. Try it out

- Register a normal user, browse `/products`, add an item to cart, and checkout.
- Log in as the admin (`admin@rentease.com` / `admin123`) and go to `/admin` to manage inventory and rentals, and view the analytics charts.

## Running tests

```bash
cd rentease/backend
npm test
```

## API overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a user account |
| POST | `/api/auth/login` | Log in, returns JWT |
| GET | `/api/auth/me` | Current user (auth required) |
| GET | `/api/products` | List products (filters: category, subCategory, city, search) |
| GET | `/api/products/:id` | Product detail |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Deactivate product (admin) |
| POST | `/api/rentals` | Create a rental / checkout (auth) |
| GET | `/api/rentals/mine` | Current user's rentals (auth) |
| POST | `/api/rentals/:id/maintenance` | Request maintenance (auth) |
| PUT | `/api/rentals/:id/status` | Update rental status (owner or admin) |
| GET | `/api/rentals` | All rentals (admin) |
| PUT | `/api/rentals/:id/maintenance/:index` | Resolve maintenance request (admin) |
| GET | `/api/admin/stats` | Dashboard KPIs (admin) |

## Notes / next steps

This covers the in-scope items from the project brief (web platform, catalog, rental plans, delivery scheduling, admin dashboard with analytics). Out-of-scope per the brief: native mobile apps, cross-border rentals, AI pricing, resale marketplace. Payment is simulated in this MVP (no real charge); swapping in a real gateway (Razorpay/Stripe) is a drop-in replacement of the `handlePay` step in `Checkout.jsx`.

**To deploy live:** push `backend/` to Render or Railway with the env vars from `.env.example` and a MongoDB Atlas connection string, then push `frontend/` to Vercel or Netlify with `VITE_API_URL` pointing at the deployed backend URL. This wasn't done from this environment since it has no outbound access to hosting providers, but the app is deploy-ready as-is.
