# Smart Resident Backend

A comprehensive backend API for Smart Resident management system built with Node.js, TypeScript, Express, MongoDB, and Redis.

## Features

- **Authentication & Authorization**: JWT-based authentication with refresh tokens
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis for session management and caching
- **Email Service**: Nodemailer with Handlebars templates
- **API Documentation**: Swagger/OpenAPI documentation
- **Validation**: Request validation with Yup
- **Logging**: Winston logger
- **Testing**: Jest with Supertest
- **Security**: bcrypt for password hashing, CORS protection

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Cache**: Redis
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Email**: Nodemailer with Handlebars
- **Validation**: Yup
- **Logging**: Winston
- **Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Testing**: Jest, Supertest
- **Development**: ts-node-dev, nodemon

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
├── validation/      # Request validation schemas
└── __tests__/       # Test files
templates/           # Email templates
docs/                # Documentation
```

## Installation

1. Clone the repository
2. Copy `.env.example` to `.env` and configure your environment variables
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

See `.env.example` for all required environment variables.

## API Documentation

When the server is running, visit `/api-docs` for Swagger documentation.

## License

ISC
