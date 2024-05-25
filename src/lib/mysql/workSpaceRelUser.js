import createPromise from "./query.js";
import { DateTimeOrNull, valueOrNull as vn } from "./dataTools.js";

export const workSpaceRelUserQueryByUser = (user_no) => {
  return createPromise(`SELECT * FROM work_space_rel_user WHERE user_no=?`, [
    user_no,
  ]);
};

export const workSpaceRelUserInsert = ({ space_id, user_no, rel_order }) => {
  return createPromise(
    `INSERT INTO work_space_rel_user (space_id, user_no, rel_order) VALUES (?, ?, ?)`,
    [space_id, user_no, rel_order]
  );
};
