# Hotel Booking

A full-stack hotel booking platform for Bangladesh. Guests browse hotels by **division → district → area**, check room availability, book rooms and pay online through **SSLCommerz**. Admins manage hotels, rooms, locations, bookings, users, homepage sliders and notifications from a dashboard.

- **Live client:** https://behb-hotel-booking.vercel.app
- **API docs (Swagger UI):** `<backend-url>/api-docs`

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Data model](#data-model)
- [API overview](#api-overview)
- [Client routes](#client-routes)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Deployment](#deployment)

---

## Features

### Guests / customers
- Browse hotels by location (division → district → area), or see all hotels at once
- Hotel details page with a room gallery, amenities and pricing
- Check room availability for chosen check-in and check-out dates
- Book multiple rooms in one checkout and pay through SSLCommerz (BDT)
- Pages shown after a successful, failed or cancelled payment
- Register and log in, with email verification through a token link (`/verify/:token`)
- Customer dashboard to see booking history and view a booking (can be printed or exported to PDF), edit the profile and change the password
- In-app notifications, such as booking confirmations

### Admins
- Separate admin login (`/admin-login`) and role-protected admin dashboard
- Dashboard statistics
- CRUD for **hotels**, **rooms**, **areas**, **homepage sliders** and **users**
- View and edit bookings
- Send notifications, and view contact messages and subscriptions
- Image uploads through the ImgBB API, and rich-text descriptions through CKEditor

---

## Tech stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 4 (SWC), React Router 6 |
| **State / data fetching** | Redux Toolkit, RTK Query, redux-persist |
| **UI** | Tailwind CSS, Ant Design, Material Tailwind, PrimeReact, Headless UI, Heroicons, React Icons |
| **Forms** | React Hook Form, CKEditor 5, react-datepicker |
| **Media / sliders** | Swiper, Keen Slider, react-image-gallery, react-responsive-carousel |
| **Docs / printing** | @react-pdf/renderer, react-to-pdf, react-to-print |
| **Feedback** | Sonner, react-hot-toast, antd `message` |
| **Backend** | Node.js, Express 4 |
| **Database / ORM** | MongoDB with Prisma 6 |
| **Auth** | bcryptjs (password hashing), jsonwebtoken (JWT) |
| **Payments** | SSLCommerz (`sslcommerz-lts`) |
| **Email** | Nodemailer |
| **API docs** | swagger-jsdoc, swagger-ui-express |
| **Hosting** | Vercel (client and server) |

---

## Project structure

The repo has two separate apps: `client/` (React SPA) and `server/` (Express API).

```
Hotel_Booking/
├── client/                         # React + Vite frontend
│   ├── public/_redirects           # SPA fallback for Netlify
│   ├── vercel.json                 # SPA rewrites for Vercel
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── main.jsx                # App entry: Redux Provider, PersistGate, Router
│       ├── App.jsx
│       ├── Routes/
│       │   ├── routes.jsx                  # Top-level router (public, /admin, /user)
│       │   ├── Admin.Routes.jsx            # Admin dashboard routes + sidebar items
│       │   ├── Customer.Routes.jsx         # Customer dashboard routes
│       │   ├── AdminPanelProtectedRoutes/  # Allows only users with role === "admin"
│       │   └── UserProtectedRoutes/        # Allows only logged-in users
│       ├── Layouts/
│       │   ├── Home/MainLayout.jsx         # Public site layout (header + footer)
│       │   └── Dashboard/                  # Admin & customer dashboard layouts, sidebars, navbars
│       ├── Pages/
│       │   ├── Home/                       # Banner slider, divisions, all hotels, hotel details
│       │   ├── Division/ District/ Area/   # Browsing hotels by location
│       │   ├── Checkout/ Success/ Error/   # Booking and payment flow
│       │   ├── Auth/                       # Login, Register, AdminLogin
│       │   ├── Verify/                     # Email verification
│       │   ├── Notification/ PrivacyPolicy/
│       │   └── Dashboard/
│       │       ├── Admin/                  # Hotel, Room, Area, Bookings, Customers, Slider,
│       │       │                           # AddNotification, Contact, Subscription, Statistics, Profile
│       │       └── User/                   # BookingHistory, EditProfile, ChangePassword
│       ├── components/
│       │   ├── Form/                       # Reusable "Z*" form inputs (ZFormTwo, ZInputTwo, ZSelect, ZImageInput, ...)
│       │   ├── Modal/                      # Add / Edit / View / Delete modals
│       │   ├── Table/DashboardTable.jsx    # Shared antd table for admin lists
│       │   └── Skeleton/ BreadCrumb/ Button/ ...
│       ├── common/                         # Header, Footer, ErrorPage
│       ├── redux/
│       │   ├── store/store.js              # Store config (persists auth and booking)
│       │   ├── Api/baseApi.js              # RTK Query base (VITE_BACKEND_URL + Bearer token)
│       │   ├── Feature/Admin/*/            # Endpoints per resource (hotel, room, booking, area, ...)
│       │   ├── Feature/User/               # Customer and location endpoints
│       │   ├── Feature/auth/               # Auth API and slice
│       │   ├── Booking/ Modal/ loading/    # Local UI slices
│       │   └── Hook/Hook.jsx               # Typed useAppDispatch / useAppSelector
│       └── utils/                          # routesGenerator, sidebarGenerator, OptionsGenerator, error helpers
│
└── server/                         # Express + Prisma backend
    ├── index.js                    # App entry: CORS, JSON, Swagger, /api/v1 router, DB connect
    ├── vercel.json                 # Vercel serverless config
    ├── prisma/schema.prisma        # MongoDB data model
    └── src/
        ├── routes/index.js         # All REST routes, wired to controllers
        ├── controllers/            # HTTP layer (request → service → response)
        ├── services/               # Business logic and Prisma queries, grouped by domain
        │   ├── Authentication/ User/ Admin/
        │   ├── Hotel/ Room/ Booking/
        │   ├── Division/ District/ Area/
        │   ├── Slider/ Notification/
        │   └── PaymentGateway/     # SSLCommerz integration
        ├── config/                 # dotenv helper, Swagger config
        ├── shared/                 # catchAsync, response handler, email utility
        ├── utility/                # Bcrypt password hasher
        └── error/                  # API error handling
```

### Backend architecture

The server uses a **controller → service** pattern:

1. `src/routes/index.js` defines each endpoint and passes it to a controller.
2. **Controllers** read the request, call a service and format the response.
3. **Services** hold the business logic and talk to MongoDB through the Prisma client.

For example, creating a booking starts an SSLCommerz payment session, saves the `Booking` with its transaction ID, creates a `Payment` record and sends the user a `BOOKING_CONFIRMATION` notification.

---

## Data model

Defined in [`server/prisma/schema.prisma`](server/prisma/schema.prisma) (MongoDB):

| Model | Purpose |
|---|---|
| `User` | Customers and admins (`role: user \| admin`), with email verification fields |
| `Hotel` | Hotel profile, location (division / city / area IDs, latitude and longitude), amenities; has many `Room` |
| `Room` | Room type, price, capacity, child count, quantity, images, amenities, availability |
| `Booking` | Guest details, booked items, check-in and check-out dates, total price, status, payment status, transaction ID |
| `Payment` | One per booking: gateway, amount, status, raw gateway response |
| `RoomBooking` | Links a booking to a room |
| `Division` / `District` / `Area` | Bangladesh location hierarchy, used for browsing |
| `Slider` | Homepage banner slides |
| `Notification` | Per-user notifications (booking confirmation, cancellation, promotion, …) |

---

## API overview

Every endpoint starts with **`/api/v1`**. Interactive docs are served at **`/api-docs`**.

| Resource | Endpoints |
|---|---|
| **Users / auth** | `POST /user/register`, `POST /user/login`, `GET /user`, `GET\|PUT\|DELETE /user/:id` |
| **Hotels** | `POST /hotel/create`, `GET /hotel`, `GET\|PUT\|DELETE /hotel/:id`, `GET /hotel/:divisionId/division`, `GET /hotel/:areaId/area` |
| **Rooms** | `POST /room/create`, `GET /room`, `GET\|PUT\|DELETE /room/:id`, `POST /room/checkAvailability`, `GET /hotel/:hotelId/rooms` |
| **Bookings** | `POST /booking/create`, `GET /booking`, `GET\|PUT\|DELETE /booking/:id`, `POST /booking/check-availability`, `GET /booking/user/:userId` |
| **Sliders** | `POST /sliders/create`, `GET /sliders`, `GET\|PUT\|DELETE /sliders/:id` |
| **Notifications** | `POST /notification/create`, `GET /notification/:userId`, `PUT /notification/:id/read` |
| **Divisions** | `POST /division/create`, `GET /division`, `GET\|PUT\|DELETE /division/:id` |
| **Districts** | `POST /district/create`, `GET /district`, `GET\|PUT\|DELETE /district/:id`, `GET /district/by-division/:id` |
| **Areas** | `POST /area/create`, `GET /area`, `GET\|PUT\|DELETE /area/:id`, `GET /area/by-district/:id` |

---

## Client routes

| Path | Page |
|---|---|
| `/` | Home: banner slider, divisions, featured hotels |
| `/division` → `/district/:divisionId` → `/area/:districtId` → `/hotel/:areaId` | Browse hotels by location |
| `/hotel-details/:id` | Hotel details, rooms and gallery |
| `/checkout`, `/success`, `/cancel` | Booking and payment flow |
| `/login`, `/register`, `/admin-login`, `/verify/:token` | Sign-in and sign-up |
| `/notification`, `/privacy-policy` | Misc |
| `/admin/*` | Admin dashboard (admins only) |
| `/user/user-profile`, `/user/user-booking` | Customer dashboard (logged-in users only) |

---

## Getting started

### Prerequisites
- Node.js 18+
- npm or pnpm (both lockfiles are committed)
- A MongoDB database (for example MongoDB Atlas). Prisma's MongoDB connector needs a **replica set**, which Atlas provides by default.
- An [ImgBB](https://api.imgbb.com/) API key for image uploads
- An SSLCommerz sandbox store for payments

### 1. Clone

```bash
git clone https://github.com/ahad30/hotel-booking.git
cd hotel-booking
```

### 2. Run the server

```bash
cd server
npm install          # also runs `prisma generate`
# create server/.env (see below)
npx prisma db push   # sync the schema to MongoDB
npm start            # nodemon index.js → http://localhost:5000
```

### 3. Run the client

```bash
cd client
npm install
# create client/.env (see below)
npm run dev          # http://localhost:5173
```

The server's CORS settings allow `http://localhost:5173` and `http://localhost:5174` in development.

---

## Environment variables

### `server/.env`

| Variable | Description |
|---|---|
| `DATABASE_URL` | MongoDB connection string used by Prisma |
| `PORT` | API port (default `5000`) |
| `BACKEND_URL` | Public URL of the API, used for SSLCommerz callback URLs (default `http://localhost:5000`) |
| `FRONTEND_URL` | Public URL of the client (default `http://localhost:3000`) |
| `SSLCOMMERZ_STORE_ID` | SSLCommerz store ID |
| `SSLCOMMERZ_STORE_PASSWORD` | SSLCommerz store password |
| `SSLCOMMERZ_IS_LIVE` | `true` for production, `false` for sandbox |
| `SSLCOMMERZ_SUCCESS_URL` | Payment success callback URL |

### `client/.env`

| Variable | Description |
|---|---|
| `VITE_BACKEND_URL` | API base URL, including the version prefix, e.g. `http://localhost:5000/api/v1` |
| `VITE_IMAGE_HOSTING_KEY` | ImgBB API key for image uploads |

`.env` files are git-ignored. Never commit them.

---

## Scripts

### Client (`client/`)
| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

### Server (`server/`)
| Script | Description |
|---|---|
| `npm start` | Start the API with nodemon |
| `npm run prisma:push` | Push the Prisma schema to the database |
| `npm run vercel-build` | Run `prisma generate` (used by Vercel) |

---

## Deployment

Both apps are set up for **Vercel**:

- **Client**: `client/vercel.json` sends every path to the SPA so React Router can handle it. `client/public/_redirects` does the same for Netlify.
- **Server**: `server/vercel.json` runs `index.js` through `@vercel/node` and generates the Prisma client during the build.

Set the environment variables above in each Vercel project. Add the deployed client URL to the CORS `origin` list in `server/index.js`.
