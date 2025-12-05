import httpStatus from 'http-status-codes';
import { Product } from "@prisma/client";
import { prisma } from "../../config/db";
import AppError from "../../errorHelpers/AppError";
import { generateProductCode } from '../../utils/generateProductCode';
import { fileUploader } from '../../config/cloudinary.config';
import { QueryBuilder } from '../../utils/QueryBuilder';


const createProduct = async (payload: Partial<Product> & { thumbnailFile?: Express.Multer.File }) => {
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId
    }
  })

  if (!category) throw new AppError(httpStatus.BAD_REQUEST, "Category not found");

  const productCode = await generateProductCode(category.name);

  let updateThumbnailUrl: string = "";
  if (payload?.thumbnailFile) {
    const uploadResult = await fileUploader.uploadToCloudinary(payload.thumbnailFile);
    updateThumbnailUrl = uploadResult.secure_url;
  }

  const newProduct = await prisma.product.create({
    data: {
      productCode,
      title: payload?.title!,
      thumbnail: updateThumbnailUrl,
      items: payload?.items ?? [],
      price: payload?.price || 0,
      deliveryCharge: payload?.deliveryCharge,
      discountedPrice: payload?.discountedPrice,
      description: payload?.description || "",
      categoryId: category.id,
    }
  });

  return newProduct;
};

const getAllProducts = async (query: Record<string, string>) => {
  const { page, limit, sortBy, sortOrder, searchTerm, min, max } = query;

  const queryBuilder = new QueryBuilder(
    prisma.product,
    {
      page,
      limit,
      sortBy,
      sortOrder,
      searchTerm,
      searchFields: ["title", "productCode"],
    },
  )
    .addRangeFilter("price", min ? Number(min) : undefined, max ? Number(max) : undefined)
    .setInclude({ category: true });

  return await queryBuilder.exec();
}


export const ProductService = {
  createProduct,
  getAllProducts,
};