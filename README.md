# Special Surprise - Backend

**Backend API server** for **Special Surprise** a gift marketplace platform where users can browse, customize, and order gifts, while admins and moderators manage products, orders, and approvals.

---

## 🔗 Live Link

- **Frontend**: [https://special-surprise-client.vercel.app](https://special-surprise-client.vercel.app)
- **Frontend Repository**: [https://github.com/imam0321/special-surprise-client](https://github.com/imam0321/tour-matrix-client)
- **Backend**: [https://special-surprise-server.vercel.app](https://special-surprise-server.vercel.app)

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
- Product types:
  - Standard (ready-made)
  - Customizable (custom text/photo)
- Search & filter:
  - By name, description, category, price

### 4. Order Flow

- Lifecycle statuses:
  - `requested` → `pending` → `payment` → `processing` → `ready_to_ship` → `shipped` → `delivered`
- Payment split:
  - Online payment
- Users can view order timeline and media updates

### 6. Recommendations

- Show related products based on category/tags

### 7. Admin/Moderator Dashboards

- Profile update
- Product CRUD
- Process orders
- Stats and reports

### 11. Security & Validation

- Input validation via Zod or Yup
- Rate limiting
- File type validation
- JWT-based authentication
- Role-based authorization
- Secure environment variables

---

### 🛠️ Tech Stack

**Backend:** Node.js + Express  
**Language:** TypeScript  
**ORM / Database:** Prisma + PostgreSQL  
**Authentication:** JWT (Access & Refresh Tokens)
**Validation:** Zod  
**File Uploads:** Multer + Cloudinary  
**Payment Integration:** sslcommerz  
**Email Service:** Nodemailer

**Tools & Utilities:**

- dotenv
- eslint
- bcryptjs
- cookie-parser
- cors
- ejs
- express-session

## 📦 API Endpoints

Base URL: `/api/v1`

### 🔑 Auth Module

| Method | Endpoint                | Access        | Description               |
| ------ | ----------------------- | ------------- | ------------------------- |
| POST   | `/auth/login`           | Public        | Login user or moderator   |
| GET    | `/auth/me`              | Authenticated | Get current user profile  |
| POST   | `/auth/refresh-token`   | Public        | Refresh access token      |
| PATCH  | `/auth/change-password` | Authenticated | Change password           |
| POST   | `/auth/forgot-password` | Public        | Send password reset link  |
| PATCH  | `/auth/reset-password`  | Public        | Reset password with token |

### 👤 User Module

| Method | Endpoint                   | Access                    | Description              |
| ------ | -------------------------- | ------------------------- | ------------------------ |
| POST   | `/user/register-customer`  | Public                    | Register a new customer  |
| POST   | `/user/register-moderator` | Admin                     | Register a new moderator |
| PATCH  | `/user/update-my-profile`  | Authenticated (all roles) | Update own profile       |
| GET    | `/user/customers`          | Admin, Moderator          | Get all customers        |
| GET    | `/user/moderators`         | Admin                     | Get all moderators       |
| GET    | `/user/:id`                | Admin                     | Get single user info     |
| PATCH  | `/user/soft-delete/:id`    | Admin, Moderator          | Soft delete a user       |

### 📦 Product Module

| Method | Endpoint                | Access           | Description                |
| ------ | ----------------------- | ---------------- | -------------------------- |
| POST   | `/product`              | Admin, Moderator | Create a new product       |
| GET    | `/product`              | Public           | Get all products           |
| GET    | `/product/:productCode` | Public           | Get single product by code |
| PATCH  | `/product/:productCode` | Admin, Moderator | Update product by code     |
| DELETE | `/product/:productCode` | Admin, Moderator | Delete product by code     |

### 🏷️ Category Module

| Method | Endpoint        | Access           | Description           |
| ------ | --------------- | ---------------- | --------------------- |
| POST   | `/category`     | Admin, Moderator | Create a new category |
| GET    | `/category`     | Public           | Get all categories    |
| GET    | `/category/:id` | Public           | Get single category   |
| PATCH  | `/category/:id` | Admin, Moderator | Update category       |
| DELETE | `/category/:id` | Admin, Moderator | Delete category       |

### 📦 Order Module

| Method | Endpoint                 | Access           | Description         |
| ------ | ------------------------ | ---------------- | ------------------- |
| POST   | `/order/create-order`    | User             | Create a new order  |
| GET    | `/order/`                | Admin, Moderator | Get all orders      |
| GET    | `/order/my-orders`       | User             | Get user's orders   |
| PATCH  | `/order/:orderId/status` | Admin, Moderator | Update order status |

### 💰 Payment Module

| Method | Endpoint                         | Access           | Description              |
| ------ | -------------------------------- | ---------------- | ------------------------ |
| POST   | `/payment/init-payment/:orderId` | Public           | Initialize payment       |
| POST   | `/payment/success`               | Public           | Payment success callback |
| POST   | `/payment/fail`                  | Public           | Payment failure callback |
| POST   | `/payment/cancel`                | Public           | Cancel payment           |
| POST   | `/payment/validate-payment`      | Public           | Validate payment         |
| Method | Endpoint                         | Access           | Description              |
| ------ | ---------------                  | ---------------- | ---------------------    |
| POST   | `/category`                      | Admin, Moderator | Create a new category    |
| GET    | `/category`                      | Public           | Get all categories       |
| GET    | `/category/:id`                  | Public           | Get single category      |
| PATCH  | `/category/:id`                  | Admin, Moderator | Update category          |
| DELETE | `/category/:id`                  | Admin, Moderator | Delete category          |

## 🔮 Future Features / To Be Implemented

### 1. Customization Flow

- Users select customization → request sent to moderator/admin
- Moderator approves/denies and sets extra price/time

### 2. Notifications

- Push real-time notifications via **Socket.IO**
- In-app notifications
- Optional email notifications
- Notify on customization status, order updates, chat messages

### 3. Chat

- Real-time chat per order or general support
- Media sharing (images/videos)
- Message history stored in DB

### 4. Media & Uploads

- Cloudinary or AWS S3 for storage
- Metadata stored in DB (URL, type, size)

### 5. Audit & Logs

- Track order status changes, who changed it, and timestamps

### 6. Testing

- Unit tests for critical features (auth, payments)
- Integration tests for API endpoints
- E2E tests (optional)
