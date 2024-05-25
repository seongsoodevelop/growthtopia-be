import createPromise from "./query.js";
import { DateTimeOrNull, valueOrNull as vn } from "./dataTools.js";

export const metaPropertyRightQueryByUser = (user_no) => {
  return createPromise(`SELECT * FROM meta_property_right WHERE user_no=?`, [
    user_no,
  ]);
};

export const metaPropertyRightQueryByProperty = (property_id) => {
  return createPromise(
    `SELECT * FROM meta_property_right WHERE property_id=?`,
    [property_id]
  );
};

export const metaPropertyRightInsert = ({
  user_no,
  property_id,
  right_level,
}) => {
  return createPromise(
    `INSERT INTO meta_property_right (user_no, property_id, right_level) VALUE (?, ?, ?)`,
    [user_no, property_id, right_level]
  );
};
