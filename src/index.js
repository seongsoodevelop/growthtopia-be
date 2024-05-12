import Koa from "koa";
import KoaBody from "koa-bodyparser";
import KoaCors from "@koa/cors";
import KoaRouter from "koa-router";

import https from "https";

import dotenv from "dotenv";
import { getSSLOptions } from "#lib/option/sslOptions.js";
import { getCorsOptions } from "#lib/option/corsOptions.js";

import API from "#api/index.js";
import { jwtMiddleware } from "#lib/token.js";

dotenv.config();
const isProduction = process.env.NODE_ENV === "production";

// app
const app = new Koa();

app.proxy = true;
app.use(KoaCors(getCorsOptions(isProduction)));
app.use(KoaBody());
app.use(jwtMiddleware);

// router
const router = new KoaRouter();
router.use("", API.routes());

app.use(router.routes());
app.use(router.allowedMethods());

// listen
if (isProduction) {
  const httpsServer = https.createServer(getSSLOptions(), app.callback());
  httpsServer.listen(process.env.PORT, function (err) {
    if (!!err) {
      console.error("HTTPS server FAIL: ", err, err && err.stack);
    } else {
      console.log(`HTTPS listening on port ${process.env.PORT}`);
    }
  });
} else {
  app.listen(process.env.PORT, () => {
    console.log(`HTTP listening on port ${process.env.PORT}`);
  });
}
