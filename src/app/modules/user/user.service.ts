import { prisma } from "../../config/db";
import bcrypt from "bcryptjs";
import { RegisterCustomerPayload } from "./user.interface";

const registerCustomer = async (payload: RegisterCustomerPayload) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload?.email,
    },
  });
  if (isUserExist) {
    throw new Error("User already exists with this email");
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

export const UserService = {
  registerCustomer,
}; 