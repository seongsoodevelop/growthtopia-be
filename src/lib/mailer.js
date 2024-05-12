import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config();

const transporter =
  process.env.NODE_ENV === "production"
    ? nodemailer.createTransport({
        host: "smtp.cafe24.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
        tls: {
          rejectUnauthorized: true,
          minVersion: "TLSv1",
        },
      })
    : nodemailer.createTransport({
        host: "smtp.cafe24.com",
        port: 25,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
        ignoreTLS: true,
      });

export const sendVerify = (verify_type, verify_code, verify_email) => {
  let option = {};
  switch (verify_type) {
    default: {
      option = {
        subject: "[GrowthTopia] 인증 코드",
        html: `<div>인증 번호를 입력해주세요</div><h1>${verify_code}</h1>`,
      };
      break;
    }
  }

  const mailOption = {
    from: process.env.MAIL_USER,
    to: verify_email,
    ...option,
  };

  transporter.sendMail(mailOption, function (error, info) {
    if (error) {
      // console.log(error);
    } else {
      // console.log("Email sent: " + info.response);
    }
  });
};
