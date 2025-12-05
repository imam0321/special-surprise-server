# special-surprise-server



## 📦 API Endpoints

#### 🔑 Auth Module

| Method | Endpoint                | Access        | Description               |
| ------ | ----------------------- | ------------- | ------------------------- |
| POST   | `/auth/login`           | Public        | Login user or agent       |
| GET    | `/auth/me`              | Authenticated | Get current user profile  |
| POST   | `/auth/refresh-token`   | Public        | Refresh access token      |
| PATCH  | `/auth/change-password` | Authenticated | Change password           |
| POST   | `/auth/forgot-password` | Public        | Send password reset link  |
| PATCH  | `/auth/reset-password`  | Public        | Reset password with token |

#### 👤 User Module

| Method | Endpoint                   | Access                    | Description              |
| ------ | -------------------------- | ------------------------- | ------------------------ |
| POST   | `/user/register-customer`  | Public                    | Register a new customer  |
| POST   | `/user/register-moderator` | Admin                     | Register a new moderator |
| PATCH  | `/user/update-my-profile`  | Authenticated (all roles) | Update own profile       |
| GET    | `/user/customers`          | Admin, Moderator          | Get all customers        |
| GET    | `/user/moderators`         | Admin                     | Get all moderators       |
| GET    | `/user/:id`                | Admin                     | Get single user info     |
| PATCH  | `/user/soft-delete/:id`    | Admin, Moderator          | Soft delete a user       |

#### 📦 Product Module
| Method | Endpoint                | Access           | Description                |
| ------ | ----------------------- | ---------------- | -------------------------- |
| POST   | `/product`              | Admin, Moderator | Create a new product       |
| GET    | `/product`              | Public           | Get all products           |
| GET    | `/product/:productCode` | Public           | Get single product by code |
| PATCH  | `/product/:productCode` | Admin, Moderator | Update product by code     |
| DELETE | `/product/:productCode` | Admin, Moderator | Delete product by code     |

#### 🏷️ Category Module
| Method | Endpoint        | Access           | Description           |
| ------ | --------------- | ---------------- | --------------------- |
| POST   | `/category`     | Admin, Moderator | Create a new category |
| GET    | `/category`     | Public           | Get all categories    |
| GET    | `/category/:id` | Public           | Get single category   |
| PATCH  | `/category/:id` | Admin, Moderator | Update category       |
| DELETE | `/category/:id` | Admin, Moderator | Delete category       |
