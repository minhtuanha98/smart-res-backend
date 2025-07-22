import { NextFunction, Request, Response } from "express";
import { AnySchema } from "yup";
import { STATUS_CODE } from "../constants/statusCode";

const { BAD_REQUEST } = STATUS_CODE;

export const validateYupSchema = (schema: AnySchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    const schemaMeta = schema.meta();
    if (schemaMeta && schemaMeta.hasFile) {
      schema
        .validate({ body: req.body, file: req.file }, { abortEarly: false })
        .then(() => next())
        .catch((err) => {
          res.status(BAD_REQUEST).json({
            errors: err.errors,
          });
        });
    } else {
      schema
        .validate(req.body, { abortEarly: false })
        .then(() => next())
        .catch((err) => {
          res.status(BAD_REQUEST).json({
            errors: err.errors,
          });
        });
    }
  };
};
