import { Router, type IRouter } from "express";
import { StatsService } from "../services";
import { asyncHandler } from "../middlewares/async-handler";
import { GetSiteSummaryResponse } from "../api-zod";

const router: IRouter = Router();
const statsService = new StatsService();

/**
 * Get site summary statistics
 */
router.get(
  "/stats/summary",
  asyncHandler(async (_req, res) => {
    const summary = await statsService.getSiteSummary();
    res.json(GetSiteSummaryResponse.parse(summary));
  }),
);

export default router;
