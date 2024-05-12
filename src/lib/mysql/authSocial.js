import createPromise from "./query.js";
import { DateTimeOrNull, valueOrNull as vn } from "./dataTools.js";

export const SOCIAL_TYPE = { EMAIL: 0, KAKAO: 1 };

export const authSocialFind = (user_no) => {
  return createPromise(`SELECT * FROM auth_social WHERE user_no=?`, [
    user_no,
  ]).then((res) => {
    if (res.length === 0) return null;
    else if (res.length === 1) return res[0];
    else throw new Error("authSocialFind");
  });
};

export const authSocialFindExternal = (social_type, external_id) => {
  return createPromise(
    `SELECT * FROM auth_social WHERE social_type=? AND external_id=?`,
    [social_type, external_id]
  ).then((res) => {
    if (res.length === 0) return null;
    else if (res.length === 1) return res[0];
    else throw new Error("authSocialFindExternal");
  });
};

export const authSocialInsert = ({ user_no, social_type, external_id }) => {
  return createPromise(
    `INSERT INTO auth_social (user_no, social_type, external_id) VALUE (?, ?, ?)`,
    [user_no, social_type, external_id]
  );
};
