import httpStatus from 'http-status-codes';
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NextFunction, Request, Response } from 'express';
import { UserService } from './user.service';


const registerCustomer = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await UserService.registerCustomer(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Customer registered successfully",
    data: result,
  });
});



export const UserController = {
  registerCustomer,
};