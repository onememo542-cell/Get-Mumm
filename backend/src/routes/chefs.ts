import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, chefsTable } from "@workspace/db";
import {
  ListChefsResponse,
  GetChefParams,
  GetChefResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/chefs", async (_req, res): Promise<void> => {
  const chefs = await db.select().from(chefsTable).orderBy(chefsTable.rating);
  res.json(ListChefsResponse.parse(chefs));
});

router.get("/chefs/:id", async (req, res): Promise<void> => {
  const params = GetChefParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [chef] = await db
    .select()
    .from(chefsTable)
    .where(eq(chefsTable.id, params.data.id));

  if (!chef) {
    res.status(404).json({ error: "Chef not found" });
    return;
  }
  res.json(GetChefResponse.parse(chef));
});

export default router;
