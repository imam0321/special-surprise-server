import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../utils/checkAuth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/login", AuthController.credentialLogin);
router.get("/me", checkAuth(...Object.values(UserRole)), AuthController.getMe)
router.post('/refresh-token', AuthController.getNewAccessToken)
router.patch("/change-password", checkAuth(...Object.values(UserRole)), AuthController.changePassword);
// router.post("/forgot-password", AuthController.forgotPassword);
// router.post("/reset-password", AuthController.resetPassword);


export const AuthRouters = router;