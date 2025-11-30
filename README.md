# special-surprise-server



## 📦 API Endpoints

#### ✅ Auth Module

| Method | Endpoint                | Access        | Description              |
| ------ | ----------------------- | ------------- | ------------------------ |
| POST   | `/auth/login`           | Public        | Login user or agent      |
| GET    | `/auth/me`              | Authenticated | Get current user profile |
| POST   | `/auth/refresh-token`   | Public        | Refresh access token     |
| POST   | `/auth/change-password` | Authenticated | Change password          |
| POST   | `/auth/logout`          | Authenticated | Logout user              |

#### 👤 User Module

| Method | Endpoint                  | Access     | Description                   | 
| ------ | ------------------------- | ---------- | ----------------------------- |
| POST   | `/user/register-customer` | Public     | Register a new customer       |
| POST   | `/user/register-moderator`| Admin only | Register a new moderator      |
| GET    | `/user/:id`               | Admin only | Get single user or agent info |
| GET    | `/user/:id`               | Admin only | Get single user or agent info |