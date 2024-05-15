import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import { getCookieSecureOptions } from "#lib/option/cookieOptions.js";
import { userFind, userFindByRefreshToken } from "./mysql/user.js";
import { userProfileFind } from "./mysql/userProfile.js";

dotenv.config();

const jwt_secret_access = process.env.JWT_SECRET_ACCESS;
const jwt_secret_refresh = process.env.JWT_SECRET_REFRESH;
const jwt_secret_meta = process.env.JWT_SECRET_META;

export const generateAccessToken = (userProfile) => {
  return new Promise((resolve, reject) => {
    const payload = {
      user_no: userProfile.user_no,
    };
    jwt.sign(
      payload,
      jwt_secret_access,
      {
        expiresIn: "1h",
      },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    );
  });
};

export const generateRefreshToken = () => {
  return new Promise((resolve, reject) => {
    const payload = {
      version: process.env.VERSION,
    };
    jwt.sign(
      payload,
      jwt_secret_refresh,
      {
        expiresIn: "7d",
      },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    );
  });
};

export const generateTicketToken = (userProfile) => {
  return new Promise((resolve, reject) => {
    const payload = {
      user_no: userProfile.user_no,
    };
    jwt.sign(
      payload,
      jwt_secret_meta,
      {
        expiresIn: "1h",
      },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    );
  });
};

export const decodeToken = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, decoded) => {
      if (error) reject(error);
      resolve(decoded);
    });
  });
};

export const jwtMiddleware = async (ctx, next) => {
  try {
    const refreshToken = ctx.cookies.get("refreshToken");
    const accessToken = ctx.cookies.get("accessToken");
    if (!refreshToken || !accessToken) {
      return next();
    }

    const refreshDecoded = await decodeToken(refreshToken, jwt_secret_refresh);
    if (process.env.VERSION !== refreshDecoded.version) {
      throw new Error("버전 맞지 않음");
    }
    let accessDecoded = null;

    try {
      accessDecoded = await decodeToken(accessToken, jwt_secret_access);
    } catch (e) {
      // 만료
      try {
        const user = await userFindByRefreshToken(refreshToken);
        if (user) {
          const userProfile = await userProfileFind(user.user_no);
          const freshAccessToken = await generateAccessToken(userProfile);
          ctx.cookies.set(
            "accessToken",
            freshAccessToken,
            getCookieSecureOptions(process.env.NODE_ENV === "production")
          );

          accessDecoded = await decodeToken(
            freshAccessToken,
            jwt_secret_access
          );
        } else {
          throw new Error("유저 없음");
        }
      } catch (e) {
        throw e;
      }
    }

    const user = await userFind(accessDecoded.user_no);
    if (!user) {
      throw new Error("유저 없음");
    }

    ctx.request.user = accessDecoded;
  } catch (e) {
    // token validate 실패
    ctx.cookies.set(
      "accessToken",
      null,
      getCookieSecureOptions(process.env.NODE_ENV === "production")
    );
    ctx.cookies.set(
      "refreshToken",
      null,
      getCookieSecureOptions(process.env.NODE_ENV === "production")
    );

    ctx.request.user = null;
  }

  return next();
};
