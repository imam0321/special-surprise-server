import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthService } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookies";

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

export const AuthController = {
  credentialLogin
};