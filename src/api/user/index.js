import KoaRouter from "koa-router";
import { workStart, workEnd, metaTicket } from "./ctrl.js";

const router = new KoaRouter();

router.post("/work/start", workStart);
router.post("/work/end", workEnd);
router.post("/meta/ticket", metaTicket);

export default router;
