# 🐾 Pawsitive — Pet Adoption Platform

A full-stack pet adoption platform built with the MERN stack that connects loving homes with pets in need. Users can browse available pets, submit adoption requests, and manage their listings — all through a clean, responsive, and recruiter-friendly interface.

---

## 🌐 Live URL



---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login & registration with HTTPOnly cookie-based JWT tokens. Supports Email/Password and real Google OAuth via `@react-oauth/google`.
- 🐶 **Browse & Search Pets** — Explore all available pets with real-time search by name (`$regex`), filter by species (`$in`), and sort by fee or name using MongoDB operators.
- 📋 **Adoption Request System** — Authenticated users can submit adoption requests with a preferred pickup date and message. Owners can approve or reject requests directly from their dashboard.
- 🏠 **Shelter Dashboard** — Pet owners can add, edit, and delete their listings, view adoption statistics (total/available/adopted), and manage incoming requests with approve/reject controls.
- ❤️ **Wishlist** — Save favourite pets to a personal wishlist for quick access later.
- 🌙 **Dark / Light Theme** — Persistent theme toggle stored in localStorage, applied via a `data-theme` attribute.
- 📱 **Fully Responsive** — Mobile-first design that works seamlessly across mobile, tablet, and desktop.
- 🔒 **Adoption Controls** — Pet owners cannot adopt their own pets. Once a request is approved, the pet is marked as adopted and all other pending requests are automatically rejected.
- ✨ **Framer Motion Animations** — Smooth page transitions and scroll-triggered animations throughout the UI.
- 🛡️ **Protected Routes** — Private pages are guarded on both client and server side. Logged-in users are never redirected to login on page reload.

---

## 🛠️ NPM Packages Used

### Frontend (`nextjs-client`)
| Package | Purpose |
|---|---|
| `next` | React framework with Pages Router & SSR |
| `react`, `react-dom` | UI library |
| `tailwindcss` | Utility-first CSS framework |
| `framer-motion` | Animations and transitions |
| `react-hot-toast` | Toast notifications |
| `react-icons` | Icon library (Feather, Font Awesome) |
| `@react-oauth/google` | Real Google OAuth 2.0 integration |

### Backend (`server`)
| Package | Purpose |
|---|---|
| `express` | Node.js web framework |
| `mongoose` | MongoDB ODM |
| `jsonwebtoken` | JWT generation and verification |
| `bcryptjs` | Password hashing |
| `cookie-parser` | HTTPOnly cookie parsing |
| `cors` | Cross-origin resource sharing |
| `dotenv` | Environment variable management |
| `nodemon` | Development auto-restart |

---

## 📁 Project Structure

```
Pet Adoption Platform/
├── nextjs-client/          # Next.js frontend (Pages Router + Tailwind)
│   ├── pages/
│   │   ├── index.js        # Home page (SSR)
│   │   ├── all-pets.js     # All pets with search/filter (SSR)
│   │   ├── pets/[id].js    # Pet details + adoption modal (SSR)
│   │   ├── login.js        # Login with Google OAuth
│   │   ├── register.js     # Registration
│   │   └── dashboard/      # Private dashboard pages
│   ├── components/         # Navbar, Footer, PetCard, Modals, etc.
│   ├── context/            # AuthContext (global auth + wishlist state)
│   └── utils/              # apiFetch utility
│
└── server/                 # Express backend
    ├── controllers/        # Auth, Pet, Request, Wishlist logic
    ├── models/             # Mongoose schemas
    ├── routes/             # API route definitions
    ├── middleware/         # JWT auth middleware
    └── config/             # MongoDB connection
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/pet-adoption-platform.git
cd pet-adoption-platform
```

### 2. Setup the backend
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5001
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

```bash
npm run dev
```

### 3. Setup the frontend
```bash
cd nextjs-client
npm install
```

Create `nextjs-client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔐 Environment Variables

### Server
| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5001) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `CLIENT_URL` | Frontend URL for CORS |
| `NODE_ENV` | `development` or `production` |

### Frontend
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID |

---

## 📸 Pages Overview

| Page | Access | Rendering |
|---|---|---|
| Home | Public | SSR |
| All Pets | Public | SSR |
| Pet Details | Public | SSR |
| Login / Register | Public | Static |
| Dashboard / My Listings | Private | Static |
| Add Pet / Edit Pet | Private | Static |
| My Requests | Private | Static |
| Wishlist | Private | Static |

---

## 👨‍💻 Author

Built with ❤️ for animals by **Rohan** — MERN Stack Developer
