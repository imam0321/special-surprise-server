import { UserRole } from "@prisma/client";
import { envVars } from "../config/env";
import { generateToken, verifyToken } from "./jwt";
import { JwtPayload } from "jsonwebtoken";
import { isUserExist } from "./isUserExist";

export const createUserTokens = (user: { id: string, email: string, role: UserRole }) => {
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT.JWT_ACCESS_SECRET,
    envVars.JWT.JWT_ACCESS_EXPIRES
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT.JWT_REFRESH_SECRET,
    envVars.JWT.JWT_REFRESH_EXPIRES
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const verifyRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const user = await isUserExist(verifyRefreshToken.email as string);

  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const newAccessToken = generateToken(
    jwtPayload,
    envVars.JWT.JWT_ACCESS_SECRET,
    envVars.JWT.JWT_ACCESS_EXPIRES
  );

  const newRefreshToken = generateToken(
    jwtPayload,
    envVars.JWT.JWT_REFRESH_SECRET,
    envVars.JWT.JWT_REFRESH_EXPIRES
  );


  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};