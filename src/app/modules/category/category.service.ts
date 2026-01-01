import httpStatus from "http-status-codes";
import { prisma } from "../../config/db";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";

const createCategory = async (name: string) => {
  if (!name) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category name is required");
  }
  return prisma.category.create({
    data: {
      name,
    },
  });
};

const getAllCategories = async (query: Record<string, string>) => {
  const qb = new QueryBuilder(prisma.category, query);
  qb.setInclude({
    _count: {
      select: {
        products: true,
      },
    },
  });

  return await qb.exec();
};

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }
  return category;
};

const updateCategory = async (id: string, name: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }
  return prisma.category.update({
    where: { id },
    data: { name },
  });
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }
  return prisma.category.delete({
    where: { id },
  });
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
