import axios from "axios";

import dotenv from "dotenv";

dotenv.config();

export const kakaoToken = async (code, redirect) => {
  try {
    const response = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      {
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_REST_KEY,
        code: code,
        redirect_uri: redirect,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const kakaoUser = async (accessToken) => {
  try {
    const response = await axios.post(
      "https://kapi.kakao.com/v2/user/me",
      {},
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
};
