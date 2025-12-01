import { Router } from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { registerCustomerZodSchema, registerModeratorZodSchema } from "./user.validation";
import { checkAuth } from "../../utils/checkAuth";
import { UserRole } from "@prisma/client";

const router = Router();


router.post("/register-customer", validateRequest(registerCustomerZodSchema), UserController.registerCustomer);
router.post("/register-moderator", checkAuth(UserRole.ADMIN), validateRequest(registerModeratorZodSchema), UserController.registerModerator);



export const UserRouters = router;