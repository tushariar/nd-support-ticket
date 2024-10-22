import { ZodIssue } from "zod";

export const formatZodErrors = (errors: ZodIssue[]) => {
  return errors.map((err: ZodIssue) => {
    return {
      field: err.path.join("."),
      message: err.message,
    };
  });
};
