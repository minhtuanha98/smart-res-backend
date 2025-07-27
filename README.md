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

src/
templates/ # Email templates
docs/ # Documentation

## Project Structure

```
smart-res-backend/
├── src/
│   ├── app.ts              # Express app setup
│   ├── server.ts           # Server bootstrap
│   ├── swagger.yaml        # OpenAPI documentation
│   ├── controllers/        # Request handlers (User, Auth, Feedback...)
│   ├── services/           # Business logic (User, Feedback...)
│   ├── repositories/       # Data access (via Prisma ORM)
│   ├── middlewares/        # Middleware (auth, error, validation, extract meta)
│   ├── schemas/            # Yup validation schemas
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utilities (logger, redis, multer...)
│   ├── constants/          # Constants (messages, status codes...)
│   ├── errors/             # Custom error classes
│   ├── routes/             # API route definitions
│   ├── lib/                # Additional libraries (if any)
│   └── __tests__/          # Unit & integration tests
├── prisma/
│   └── schema.prisma       # Prisma schema (DB models)
├── templates/              # Email templates (if used)
├── docs/                   # Additional documentation
├── Dockerfile              # Docker build file
├── docker-compose.yml      # Docker Compose config
├── package.json            # Node.js dependencies & scripts
├── tsconfig.json           # TypeScript config
└── README.md               # Project guide
```

Quick description of main folders:

- `src/`: All backend source code
- `prisma/`: Prisma schema and database definitions
- `templates/`: Email templates (if any)
- `docs/`: Additional documentation
- `__tests__/`: Unit and integration tests
- `Dockerfile`, `docker-compose.yml`: Docker deployment

## Installation

1. Clone the repository
2. Create a `.env` file in the root directory and configure your environment variables (see below)
3. Install dependencies:
   ```bash
   npm install
   ```

## Seeding Sample Data

To populate the database with sample data, run the following command:

```bash
npm run db:seed
```

Or directly with Node.js:

```bash
node src/seed.js
```

This will insert initial users and feedbacks as defined in `src/seed.js` into your database. Make sure your database service is running before seeding.

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
