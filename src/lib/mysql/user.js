import createPromise from "./query.js";
import { valueOrNull as vn } from "./dataTools.js";

export const userFind = (user_no) => {
  return createPromise(`SELECT * FROM user WHERE user_no=?`, [user_no]).then(
    (res) => {
      if (res.length === 0) return null;
      else if (res.length === 1) return res[0];
      else throw new Error("userFind");
    }
  );
};

export const userFindByRefreshToken = (refresh_token) => {
  return createPromise(`SELECT * FROM user WHERE refresh_token=?`, [
    refresh_token,
  ]).then((res) => {
    if (res.length === 0) return null;
    else if (res.length === 1) return res[0];
    else throw new Error("userFindByRefreshToken");
  });
};

export const userInsert = ({}) => {
  return createPromise(`INSERT INTO user`, []);
};

export const userUpdateRefreshToken = ({ user_no, refresh_token }) => {
  return createPromise(`UPDATE user SET refresh_token=? WHERE user_no=?`, [
    vn(refresh_token),
    user_no,
  ]);
};
