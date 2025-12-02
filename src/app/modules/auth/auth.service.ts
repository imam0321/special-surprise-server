import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { isUserExist } from '../../utils/isUserExist';
import bcrypt from 'bcryptjs';
import { createNewAccessTokenWithRefreshToken, createUserTokens } from '../../utils/userTokens';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env';
import { prisma } from '../../config/db';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendEmail';

const credentialLogin = async (payload: { email: string, password: string }) => {
  const user = await isUserExist(payload.email);

  const isCorrectPassword = await bcrypt.compare(payload.password, user.password);

  if (!isCorrectPassword) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Password is incorrect");
  }

  const JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const tokens = createUserTokens(JwtPayload);
  return tokens;
}

const getMe = async (decodedToken: JwtPayload) => {
  const user = await isUserExist(decodedToken.email);
  const { password, ...userData } = user;
  return userData;
}

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken.accessToken,
    refreshToken: newAccessToken.refreshToken
  };
}

const changePassword = async (user: JwtPayload, payload: { oldPassword: string, newPassword: string }) => {
  const userInfo = await isUserExist(user.email);

  if (payload.oldPassword === payload.newPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "New password must be different from the old password");
  }

  const isCorrectPassword = await bcrypt.compare(payload.oldPassword, userInfo.password);
  if (!isCorrectPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Old password is incorrect");
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, Number(envVars.BCRYPT_SALT_ROUND));

  await prisma.user.update({
    where: {
      email: userInfo.email
    },
    data: {
      password: hashedPassword,
    }
  })
}

const forgotPassword = async (payload: { email: string }) => {
  const userInfo = await isUserExist(payload.email);

  const jwtPayload = {
    userId: userInfo.id,
    email: userInfo.email,
    role: userInfo.role,
  };

  const resetToken = jwt.sign(jwtPayload, envVars.JWT.JWT_ACCESS_SECRET, {
    expiresIn: "10m",
  });

  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${userInfo.id}&token=${resetToken}`;

  await sendEmail({
    to: userInfo.email,
    subject: "Password Reset",
    templateName: "forgotPassword",
    templateData: {
      name: userInfo.name,
      resetUILink,
    },
  });

};

const resetPassword = async (decodedToken: JwtPayload, id: string, newPassword: string) => {
  if (id != decodedToken.userId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can not reset your password!"
    );
  }

  const userInfo = await isUserExist(decodedToken.email);

  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  await prisma.user.update({
    where: {
      id: userInfo.id
    },
    data: {
      password: hashPassword
    }
  })
};


export const AuthService = {
  credentialLogin,
  getMe,
  getNewAccessToken,
  changePassword,
  forgotPassword,
  resetPassword
};