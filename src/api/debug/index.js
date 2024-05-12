import KoaRouter from "koa-router";
import { get } from "./ctrl.js";

const router = new KoaRouter();
router.get("/", get);

export default router;
