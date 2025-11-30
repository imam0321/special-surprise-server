import { UserRole } from "@prisma/client";
import { prisma } from "../config/db";
import { envVars } from "../config/env";

export const seedAdmin = async () => {
  try {
    const isAdminExist = await prisma.user.findUnique({
      where: {
        email: envVars.ADMIN.ADMIN_EMAIL,
      },
    });

    if (isAdminExist) {
      console.log("Admin user already exists");
      return;
    }

    const newAdmin = await prisma.user.create({
      data: {
        name: "Admin",
        email: envVars.ADMIN.ADMIN_EMAIL,
        password: envVars.ADMIN.ADMIN_PASSWORD,
        role: UserRole.ADMIN,
        address: {
          create: {
            city: "Dhaka",
            country: "Bangladesh",
            address_detail: "Mirpur 10, House 5, Road 3",
          },
        },
      },
      include: { address: true }
    });

    console.log("Admin user created successfully:", newAdmin);

  } catch (error) {
    console.log(error)
  }
}