import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthService } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookies";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";

const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await AuthService.credentialLogin(req.body);

  setAuthCookie(res, result);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful",
    data: null,
  });
});

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedToken = req.user;
  const result = await AuthService.getMe(decodedToken as JwtPayload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My profile retrieved successful",
    data: result,
  });
});

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw new AppError(httpStatus.BAD_REQUEST, "Refresh Token Not Found");
  }

  const tokenInfo = await AuthService.getNewAccessToken(refreshToken as string);
  setAuthCookie(res, tokenInfo);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New Access Token Retried Successfully",
    data: null,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await AuthService.changePassword(req.user as JwtPayload, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully",
    data: null,
  });
});

export const AuthController = {
  credentialLogin,
  getMe,
  getNewAccessToken,
  changePassword
};