import createPromise from "./query.js";
import { DateTimeOrNull, valueOrNull as vn } from "./dataTools.js";

export const userMetaFind = (user_no) => {
  return createPromise(`SELECT * FROM user_meta WHERE user_no=?`, [
    user_no,
  ]).then((res) => {
    if (res.length === 0) return null;
    else if (res.length === 1) return res[0];
    else throw new Error("userMetaFind");
  });
};

export const userMetaInsert = ({ user_no }) => {
  return createPromise(`INSERT INTO user_meta (user_no) VALUE (?)`, [user_no]);
};

export const userMetaUpdateTicketToken = ({ user_no, ticket_token }) => {
  return createPromise(`UPDATE user_meta SET ticket_token=? WHERE user_no=?`, [
    vn(ticket_token),
    user_no,
  ]);
};
