import { Router } from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { registerCustomerZodSchema, registerModeratorZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../utils/checkAuth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../config/cloudinary.config";

const router = Router();

router.post("/register-customer", validateRequest(registerCustomerZodSchema), UserController.registerCustomer);
router.post("/register-moderator", checkAuth(UserRole.ADMIN), validateRequest(registerModeratorZodSchema), UserController.registerModerator);
router.patch(
  "/update-my-profile",
  checkAuth(...Object.values(UserRole)),
  fileUploader.upload.single('file'),
  validateRequest(updateUserZodSchema),
  UserController.updateMyProfile
);
router.get("/customers", checkAuth(UserRole.ADMIN, UserRole.MODERATOR), UserController.getAllCustomers);
router.get("/moderators", checkAuth(UserRole.ADMIN), UserController.getAllModerators);
router.get("/:id", checkAuth(UserRole.ADMIN), UserController.getSingleUserById);
router.patch("/soft-delete/:id", checkAuth(UserRole.ADMIN, UserRole.MODERATOR), UserController.softDeleteUserById);


export const UserRouters = router;