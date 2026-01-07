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
  const qb = new QueryBuilder(prisma.product, query);
  
  qb.setInclude({
    category: {
      select: {
        name: true,
      },
    },
  });

  qb.addRangeFilter("price", query.min ? Number(query.min) : undefined, query.max ? Number(query.max) : undefined);

  if (query.category) {
    qb.addWhere({
      category: {
        name: {
          contains: query.category,
          mode: "insensitive",
        },
      },
    });
  }
  qb.options.searchFields = ["title", "productCode"];

  return await qb.exec();
};

const getProductByProductCode = async (productCode: string) => {
  const product = await prisma.product.findFirst({
    where: {
      productCode
    },
    include: {
      category: true
    }
  })

  if (!product) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product not found")
  }

  return product
}

const updateProduct = async (
  productCode: string,
  payload: Partial<Product> & { thumbnailFile?: Express.Multer.File }
) => {
  const product = await prisma.product.findUnique({ where: { productCode } });
  if (!product) throw new AppError(httpStatus.BAD_REQUEST, "Product not found");

  let updateThumbnailUrl = product.thumbnail;

  if (payload.thumbnailFile) {
    const uploadResult = await fileUploader.uploadToCloudinary(payload.thumbnailFile);
    updateThumbnailUrl = uploadResult.secure_url;

    if (product.thumbnail) {
      await fileUploader.deleteFromCloudinary(product.thumbnail);
    }
  }

  let updatedItems = product.items;
  if (payload.items) {
    updatedItems = [...payload.items];
  }

  return prisma.product.update({
    where: { productCode },
    data: {
      title: payload.title ?? product.title,
      thumbnail: updateThumbnailUrl,
      items: updatedItems,
      price: payload.price ?? product.price,
      deliveryCharge: payload.deliveryCharge ?? product.deliveryCharge,
      discountedPrice: payload.discountedPrice ?? product.discountedPrice,
      description: payload.description ?? product.description,
      categoryId: payload.categoryId ?? product.categoryId,
    }
  });
};

const deleteProduct = async (productCode: string) => {
  const product = await prisma.product.findUnique({ where: { productCode } });
  if (!product) throw new AppError(httpStatus.BAD_REQUEST, "Product not found");

  await fileUploader.deleteFromCloudinary(product?.thumbnail);

  return prisma.product.delete({ where: { productCode } });
};


export const ProductService = {
  createProduct,
  getAllProducts,
  getProductByProductCode,
  updateProduct,
  deleteProduct
};