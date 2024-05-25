import fs from "fs";

export const getSSLOptions = () => {
  return {
    key: fs.readFileSync("../certificate/privkey.pem", "utf8").toString(),
    cert: fs.readFileSync("../certificate/fullchain.pem", "utf8").toString(),
  };
};
