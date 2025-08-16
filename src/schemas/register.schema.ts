import * as yup from "yup";
import { MESSAGES } from "../constants/messages";
import { GENDER } from "../types/userType";

const {
  FULLNAME_REQUIRE,
  USERNAME_MIN,
  USERNAME_REQUIRE,
  INVALID_EMAIL,
  EMAIL_REQUIRE,
  PASSWORD_REQUIRE,
  INVALID_PASSWORD_LOWERCASE,
  INVALID_PASSWORD_UPPERCASE,
  INVALID_PASSWORD_NUMBER,
  INVALID_PASSWORD_CHARACTER,
  DOB,
  GENDER_REQUIRE,
  INVALID_GENDER,
  APART_NUMBER,
  USERNAME_SPACE,
} = MESSAGES.USER.VALIDATE;

const { MALE, FEMALE } = GENDER;

export const registerSchema = yup.object({
  fullname: yup.string().trim().strict(true).required(FULLNAME_REQUIRE),
  username: yup
    .string()
    .trim()
    .strict(true)
    .test(
      USERNAME_SPACE,
      (value) => value === undefined || value === value?.trim()
    )
    .min(5, USERNAME_MIN)
    .matches(/^\S*$/, USERNAME_SPACE)
    .required(USERNAME_REQUIRE),
  email: yup
    .string()
    .trim()
    .strict(true)
    .email(INVALID_EMAIL)
    .required(EMAIL_REQUIRE),
  password: yup
    .string()
    .matches(/[a-z]/, INVALID_PASSWORD_LOWERCASE)
    .matches(/[A-Z]/, INVALID_PASSWORD_UPPERCASE)
    .matches(/[0-9]/, INVALID_PASSWORD_NUMBER)
    .matches(/[^a-zA-Z0-9]/, INVALID_PASSWORD_CHARACTER)
    .required(PASSWORD_REQUIRE),
  dob: yup.date().max(new Date()).required(DOB),
  apartNumber: yup.string().trim().strict(true).required(APART_NUMBER),
  gender: yup
    .string()
    .oneOf([MALE, FEMALE], INVALID_GENDER)
    .required(GENDER_REQUIRE),
});
