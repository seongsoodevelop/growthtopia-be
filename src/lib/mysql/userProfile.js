import createPromise from "./query.js";
import { DateTimeOrNull, valueOrNull as vn } from "./dataTools.js";

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
