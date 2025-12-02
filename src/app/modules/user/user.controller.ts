import httpStatus from 'http-status-codes';
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NextFunction, Request, Response } from 'express';
import { UserService } from './user.service';
import { JwtPayload } from 'jsonwebtoken';


const registerCustomer = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await UserService.registerCustomer(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Customer registered successfully",
    data: result,
  });
});

const registerModerator = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await UserService.registerModerator(req.body); 

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Moderator registered successfully",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = {
    ...req.body,
    profileFile: req.file as Express.Multer.File
  }
  const result = await UserService.updateMyProfile(payload, req.user as JwtPayload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});


export const UserController = {
  registerCustomer,
  registerModerator,
  updateMyProfile
};