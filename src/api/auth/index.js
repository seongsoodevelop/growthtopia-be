import KoaRouter from "koa-router";
import { socialKakao, greeting } from "./ctrl.js";

const router = new KoaRouter();
router.post("/social/kakao", socialKakao);
router.post("/greeting", greeting);

export default router;
