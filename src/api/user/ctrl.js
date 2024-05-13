import {
  SOCIAL_TYPE,
  authSocialFindExternal,
  authSocialInsert,
} from "#lib/mysql/authSocial.js";
import { userInsert, userUpdateRefreshToken } from "#lib/mysql/user.js";
import { userProfileFind, userProfileInsert } from "#lib/mysql/userProfile.js";

import {
  generateAccessToken,
  generateRefreshToken,
  generateTicketToken,
} from "#lib/token.js";
import { getCookieSecureOptions } from "#lib/option/cookieOptions.js";

import { kakaoToken, kakaoUser } from "#lib/kakaoTools.js";

import dotenv from "dotenv";
import {
  userMetaInsert,
  userMetaUpdateTicketToken,
} from "#lib/mysql/userMeta.js";

dotenv.config();

export const metaTicket = async (ctx, next) => {
  try {
    if (ctx.request.user) {
      const userProfile = await userProfileFind(ctx.request.user.user_no);
      const ticketToken = await generateTicketToken(userProfile);

      await userMetaUpdateTicketToken({
        user_no: userProfile.user_no,
        ticket_token: ticketToken,
      });

      ctx.body = { ticketToken };
    } else {
      throw new Error("티켓 발행 실패");
    }
  } catch (e) {
    console.log(e);
    ctx.throw(400, e.message);
  }
};
