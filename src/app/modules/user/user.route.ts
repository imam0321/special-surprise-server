import { Router } from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { registerCustomerZodSchema } from "./user.validation";

const router = Router();


router.post("/register-customer", validateRequest(registerCustomerZodSchema), UserController.registerCustomer);



export const UserRouters = router;