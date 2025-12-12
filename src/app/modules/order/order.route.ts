import { Router } from "express";
import { checkAuth } from "../../utils/checkAuth";
import { UserRole } from "@prisma/client";
import { OrderController } from "./order.controller";


const router = Router();

router.post("/create-order", checkAuth(UserRole.USER), OrderController.createOrder);
router.get("/", checkAuth(UserRole.ADMIN, UserRole.MODERATOR), OrderController.getAllOrders);
router.get("/my-orders", checkAuth(UserRole.USER), OrderController.getMyOrders);
router.patch("/:orderId/status", checkAuth(UserRole.ADMIN, UserRole.MODERATOR), OrderController.updateOrderStatus);


export const OrderRouters = router; 