import KoaRouter from "koa-router";
import { metaTicket } from "./ctrl.js";

const router = new KoaRouter();

router.post("/meta/ticket", metaTicket);

export default router;
