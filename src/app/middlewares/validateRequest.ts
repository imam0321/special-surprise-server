import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodRawShape } from "zod";

const validateRequest = (zodSchema: ZodObject<ZodRawShape>) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data)
    }

    req.body = await zodSchema.parseAsync(req.body);

    return next();
  } catch (error) {
    next(error)
  }
}

export default validateRequest