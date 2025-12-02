import { prisma } from "../../config/db";
import bcrypt from "bcryptjs";
import { IRegisterCustomerPayload, IRegisterModeratorPayload, IUpdateUser } from "./user.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { User, UserRole } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { isUserExist } from "../../utils/isUserExist";
import { fileUploader } from "../../config/cloudinary.config";

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

const updateMyProfile = async (payload: Partial<IUpdateUser> & { profileFile?: Express.Multer.File }, user: JwtPayload) => {
  const userInfo = await isUserExist(user.email);

  let updateProfileUrl = userInfo?.profile;

  if (payload?.profileFile) {
    if (userInfo?.profile) {
      await fileUploader.deleteFromCloudinary(userInfo.profile);
    }

    const uploadResult = await fileUploader.uploadToCloudinary(payload.profileFile);
    updateProfileUrl = uploadResult.secure_url;
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userInfo.id,
    },
    data: {
      name: payload?.name,
      phone: payload?.phone,
      profile: updateProfileUrl,
      address: payload?.address ? {
        update: {
          city: payload?.address?.city,
          country: payload?.address?.country,
          address_detail: payload?.address?.address_detail,
        }
      } : undefined,
    },
    include: { address: true }
  });

  return updatedUser;
}

export const UserService = {
  registerCustomer,
  registerModerator,
  updateMyProfile
}; 