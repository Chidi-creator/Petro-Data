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

# API Documentation

## Available Endpoints

### User Management

#### POST /auth/register

- **Description:** Registers a new user
- **Request Body:**
  - `firstName` (string) — First name of the user
  - `lastName` (string) — Last name of the user
  - `email` (string) — Email address (must be unique)
  - `password` (string) — User password
  - `phoneNumber` (string) — Nigerian phone number
- **Response:** `201 Created` with registered user data
- **Public Access**

#### POST /auth/login

- **Description:** Authenticates a user and returns a JWT token
- **Request Body:**
  - `email` (string)
  - `password` (string)
- **Response:** `{ user: UserObject, token: JWT }`
- **Public Access**

#### GET /users

- **Description:** Returns a paginated list of users
- **Auth Required:** ✅ `ADMIN`
- **Query Param:** `page` (number)
- **Response:** List of user profiles (with password excluded)

### Price Records

#### GET /prices

- **Description:** Fetch paginated fuel price records
- **Query Params:**
  - `state` (optional)
  - `region` (optional)
  - `page` (required)
- **Auth Required:** ✅ `ADMIN`, `USER`

#### GET /prices/search

- **Description:** Search price data using state name
- **Query Params:**
  - `query` (string)
  - `page` (number)
- **Auth Required:** ✅ `ADMIN`, `USER`

#### GET /prices/current

- **Description:** Fetch most recent price data
- **Query Params (Optional):**
  - `region` (string)
  - `state` (string)
- **Returns:** Latest record for matching state or grouped data
- **Auth Required:** ✅ `ADMIN`, `USER`

### Insights & History

#### GET /prices/history

- **Description:** Returns historical price data before a target date
- **Query Params:**
  - `period` (required, date)
  - `product` (required, enum)
  - `state` (optional)
  - `duration` (optional, string representing number)
- **Response:** Sorted history with price change
- **Auth Required:** ✅ `ADMIN`, `USER`

#### GET /prices/weekly

- **Description:** Returns weekly price report for a product and state
- **Query Params:**
  - `product` (required)
  - `state` (required)
  - `week` (required, number)
  - `year` (required, number)
- **Response:** Array of daily prices with summary stats
- **Auth Required:** ✅ `ADMIN`, `USER`

#### GET /prices/product/performance

- **Description:** Tracks change and percentage change of a product's price
- **Query Params:**
  - `period` (required)
  - `duration` (required)
  - `state` (required)
  - `product` (optional)
- **Returns:** Aggregated price movement
- **Auth Required:** ✅ `ADMIN`, `USER`

## Swagger API Docs

The full API documentation is auto-generated and available at:

```
https://petro-data.onrender.com/docs
```

It includes:

- All routes grouped by tags (`Users`, `Prices`)
- Input parameters, body schemas, and example values
- Global "Authorize" support for JWT Bearer tokens

To enable access:

1. Click **Authorize** at the top right of Swagger UI
2. Paste your JWT token
3. Interact with protected endpoints

## Response Examples

Here's a sample of a weekly report payload:

```json
{
  "state": "Abia",
  "product": "pms",
  "history": [
    { "period": "2024-12-08", "price": 1060.27 },
    { "period": "2024-12-07", "price": 1055.13 }
  ],
  "latest": 1060.27,
  "previous": 1055.13,
  "change": 5.14,
  "percentageChange": 0.0049
}
```
---

## 🔍 Search Prices by State

### `GET /prices/search`

Returns paginated fuel price records filtered by a query string (typically a state name).

**Query Parameters**

| Name  | Type   | Required | Description                                  | Example |
|-------|--------|----------|----------------------------------------------|---------|
| query | string | ✅        | Name of the state to search for              | `Kano`  |
| page  | number | ✅        | Page number for pagination (starts from 1)   | `1`     |

**Authentication Required**  
- ✅ Yes (Bearer token)
- ✅ Role: `USER` or `ADMIN`

**Sample Response**
```json
[
  {
    "state": "Kano",
    "region": "North West",
    "period": "2024-12-01T00:00:00.000Z",
    "pms": 1280,
    "ago": 1375,
    "dpk": 1450,
    "lpg": 1305
  }
]


```http
Authorization: Bearer <your-token>



```
