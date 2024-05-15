import KoaRouter from "koa-router";
import { taskQuery, taskInsert, taskRemove, taskUpdate } from "./ctrl.js";

const router = new KoaRouter();

router.post("/task/query", taskQuery);
router.post("/task/insert", taskInsert);
router.post("/task/remove", taskRemove);
router.post("/task/update", taskUpdate);

export default router;
