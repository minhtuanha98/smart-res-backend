import { NextFunction, Request, Response } from "express";
import { AnySchema } from "yup";
import { STATUS_CODE } from "../constants/statusCode";

const { BAD_REQUEST } = STATUS_CODE;

export const validateYupSchema = (schema: AnySchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    schema
      .validate(req.body, { abortEarly: false })
      .then(() => next())
      .catch((err) => {
        res.status(BAD_REQUEST).json({
          //   message: MESSAGES.USER.ERROR,
          errors: err.errors,
        });
      });
  };
};
