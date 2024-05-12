import CryptoJS from "crypto-js";

export const hash256 = (payload) => {
  const hash = CryptoJS.SHA256(payload).toString();
  return hash;
};
