import * as yup from "yup";
import { MESSAGES } from "../constants/messages";

const { USERNAME_REQUIRE, PASSWORD_REQUIRE } = MESSAGES.USER.VALIDATE;

export const loginSchema = yup.object({
  username: yup.string().trim().required(USERNAME_REQUIRE),
  password: yup.string().trim().required(PASSWORD_REQUIRE),
  rememberMe: yup.boolean().default(false),
});
