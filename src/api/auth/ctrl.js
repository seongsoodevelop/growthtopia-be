import {
  SOCIAL_TYPE,
  authSocialFindExternal,
  authSocialInsert,
} from "#lib/mysql/authSocial.js";
import { userInsert, userUpdateRefreshToken } from "#lib/mysql/user.js";
import { userProfileFind, userProfileInsert } from "#lib/mysql/userProfile.js";
import { userMetaInsert } from "#lib/mysql/userMeta.js";
import { workSpaceInsert } from "#lib/mysql/workSpace.js";
import { workSpaceRelUserInsert } from "#lib/mysql/workSpaceRelUser.js";

import { generateAccessToken, generateRefreshToken } from "#lib/token.js";
import { getCookieSecureOptions } from "#lib/option/cookieOptions.js";

import { kakaoToken, kakaoUser } from "#lib/kakaoTools.js";

import dotenv from "dotenv";
import { workTaskFind } from "#lib/mysql/workTask.js";
import { metaPropertyInsert } from "#lib/mysql/metaProperty.js";
import { generateStarterPropertyData } from "#lib/meta/metaPropertyLib.js";
import { metaPropertyRightInsert } from "#lib/mysql/metaPropertyRight.js";

dotenv.config();

export const sessionHi = async (ctx, next) => {
  try {
    if (ctx.request.user) {
      let userProfile = await userProfileFind(ctx.request.user.user_no);

      if (userProfile.work_task_id) {
        const task = await workTaskFind(userProfile.work_task_id);
        userProfile.work_task = task;
      }

      ctx.body = {
        loggedData: {
          user_no: ctx.request.user.user_no,
          nickname: userProfile.nickname,
        },
        userProfile,
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

      const workSpaceInsertResponse = await workSpaceInsert({
        name: `inquirist${userInsertResponse.insertId}'s workspace`,
      });
      const workSpaceRelUserInsertResponse = await workSpaceRelUserInsert({
        space_id: workSpaceInsertResponse.insertId,
        user_no: userInsertResponse.insertId,
        rel_order: 0,
      });

      const metaPropertyInsertResponse = await metaPropertyInsert({
        position_x: 0,
        position_y: 0,
        position_z: 0,
        data: generateStarterPropertyData(),
      });
      const metaPropertyRightInsertResponse = await metaPropertyRightInsert({
        user_no: userInsertResponse.insertId,
        property_id: metaPropertyInsertResponse.insertId,
        right_level: 100,
      });

      const userMetaInsertResponse = await userMetaInsert({
        user_no: userInsertResponse.insertId,
        home_property_id: metaPropertyInsertResponse.insertId,
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
