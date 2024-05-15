import createPromise from "./query.js";
import { DateTimeOrNull, valueOrNull as vn } from "./dataTools.js";

export const workSpaceFind = (space_id) => {
  return createPromise(`SELECT * FROM work_space WHERE space_id=?`, [
    space_id,
  ]).then((res) => {
    if (res.length === 0) return null;
    else if (res.length === 1) return res[0];
    else throw new Error("workSpaceFind");
  });
};

export const workSpaceInsert = ({ name }) => {
  return createPromise(`INSERT INTO work_space (name) VALUE (?)`, [name]);
};
