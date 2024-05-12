import fs from "fs";

export const getSSLOptions = () => {
  return {
    key: fs.readFileSync("./certificate/private.key", "utf8").toString(),
    cert: fs.readFileSync("./certificate/certificate.crt", "utf8").toString(),
  };
};
