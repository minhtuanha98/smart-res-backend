export const MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: "XXXXX",
    UNAUTHORIZED: "XXXXX",
    FORBIDDEN: "XXXXX",
    NOT_FOUND: "404",
    INTERNAL_SERVER_ERROR: "Internal server error",
    DATABASE_ERROR: "Database error",
  },
  SESSION_TOKEN: {
    INVALID: "Invalid or expired refresh token",
    TOKEN_REQUIRED: "Token is required",
  },
  USER: {
    VALIDATE: {
      FULLNAME_REQUIRE: "Full name is required",
      USERNAME_MIN: "Username must be at least 5 characters",
      USERNAME_REQUIRE: "Username is required",
      INVALID_EMAIL: "Invalid email",
      EMAIL_REQUIRE: "Email is required",
      PASSWORD_REQUIRE: "Password is required",
      INVALID_PASSWORD_LOWERCASE:
        "Password must contain at least 1 lowercase letter",
      INVALID_PASSWORD_UPPERCASE:
        "Password must have at least 1 uppercase letter",
      INVALID_PASSWORD_NUMBER: "Password must have at least 1 number",
      INVALID_PASSWORD_CHARACTER:
        "Password must have at least 1 special character",
      DOB: "Date of birth is not empty",
      GENDER_REQUIRE: "Gender is require",
      INVALID_GENDER: "Invalid gender",
      INVALID_PHONE: "Invalid phone number",
      PHONE_REQUIRE: "Please enter phone number",
    },
    EXIST_USER: "User with this email already exists",
    CREATE_USER: "Create user fail",
    LOGIN_USER_FAIL: "Login user fail",
    ERROR: "Data is not valid",
    NOT_FOUND: "User not found",
    VERIFY_MAIL: "Email verified successfully",
    VERIFIED_MAIL: "Email has been verified",
    USER_FULL: "100 playerId already, can't create new user!",
    INVALID_PASSWORD: "Invalid password",
  },
};
