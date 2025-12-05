import { Router } from "express";
import { checkAuth } from "../../utils/checkAuth";
import { UserRole } from "@prisma/client";
import { ProductController } from "./product.controller";
import { fileUploader } from "../../config/cloudinary.config";
import validateRequest from "../../middlewares/validateRequest";
import { createProductZodSchema } from "./product.validation";


const router = Router();

router.post("/",
  fileUploader.upload.single("file"),
  validateRequest(createProductZodSchema),
  checkAuth(UserRole.ADMIN, UserRole.MODERATOR),
  ProductController.createProduct
);
router.get("/", ProductController.getAllProducts);


export const ProductRouters = router; 