# 🛢️ Petro Data API

Petro Data is a fuel pricing analytics and reporting API built with NestJS. It offers endpoints for user management, price records, historical performance, and weekly insights across Nigeria's states and regions.

---

## 🚀 Features

- 🔐 Authenticated user registration and login with JWT
- 🔎 Search prices by state and region
- 📊 Weekly and historical price reporting
- 🧠 Product performance tracking with percentage change
- 🧼 Admin-only access guards
- 📃 Fully documented with Swagger UI
- 🧩 Built-in pagination support

---

## 🔧 Technologies

- **NestJS** (TypeScript)
- **MongoDB** (via Mongoose)
- **Passport.js** for auth
- **Swagger** for auto-generated API documentation
- **Class-validator & class-transformer** for DTO validation

---

## 🔐 Authentication & Authorization

Routes requiring protection use:

- `@UseGuards(JwtGuard, RoleGuard)`
- Roles available: `ADMIN`, `USER`
- Protected endpoints include all price analytics and user fetch operations

JWT tokens are passed in requests via:

```http
Authorization: Bearer <your-token>
