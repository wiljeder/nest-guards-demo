# **NestJS Guards with Custom Decorators**

<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="200" alt="NestJS Logo" /></a>
</p>

📌 **Read the Full Article Here:** [Link to Article](https://wiljeder.hashnode.dev/leveraging-nestjs-guards)

## **📌 Overview**

This project demonstrates how to use **NestJS Guards with Custom Decorators** for:

- ✅ **JWT Authentication** (Validates token & injects user into request)
- ✅ **Role-Based Access Control (RBAC)** (Supports hierarchy & strict matching)
- ✅ **Rate Limiting** (Uses a sliding window algorithm based on user plans)

These guards make authorization **modular, reusable, and production-ready**.

## **🛠 Installation & Setup**

### **1️⃣ Clone the Repository**

```bash
git clone https://github.com/wiljeder/nest-guards-demo.git
cd nest-guards-demo
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Set Up Environment Variables

Create a .env file in the root directory:

```bash
JWT_SECRET=your-secret-key
```

### 4️⃣ Start the Server

```bash
npm run start
```

Server will run on http://localhost:3000 🚀

## 🛡 Guards & Decorators Explained

### 1️⃣ JWT Authentication Guard

- Validates JWT tokens using ConfigService.JWT_SECRET.
- Injects user data into request.user for later use.
- 📌 Decorator: No decorator needed. Runs automatically.

```typescript
@UseGuards(JWTAuthGuard)
```

### 2️⃣ Role-Based Access Control (RBAC)

- Restricts access based on user roles.
- Supports role hierarchy (e.g., admin can access manager routes).
- Supports strict role matching (only exact roles allowed).
- 📌 Decorator: @Roles(['role'], strict?)

```typescript
@UseGuards(JWTAuthGuard, RolesGuard)
@Roles(['manager']) // Admin also allowed due to hierarchy
getManagerDashboard() { ... }

@UseGuards(JWTAuthGuard, RolesGuard)
@Roles(['manager'], true) // Only managers allowed
getStrictManagerSettings() { ... }
```

### 3️⃣ Rate Limiting Guard

- Uses a sliding window algorithm for fair rate limiting.
- Limits requests per minute based on user plan.
- Anonymous users have a limit of 5 requests/min.
- 📌 No decorator needed → Runs automatically.

```typescript
@UseGuards(JWTAuthGuard, RateLimitGuard)
checkUsage() { ... }
```

## 🛠 Testing the API

### 1️⃣ Generate a JWT Token for Testing

Run the following in a Node.js environment:

```javascript
const jwt = require('jsonwebtoken');

const proAdminToken = jwt.sign(
  { id: '123', role: 'admin', plan: 'pro' },
  'your-secret-key',
  { expiresIn: '1h' },
);

const freeMemberToken = jwt.sign(
  { id: '123', role: 'member', plan: 'free' },
  'your-secret-key',
  { expiresIn: '1h' },
);

console.log({
  proAdminToken,
  freeMemberToken,
});
```

Copy the token and use it in API requests.

### 2️⃣ Test JWT Guard

#### ✅ Allowed (any of the generated tokens)

```bash
curl -H "Authorization: Bearer <your-token>" http://localhost:3000/user
```

This will return the following object:

```json
{
  "message": "User profile data",
  "user": {...}
}
```

#### ❌ Forbidden (Member or Unauthorized)

```bash
curl -H "Authorization: Bearer abcdef" http://localhost:3000/user
```

You’ll get:

```json
{
  "message": "Invalid token",
  "error": "Unauthorized",
  "statusCode": 401
}
```

### 3️⃣ Test Role-Based Access

#### ✅ Allowed (Admin or Manager)

```bash
curl -H "Authorization: Bearer <your-token>" http://localhost:3000/admin/dashboard
```

#### ❌ Forbidden (Member or Unauthorized)

```bash
curl -H "Authorization: Bearer <token-with-member-role>" http://localhost:3000/admin/settings
```

### 4️⃣ Test Rate Limiting

> Tip: you can use postman or insomnia to automate sending a number of requests

Run multiple times within a minute:

```bash
curl -H "Authorization: Bearer <your-token>" http://localhost:3000/usage
```

After exceeding the limit, you’ll get:

```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded. Try again in 58s"
}
```

# 🔧 Project Structure

```bash
src/
│── user/                # User module (JWT testing)
│── admin/               # Admin module (RBAC testing)
│── usage/               # Usage module (Rate limiting testing)
│── decorators/          # Custom decorators
│── guards/              # Custom guards (JWT, RBAC, RateLimit)
│── types/express.d.ts   # Extends Express Request with `user`
│── main.ts              # Entry point
│── app.module.ts        # App module with global config
```

# 🔗 Resources

- [NestJS Guards Documentation](https://docs.nestjs.com/guards)
- [NestJS Custom Decorators](https://docs.nestjs.com/custom-decorators)

# 🛠 Next Steps

### 🚀 Want to scale this further?

- Implement Redis-backed Rate Limiting for distributed environments.
- Add Permission-Based Access Control (PBAC) for fine-grained rules.
- Integrate WebSockets Guards for real-time app security.
- Contributions & suggestions are welcome! 🤝
