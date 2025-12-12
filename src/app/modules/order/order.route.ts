import { Router } from "express";
import { checkAuth } from "../../utils/checkAuth";
import { UserRole } from "@prisma/client";
import { OrderController } from "./order.controller";


const router = Router();

router.post("/create-order", checkAuth(UserRole.USER), OrderController.createOrder);


export const OrderRouters = router; 