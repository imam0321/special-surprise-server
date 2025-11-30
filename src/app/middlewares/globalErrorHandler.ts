import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../errorHelpers/AppError";
import { ZodError } from "zod";
import { TErrorSources } from "../interfaces/error.types";

const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    let message = err.message || "Something went wrong!";
    let errorSources: TErrorSources[] = [];

    // Handle custom AppError
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errorSources.push({ path: "", message: err.message });
    }

    // Handle Zod validation error
    else if (err instanceof ZodError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = "Validation Error";
        errorSources = err.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
        }));
    }

    // Handle Prisma known request errors
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                statusCode = httpStatus.CONFLICT;
                message = "Duplicate key error: A unique constraint would be violated.";
                break;
            case "P2003":
                statusCode = httpStatus.BAD_REQUEST;
                message = "Foreign key constraint failed.";
                break;
            case "P2000":
                statusCode = httpStatus.BAD_REQUEST;
                message = "Value too long for column.";
                break;
            case "P2001":
                statusCode = httpStatus.NOT_FOUND;
                message = "Record not found.";
                break;
            case "P2004":
                statusCode = httpStatus.BAD_REQUEST;
                message = "A constraint failed on the database.";
                break;
            case "P1000":
                statusCode = httpStatus.UNAUTHORIZED;
                message = "Authentication failed against database server.";
                break;
            default:
                statusCode = httpStatus.INTERNAL_SERVER_ERROR;
                message = "Database error occurred.";
        }
        errorSources.push({ path: "", message });
    }

    // Prisma validation error
    else if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = "Prisma Validation Error";
        errorSources.push({ path: "", message: err.message });
    }

    // Prisma unknown request error
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = "Unknown Prisma error occurred";
        errorSources.push({ path: "", message: err.message });
    }

    // Prisma initialization error
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = "Prisma client failed to initialize";
        errorSources.push({ path: "", message: err.message });
    }

    // Fallback unknown errors
    else if (err instanceof Error) {
        errorSources.push({ path: "", message: err.message });
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

export default globalErrorHandler;
