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
import {
  workTaskFind,
  workTaskInsert,
  workTaskQuery,
  workTaskRemove,
  workTaskUpdate,
} from "#lib/mysql/workTask.js";

dotenv.config();

export const taskQuery = async (ctx, next) => {
  try {
    if (!ctx.request.user) {
      ctx.throw(401);
    }

    const { start_at, end_at } = ctx.request.body;

    const data = await workTaskQuery(
      ctx.request.user.user_no,
      start_at,
      end_at
    );

    ctx.body = { data: data };
  } catch (e) {
    ctx.throw(400, e.message);
  }
};

export const taskInsert = async (ctx, next) => {
  try {
    if (!ctx.request.user) {
      ctx.throw(401);
    }

    const {
      at,
      name,
      duration_estimated,
      workspace_id,
      category_id,
      assignment_id,
    } = ctx.request.body;
    if (workspace_id) {
      // @TODO workspace 권한 check
      if (category_id) {
        // @TODO category 권한 check
      }
      if (assignment_id) {
        // @TODO assignment 권한 check
      }
    }

    // all passed
    const taskInsertResponse = await workTaskInsert({
      user_no: ctx.request.user.user_no,
      at,
      name,
      duration_estimated,
      workspace_id,
      category_id,
      assignment_id,
    });

    const task = await workTaskFind(taskInsertResponse.insertId);

    ctx.body = { task };
  } catch (e) {
    ctx.throw(400, e.message);
  }
};

export const taskRemove = async (ctx, next) => {
  try {
    if (!ctx.request.user) {
      ctx.throw(401);
    }

    const { task_id } = ctx.request.body;

    const task = await workTaskFind(task_id);
    if (!task) {
      ctx.throw(400);
    }
    if (task.user_no !== ctx.request.user.user_no) {
      ctx.throw(401);
    }

    await workTaskRemove(task_id);

    ctx.body = {};
  } catch (e) {
    ctx.throw(400, e.message);
  }
};

export const taskUpdate = async (ctx, next) => {
  try {
    if (!ctx.request.user) {
      ctx.throw(401);
    }
    const { data } = ctx.request.body;
    for (let i = 0; i < data.length; i++) {
      try {
        const o = data[i];

        const task = await workTaskFind(o.task_id);
        if (!task) {
          ctx.throw(400);
        }
        if (task.user_no !== ctx.request.user.user_no) {
          ctx.throw(401);
        }

        if (o.workspace_id !== task.workspace_id) {
          // @TODO workspace 권한 check
        }
        if (o.category_id !== task.category_id) {
          // @TODO category 권한 check
        }
        if (o.assignment_id !== task.assignment_id) {
          // @TODO assignment 권한 check
        }

        // all passed
        await workTaskUpdate({ ...o });
      } catch (e) {
        console.log(e);
      }
    }
    ctx.body = {};
  } catch (e) {
    console.log(e);
    ctx.throw(400, e.message);
  }
};
