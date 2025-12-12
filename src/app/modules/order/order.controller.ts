import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { OrderService } from "./order.service";
import { JwtPayload } from "jsonwebtoken";

const createOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedToken = req.user as JwtPayload
  const result = await OrderService.createOrder(req.body, decodedToken.email);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order created successfully",
    data: result,
  });
});


export const OrderController = {
  createOrder,
}