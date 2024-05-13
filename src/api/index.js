import KoaRouter from "koa-router";

import Debug from "./debug/index.js";
import Auth from "./auth/index.js";
import User from "./user/index.js";

const router = new KoaRouter();
router.use("/debug", Debug.routes());
router.use("/auth", Auth.routes());
router.use("/user", User.routes());

export default router;
