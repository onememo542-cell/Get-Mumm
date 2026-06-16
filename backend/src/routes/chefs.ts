import { Router, type IRouter } from "express";
import { ChefsService } from "../services";
import { asyncHandler } from "../middlewares/async-handler";
import { validateParams, getValidatedParams } from "../middlewares/validation";
import {
  ListChefsResponse,
  GetChefParams,
  GetChefResponse,
} from "../api-zod";

const router: IRouter = Router();
const chefsService = new ChefsService();

router.get(
  "/chefs",
  asyncHandler(async (_req, res) => {
    const chefs = await chefsService.getAllChefs();
    res.json(ListChefsResponse.parse(chefs));
  }),
);

router.get(
  "/chefs/:id",
  validateParams(GetChefParams),
  asyncHandler(async (req, res) => {
    const { id } = getValidatedParams<{ id: number }>(req);
    const chef = await chefsService.getChefById(id);
    res.json(GetChefResponse.parse(chef));
  }),
);

export default router;
