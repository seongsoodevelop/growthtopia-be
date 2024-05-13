import {
  SOCIAL_TYPE,
  authSocialFindExternal,
  authSocialInsert,
} from "#lib/mysql/authSocial.js";
import { userInsert, userUpdateRefreshToken } from "#lib/mysql/user.js";
import { userProfileFind, userProfileInsert } from "#lib/mysql/userProfile.js";

import { generateAccessToken, generateRefreshToken } from "#lib/token.js";
import { getCookieSecureOptions } from "#lib/option/cookieOptions.js";

import { kakaoToken, kakaoUser } from "#lib/kakaoTools.js";

import dotenv from "dotenv";
import { userMetaInsert } from "#lib/mysql/userMeta.js";

dotenv.config();

export const sessionHi = async (ctx, next) => {
  try {
    if (ctx.request.user) {
      ctx.body = {
        loggedData: {
          user_no: ctx.request.user.user_no,
          nickname: ctx.request.user.nickname,
        },
      };
    } else {
      throw new Error("인사 실패");
    }
  } catch (e) {
    ctx.throw(400, e.message);
  }
};

export const sessionBye = async (ctx, next) => {
  try {
    if (ctx.request.user) {
      await userUpdateRefreshToken({
        user_no: ctx.request.user.user_no,
        refresh_token: null,
      });
    }

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
  } catch (e) {
    ctx.throw(400, e.message);
  }
};

export const socialKakao = async (ctx, next) => {
  try {
    const { code, redirect } = ctx.request.body;
    const kakaoTokenData = await kakaoToken(code, redirect);
    const { access_token: kakaoAccessToken, refresh_token: kakaoRefreshToken } =
      kakaoTokenData;
    const kakaoUserData = await kakaoUser(kakaoAccessToken);
    const {
      id: kakaoId,
      kakao_account: { phone_number: phoneNumber, email },
    } = kakaoUserData;

    let authSocial = await authSocialFindExternal(SOCIAL_TYPE.KAKAO, kakaoId);
    if (authSocial) {
    } else {
      const userInsertResponse = await userInsert({});
      const authSocialInsertResponse = await authSocialInsert({
        user_no: userInsertResponse.insertId,
        social_type: SOCIAL_TYPE.KAKAO,
        external_id: kakaoId,
      });
      const userProfileInsertResponse = await userProfileInsert({
        user_no: userInsertResponse.insertId,
        nickname: `inquirist${userInsertResponse.insertId}`,
        email: email,
        phone_number: phoneNumber,
      });
      const userMetaInsertResponse = await userMetaInsert({
        user_no: userInsertResponse.insertId,
      });

      authSocial = await authSocialFindExternal(SOCIAL_TYPE.KAKAO, kakaoId);
    }

    let userProfile = await userProfileFind(authSocial.user_no);

    const accessToken = await generateAccessToken(userProfile);
    const refreshToken = await generateRefreshToken();

    await userUpdateRefreshToken({
      user_no: authSocial.user_no,
      refresh_token: refreshToken,
    });

    ctx.cookies.set(
      "accessToken",
      accessToken,
      getCookieSecureOptions(process.env.NODE_ENV === "production")
    );
    ctx.cookies.set(
      "refreshToken",
      refreshToken,
      getCookieSecureOptions(process.env.NODE_ENV === "production")
    );

    ctx.body = {};
  } catch (e) {
    ctx.throw(400, e.message);
  }
};
