import { UserStatus } from "@prisma/client";
import { prisma } from "../config/db";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";

export const isUserExist = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    }
  })
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User does not exist");
  }

  if (user.isDeleted === true) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User account is deleted");
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new AppError(httpStatus.UNAUTHORIZED, `User account is ${user.status}`);
  }

  return user;
}