import { prisma } from "../../config/db";
import bcrypt from "bcryptjs";
import { IRegisterCustomerPayload, IRegisterModeratorPayload, IUpdateUser } from "./user.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { Prisma, User, UserRole } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { isUserExist } from "../../utils/isUserExist";
import { fileUploader } from "../../config/cloudinary.config";
import { QueryBuilder } from "../../utils/QueryBuilder";

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

const getAllCustomers = async (query: Record<string, any>) => {
  const qb = new QueryBuilder(
    prisma.user,
    query,
    {
      isDeleted: query.isDeleted,
      status: query.status,
    },
  );

  qb.setInclude({
    address: {
      select: {
        city: true,
        country: true,
        address_detail: true,
      },
    },
  });

  qb.addWhere({ role: UserRole.USER });

  qb.options.searchFields = ["name", "email", "phone"];

  qb.options.sortBy = query.sortBy || "createdAt";
  qb.options.sortOrder = query.sortOrder || "desc";

  return await qb.exec();
};

const getAllModerators = async (query: Record<string, any>) => {
  const qb = new QueryBuilder(
    prisma.user,
    query,
    {
      isDeleted: query.isDeleted,
      status: query.status,
    },
  );

  qb.setInclude({
    address: {
      select: {
        city: true,
        country: true,
        address_detail: true,
      },
    },
  });

  qb.addWhere({ role: UserRole.MODERATOR });

  qb.options.searchFields = ["name", "email", "phone"];

  qb.options.sortBy = query.sortBy || "createdAt";
  qb.options.sortOrder = query.sortOrder || "desc";

  return await qb.exec();
};

const getSingleUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      address: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const { password, ...userInfo } = user;
  return userInfo;
}

const softDeleteUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const softDeletedUser = await prisma.user.update({
    where: { id },
    data: { isDeleted: true },
  });
  return softDeletedUser;
}


export const UserService = {
  registerCustomer,
  registerModerator,
  updateMyProfile,
  getAllCustomers,
  getAllModerators,
  getSingleUserById,
  softDeleteUserById
}; 