/* eslint-disable @typescript-eslint/no-unused-vars */
import catchAsync from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { PaymentService } from "./payment.service";
import { envVars } from "../../config/env";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import sendResponse from "../../utils/sendResponse";

const initPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId;
    const result = await PaymentService.initPayment(orderId);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Payment done Successfully",
      data: result,
    });
  }
);

const successPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await PaymentService.successPayment(
      query as Record<string, string>
    );

    if (result.success) {
      res.redirect(
        `${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
      );
    }
  }
);

const failPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await PaymentService.failPayment(
      query as Record<string, string>
    );

    if (!result.success) {
      res.redirect(
        `${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
      );
    }
  }
);

const cancelPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await PaymentService.cancelPayment(
      query as Record<string, string>
    );

    if (!result.success) {
      res.redirect(
        `${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
      );
    }
  }
);

const validatePayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await SSLService.validatePayment(req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Payment Validated successfully",
      data: null,
    });
  }
);


export const PaymentController = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
  validatePayment
};
