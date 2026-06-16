import { Router, type IRouter } from "express";
import { eq, type SQL } from "drizzle-orm";
import { db, testimonialsTable } from "@workspace/db";
import {
  ListTestimonialsResponse,
  ListTestimonialsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/testimonials", async (req, res): Promise<void> => {
  const parsed = ListTestimonialsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { type } = parsed.data;

  const conditions: SQL[] = [];
  if (type != null) {
    conditions.push(eq(testimonialsTable.type, type));
  }

  const testimonials = await db
    .select()
    .from(testimonialsTable)
    .where(conditions.length > 0 ? conditions[0] : undefined)
    .orderBy(testimonialsTable.id);

  res.json(ListTestimonialsResponse.parse(testimonials));
});

export default router;
