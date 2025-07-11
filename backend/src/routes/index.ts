import { Router } from "express";
import userRouter from "./userRouter";
import messageRouter from "./messageRouter";
import conversationRouter from "./conversationRouter";

const router = Router();

router.use("/users", userRouter);
router.use("/messages", messageRouter);
router.use("/conversations", conversationRouter);

export default router;
