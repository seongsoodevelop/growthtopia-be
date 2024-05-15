import createPromise from "./query.js";
import { DateTimeOrNull as dn, valueOrNull as vn } from "./dataTools.js";

export const userProfileFind = (user_no) => {
  return createPromise(`SELECT * FROM user_profile WHERE user_no=?`, [
    user_no,
  ]).then((res) => {
    if (res.length === 0) return null;
    else if (res.length === 1) return res[0];
    else throw new Error("userProfileFind");
  });
};

export const userProfileInsert = ({
  user_no,
  nickname,
  email,
  phone_number,
}) => {
  return createPromise(
    `INSERT INTO user_profile (user_no, nickname, email, phone_number) VALUE (?, ?, ?, ?)`,
    [user_no, nickname, vn(email), vn(phone_number)]
  );
};

export const userProfileUpdateWorkTask = ({
  user_no,
  work_task_id,
  work_task_start_at,
}) => {
  return createPromise(
    `UPDATE user_profile SET work_task_id=?, work_task_start_at=? WHERE user_no=?`,
    [vn(work_task_id), dn(work_task_start_at), user_no]
  );
};
