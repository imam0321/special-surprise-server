import { prisma } from "../../config/db";
import bcrypt from "bcryptjs";
import { IRegisterCustomerPayload, IRegisterModeratorPayload } from "./user.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { UserRole } from "@prisma/client";

const registerCustomer = async (payload: IRegisterCustomerPayload) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload?.email,
    },
  });
  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, "User already exists with this email");
  }
  const hashedPassword = await bcrypt.hash(payload?.password as string, Number(process.env.BCRYPT_SALT_ROUND));

  const newCustomer = await prisma.user.create({
    data: {
      name: payload?.name,
      email: payload?.email,
      password: hashedPassword,
      phone: payload?.phone,
      address: {
        create: {
          city: payload.address.city,
          country: payload.address.country,
          address_detail: payload.address.address_detail,
        },
      }
    },
    include: { address: true }
  });

  return newCustomer;
}

const registerModerator = async (payload: IRegisterModeratorPayload) => {
  const isModeratorExist = await prisma.user.findUnique({
    where: {
      email: payload?.email,
    },
  });
  if (isModeratorExist) {
    throw new AppError(httpStatus.CONFLICT, "Moderator already exists with this email");
  }
  const hashedPassword = await bcrypt.hash(payload?.password as string, Number(process.env.BCRYPT_SALT_ROUND));

  const newModerator = await prisma.user.create({
    data: {
      name: payload?.name,
      email: payload?.email,
      password: hashedPassword,
      phone: payload?.phone,
      role: UserRole.MODERATOR,
      nid: payload?.nid,
      address: {
        create: {
          city: payload.address.city,
          country: payload.address.country,
          address_detail: payload.address.address_detail,
        },
      }
    },
    include: { address: true }
  });

  return newModerator;
}

export const UserService = {
  registerCustomer,
  registerModerator
}; 