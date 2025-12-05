import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import { ProductService } from "./product.service";
import httpStatus from "http-status-codes";

const createProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = {
    ...req.body,
    thumbnailFile: req.file as Express.Multer.File
  }
  const result = await ProductService.createProduct(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await ProductService.getAllProducts(req.query as Record<string, string>);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products retrieve successfully",
    data: result.data,
    meta: result.meta
  });
});


export const ProductController = {
  createProduct,
  getAllProducts
}