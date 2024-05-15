import {
  SOCIAL_TYPE,
  authSocialFindExternal,
  authSocialInsert,
} from "#lib/mysql/authSocial.js";
import { userInsert, userUpdateRefreshToken } from "#lib/mysql/user.js";
import {
  userProfileFind,
  userProfileInsert,
  userProfileUpdateWorkTask,
} from "#lib/mysql/userProfile.js";

import {
  generateAccessToken,
  generateRefreshToken,
  generateTicketToken,
} from "#lib/token.js";

import dotenv from "dotenv";
import { userMetaUpdateTicketToken } from "#lib/mysql/userMeta.js";
import moment from "moment";
import { workTaskFind, workTaskUpdateDuration } from "#lib/mysql/workTask.js";

dotenv.config();

export const workStart = async (ctx, next) => {
  try {
    if (!ctx.request.user) {
      ctx.throw(401);
    }

    let userProfile = await userProfileFind(ctx.request.user.user_no);
    if (!userProfile) {
      ctx.throw(400);
    }
    if (userProfile.work_task_id || userProfile.work_task_start_at) {
      ctx.throw(400);
    }

    const { work_task_id } = ctx.request.body;

    const task = await workTaskFind(work_task_id);
    if (task.user_no !== ctx.request.user.user_no) {
      ctx.throw(401);
    }

    await userProfileUpdateWorkTask({
      user_no: ctx.request.user.user_no,
      work_task_id,
      work_task_start_at: moment().format(),
    });

    userProfile = await userProfileFind(ctx.request.user.user_no);
    userProfile.work_task = task;

    ctx.body = { userProfile };
  } catch (e) {
    console.log(e);
    ctx.throw(400, e.message);
  }
};

export const workEnd = async (ctx, next) => {
  try {
    if (!ctx.request.user) {
      ctx.throw(401);
    }

    let userProfile = await userProfileFind(ctx.request.user.user_no);
    if (!userProfile) {
      ctx.throw(400);
    }
    if (!userProfile.work_task_id || !userProfile.work_task_start_at) {
      ctx.throw(400);
    }

    await userProfileUpdateWorkTask({
      user_no: ctx.request.user.user_no,
      work_task_id: null,
      work_task_start_at: null,
    });

    let task = await workTaskFind(userProfile.work_task_id);
    const duration = Math.floor(
      moment
        .duration(moment().diff(moment(userProfile.work_task_start_at)))
        .asSeconds()
    );
    await workTaskUpdateDuration({
      duration: task.duration + duration,
      task_id: task.task_id,
    });
    task = await workTaskFind(userProfile.work_task_id);

    userProfile = await userProfileFind(ctx.request.user.user_no);
    userProfile.work_task = null;

    ctx.body = { userProfile, task };
  } catch (e) {
    console.log(e);
    ctx.throw(400, e.message);
  }
};

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
