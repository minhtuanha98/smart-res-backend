import * as yup from "yup";
import { MESSAGES } from "../constants/messages";

const { TITLE_REQUIRE, APART_NUMBER_REQUIRE, CONTENT_REQUIRE, INVALID_IMAGE } =
  MESSAGES.FEEDBACK;

export const feedbackSchema = yup
  .object({
    body: yup.object({
      title: yup.string().required(TITLE_REQUIRE),
      content: yup.string().required(CONTENT_REQUIRE),
      apartNumber: yup.string().required(APART_NUMBER_REQUIRE),
    }),
    file: yup
      .object({
        mimetype: yup
          .string()
          .oneOf(["image/jpeg", "image/png", "image/jpg"], INVALID_IMAGE)
          .nullable(),
        filename: yup.string().nullable(),
      })
      .nullable(),
  })
  .meta({ hasFile: true });
