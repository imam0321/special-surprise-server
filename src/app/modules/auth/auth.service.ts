import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { isUserExist } from '../../utils/isUserExist';
import bcrypt from 'bcryptjs';
import { createUserTokens } from '../../utils/userTokens';

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

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken
  };
}


export const AuthService = {
  credentialLogin
};