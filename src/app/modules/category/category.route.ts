import { Router } from "express";
import { CategoryController } from "./category.controller";
import { checkAuth } from "../../utils/checkAuth";
import { UserRole } from "@prisma/client";


const router = Router();


router.post("/", checkAuth(UserRole.ADMIN, UserRole.MODERATOR), CategoryController.createCategory);
router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getCategoryById);
router.patch("/:id", checkAuth(UserRole.ADMIN, UserRole.MODERATOR), CategoryController.updateCategory);
router.delete("/:id", checkAuth(UserRole.ADMIN, UserRole.MODERATOR), CategoryController.deleteCategory);



export const CategoryRouters = router;