import { Router } from "express";
import { checkAuth } from "../../utils/checkAuth";
import { UserRole } from "@prisma/client";
import { ProductController } from "./product.controller";
import { fileUploader } from "../../config/cloudinary.config";
import validateRequest from "../../middlewares/validateRequest";
import { createProductZodSchema, updateProductZodSchema } from "./product.validation";


const router = Router();

router.post("/",
  fileUploader.upload.single("file"),
  validateRequest(createProductZodSchema),
  checkAuth(UserRole.ADMIN, UserRole.MODERATOR),
  ProductController.createProduct
);
router.get("/", ProductController.getAllProducts);
router.get("/:productCode", ProductController.getProductByProductCode);
router.patch("/:productCode",
  fileUploader.upload.single("file"),
  validateRequest(updateProductZodSchema),
  checkAuth(UserRole.ADMIN, UserRole.MODERATOR),
  ProductController.updateProduct
);
router.delete("/:productCode",
  checkAuth(UserRole.ADMIN, UserRole.MODERATOR),
  ProductController.deleteProduct
);

export const ProductRouters = router; 