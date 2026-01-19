# Special Surprise - Backend

**Backend API server** for **Special Surprise**, a gift marketplace platform where users can browse, customize, and order gifts, while admins and moderators manage products, orders, and approvals.

---

## 🔗 Live Link

- **Backend**: [https://special-surprise-server.vercel.app](https://special-surprise-server.vercel.app)
- **Frontend**: [https://special-surprise-client.vercel.app](https://special-surprise-client.vercel.app)
- **Frontend Repository**: [https://github.com/imam0321/special-surprise-client](https://github.com/imam0321/special-surprise-client)

---

## 🚀 Project Overview

Special Surprise is a **gift marketplace** where:

- **Admins/Moderators** post gift items in categories like:
  - Anniversary, Birthday, Valentine, Father's Day, Mother's Day, Love Gifts, etc.
- **Users** can browse products, customize gifts, select delivery time, and place orders.
- If customization is requested, **moderator/admin approves availability** before order placement.
- **Order workflow**:
  1. Payment (online)
  2. Moderator processes order
  3. Delivery

---

## 💡 Core Features (Implemented)

### 1. User Management
- Roles: `user`, `moderator`, `admin`
- Sign up/Login with JWT & refresh tokens
- Protected routes based on roles

### 2. Product Catalog
- Categories & tags (anniversary, birthday, valentine, etc.)
- Product types: Standard (ready-made) & Customizable
- Search & filter by name, description, category, price

### 3. Order Flow
- Lifecycle statuses: `requested` → `pending` → `payment` → `processing` → `ready_to_ship` → `shipped` → `delivered`
- Online payment integration

### 4. Admin/Moderator Dashboards
- Profile update
- Product CRUD
- Process orders
- Stats and reports

### 5. Security & Validation
- Input validation via Zod
- Rate limiting & Secure environment variables
- JWT-based authentication & Role-based authorization

---

## 🛠️ Tech Stack

**Backend:** Node.js + Express
**Language:** TypeScript
**ORM / Database:** Prisma + PostgreSQL
**Authentication:** JWT (Access & Refresh Tokens)
**Validation:** Zod
**File Uploads:** Multer + Cloudinary
**Payment Integration:** SSLCommerz
**Email Service:** Nodemailer

**Tools & Utilities:**
- dotenv, eslint, bcryptjs, cookie-parser, cors, ejs

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database (Local or Cloud like Neon/Supabase)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/imam0321/special-surprise-server.git
   cd special-surprise-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory and add the following:

   ```env
   PORT=5000
   NODE_ENV=development
   
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/specialSurpriseDB?schema=public"
   
   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000

   # Auth & Security
   BCRYPT_SALT_ROUND=10
   
   # Admin Credentials (for seeding/initial setup)
   ADMIN_EMAIL=admin@gmail.com
   ADMIN_PASSWORD=your_admin_password

   # JWT Configuration
   JWT_ACCESS_SECRET=your_jwt_access_secret
   JWT_ACCESS_EXPIRES=1d
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   JWT_REFRESH_EXPIRES=30d
   JWT_RESET_SECRET=your_jwt_reset_secret
   JWT_RESET_EXPIRES=10m

   # Cloudinary (Image Uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_CLOUD_API_KEY=your_api_key
   CLOUDINARY_CLOUD_API_SECRET=your_api_secret

   # SMTP (Email Service)
   SMTP_HOST=smtp.gmail.com
   SMTP_POST=465
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   SMTP_FROM=your_email@gmail.com

   # SSLCommerz (Payment Gateway)
   SSL_STORE_ID=your_store_id
   SSL_STORE_PASS=your_store_password
   SSL_PAYMENT_API=https://sandbox.sslcommerz.com/gwprocess/v4/api.php
   SSL_VALIDATION_API=https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php
   
   # SSL Callback URLs (Backend)
   SSL_IPN_URL=http://localhost:5000/api/v1/payment/validate-payment
   SSL_SUCCESS_BACKEND_URL=http://localhost:5000/api/v1/payment/success
   SSL_FAIL_BACKEND_URL=http://localhost:5000/api/v1/payment/fail
   SSL_CANCEL_BACKEND_URL=http://localhost:5000/api/v1/payment/cancel

   # SSL Redirect URLs (Frontend)
   SSL_SUCCESS_FRONTEND_URL=http://localhost:3000/payment/success
   SSL_FAIL_FRONTEND_URL=http://localhost:3000/payment/fail
   SSL_CANCEL_FRONTEND_URL=http://localhost:3000/payment/cancel
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   # Optional: npx prisma migrate dev
   ```

5. **Run the Server**
   ```bash
   npm run dev
   ```

---

## 📦 API Endpoints

Base URL: `/api/v1`

### 🔑 Auth Module
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | `/auth/login` | Public | Login user or moderator |
| GET | `/auth/me` | Authenticated | Get current user profile |
| POST | `/auth/refresh-token` | Public | Refresh access token |
| PATCH | `/auth/change-password` | Authenticated | Change password |
| POST | `/auth/forgot-password` | Public | Send password reset link |
| PATCH | `/auth/reset-password` | Public | Reset password with token |

### 👤 User Module
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | `/user/register-customer` | Public | Register a new customer |
| POST | `/user/register-moderator` | Admin | Register a new moderator |
| PATCH | `/user/update-my-profile` | Authenticated | Update own profile |
| GET | `/user/customers` | Admin, Moderator | Get all customers |
| GET | `/user/moderators` | Admin | Get all moderators |
| GET | `/user/:id` | Admin | Get single user info |
| PATCH | `/user/soft-delete/:id` | Admin, Moderator | Soft delete a user |

### 📦 Product Module
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | `/product` | Admin, Moderator | Create a new product |
| GET | `/product` | Public | Get all products |
| GET | `/product/:productCode` | Public | Get single product by code |
| PATCH | `/product/:productCode` | Admin, Moderator | Update product by code |
| DELETE | `/product/:productCode` | Admin, Moderator | Delete product by code |

### 🏷️ Category Module
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | `/category` | Admin, Moderator | Create a new category |
| GET | `/category` | Public | Get all categories |
| GET | `/category/:id` | Public | Get single category |
| PATCH | `/category/:id` | Admin, Moderator | Update category |
| DELETE | `/category/:id` | Admin, Moderator | Delete category |

### 📦 Order Module
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | `/order/create-order` | User | Create a new order |
| GET | `/order/` | Admin, Moderator | Get all orders |
| GET | `/order/my-orders` | User | Get user's orders |
| PATCH | `/order/:orderId/status` | Admin, Moderator | Update order status |

### 💰 Payment Module
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | `/payment/init-payment/:orderId` | Public | Initialize payment |
| POST | `/payment/success` | Public | Payment success callback |
| POST | `/payment/fail` | Public | Payment failure callback |
| POST | `/payment/cancel` | Public | Cancel payment |
| POST | `/payment/validate-payment` | Public | Validate payment |

---

## 🔮 Future Features

### 1. Customization Flow
- Users select customization → request sent to moderator/admin
- Moderator approves/denies and sets extra price/time

### 2. Notifications
- Push real-time notifications via **Socket.IO**
- In-app & Email notifications

### 3. Chat
- Real-time chat per order or general support
- Media sharing

### 4. Media & Uploads
- Metadata stored in DB (URL, type, size)

### 5. Audit & Logs
- Track order status changes, who changed it, and timestamps

### 6. Testing
- Unit tests, Integration tests, E2E tests
