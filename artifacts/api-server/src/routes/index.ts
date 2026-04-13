import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import subjectsRouter from "./subjects";
import chaptersRouter from "./chapters";
import contentRouter from "./content";
import experimentsRouter from "./experiments";
import progressRouter from "./progress";
import searchRouter from "./search";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(subjectsRouter);
router.use(chaptersRouter);
router.use(contentRouter);
router.use(experimentsRouter);
router.use(progressRouter);
router.use(searchRouter);

export default router;
