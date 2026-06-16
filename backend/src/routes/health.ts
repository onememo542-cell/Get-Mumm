import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "../api-zod";
import { getPool } from "../db";
import { checkDatabaseHealth } from "../db/monitoring";
import { asyncHandler } from "../middlewares/async-handler";

const router: IRouter = Router();

router.get(
  "/healthz",
  asyncHandler(async (_req, res) => {
    try {
      getPool();
    } catch {
      const data = HealthCheckResponse.parse({ status: "degraded" });
      res.status(503).json(data);
      return;
    }

    const dbHealth = await checkDatabaseHealth();
    const status = dbHealth.healthy ? "ok" : "degraded";
    const data = HealthCheckResponse.parse({ status });

    if (!dbHealth.healthy) {
      res.status(503).json(data);
      return;
    }

    res.json(data);
  }),
);

export default router;
