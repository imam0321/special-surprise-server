import { prisma } from "../config/db";

export const generateProductCode = async (categoryName: string) => {
  const prefix = categoryName.slice(0, 3).toUpperCase();

  let productCode = "";
  let isUnique = false;

  while (!isUnique) {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    productCode = `${prefix}-${randomNumber}`;

    const existing = await prisma.product.findUnique({
      where: { productCode },
    });

    if (!existing) isUnique = true;
  }

  return productCode;
};