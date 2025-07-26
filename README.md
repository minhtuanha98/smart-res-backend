# Smart Resident Backend

A comprehensive backend API for Smart Resident management system built with Node.js, TypeScript, Express, MongoDB (Prisma), and Redis.

## Features

- **Authentication & Authorization**: JWT-based authentication with refresh tokens, role-based access (admin, resident)
- **Database**: MongoDB with Prisma ORM
- **Caching**: Redis for session management and token blacklist
- **API Documentation**: Swagger/OpenAPI (`/api-docs`)
- **Validation**: Request validation with Yup
- **Logging**: Winston logger
- **Testing**: Jest with Supertest
- **File Upload**: Multer for image upload
- **Security**: bcrypt for password hashing, CORS protection

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (Prisma)
- **Cache**: Redis
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Yup
- **Logging**: Winston
- **Documentation**: Swagger (swagger-ui-express, yamljs)
- **Testing**: Jest, Supertest
- **Development**: ts-node-dev, nodemon

## Project Structure

src/
templates/ # Email templates
docs/ # Documentation
├── **tests**/ # Test files (controller, service, repository)
├── config/ # Configuration files
├── constants/ # Constant values (messages, status codes)
├── controllers/ # Request handlers
├── errors/ # Custom error classes
├── lib/ # (Optional) Library code
├── middlewares/ # Custom middleware (auth, error, validation, extract meta)
├── repositories/ # Data access layer
├── routes/ # API route definitions
├── schemas/ # Yup validation schemas
├── services/ # Business logic
├── types/ # TypeScript type definitions
├── utils/ # Utility functions (logger, redis, multer)
├── app.ts # Express app setup
├── server.ts # Server bootstrap
├── swagger.yaml # OpenAPI documentation
prisma/
└── schema.prisma # Prisma schema

## Installation

1. Clone the repository
2. Create a `.env` file in the root directory and configure your environment variables (see below)
3. Install dependencies:
   ```bash
   npm install
   ```

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage
npm run test:coverage
```

## Environment Variables

You need to set up a `.env` file with at least the following variables:

```
PORT=7000
MONGO_URL=mongodb://localhost:27017/smart-resident
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
```

Adjust values as needed for your environment.

## API Documentation

When the server is running, visit: [http://localhost:7000/api-docs](http://localhost:7000/api-docs)
All endpoints, request/response schemas, and error codes are documented in `src/swagger.yaml`.

## Main API Endpoints

- `POST   /user/login` - User login
- `POST   /user/logout` - User logout
- `POST   /auth/refresh_token` - Refresh JWT token
- `GET    /user/list-user` - Get all users (admin)
- `POST   /user/feedback` - Create feedback (resident)
- `GET    /user/list/feedbacks` - Get feedback list (admin/resident)
- `PUT    /user/feedback/{id}` - Update feedback
- `DELETE /user/feedback/{id}` - Delete feedback
