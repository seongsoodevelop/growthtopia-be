import KoaRouter from "koa-router";
import { sessionHi, sessionBye, socialKakao } from "./ctrl.js";

const router = new KoaRouter();

router.post("/session/hi", sessionHi);
router.post("/session/bye", sessionBye);

router.post("/social/kakao", socialKakao);

export default router;
