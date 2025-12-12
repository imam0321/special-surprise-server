import { Router } from "express";
import { UserRouters } from "../modules/user/user.route";
import { AuthRouters } from "../modules/auth/auth.route";
import { ProductRouters } from "../modules/product/product.route";
import { CategoryRouters } from "../modules/category/category.route";
import { OrderRouters } from "../modules/order/order.route";
import { PaymentRouters } from "../modules/payment/payment.route";

export const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        route: UserRouters,
    },
    {
        path: "/auth",
        route: AuthRouters,
    },
    {
        path: "/product",
        route: ProductRouters,
    },
    {
        path: "/category",
        route: CategoryRouters,
    },
    {
        path: "/order",
        route: OrderRouters,
    },
    {
        path: "/payment",
        route: PaymentRouters,
    },
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});