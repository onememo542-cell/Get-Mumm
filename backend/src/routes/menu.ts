import { Router, type IRouter } from "express";
import { MenuService } from "../services";
import { asyncHandler } from "../middlewares/async-handler";
import {
  validateQuery,
  validateParams,
  getValidatedQuery,
  getValidatedParams,
} from "../middlewares/validation";
import {
  ListCategoriesResponse,
  ListMenuItemsQueryParams,
  ListMenuItemsResponse,
  GetFeaturedItemsResponse,
  GetMenuItemParams,
  GetMenuItemResponse,
} from "../api-zod";
import type { MenuItemFilters } from "../types";

const router: IRouter = Router();
const menuService = new MenuService();

router.get(
  "/menu/categories",
  asyncHandler(async (_req, res) => {
    const categories = await menuService.getCategories();
    res.json(ListCategoriesResponse.parse(categories));
  }),
);

router.get(
  "/menu/items/featured",
  asyncHandler(async (_req, res) => {
    const items = await menuService.getFeaturedItems();
    res.json(GetFeaturedItemsResponse.parse(items));
  }),
);

router.get(
  "/menu/items",
  validateQuery(ListMenuItemsQueryParams),
  asyncHandler(async (req, res) => {
    const items = await menuService.getMenuItems(
      getValidatedQuery<MenuItemFilters>(req),
    );
    res.json(ListMenuItemsResponse.parse(items));
  }),
);

router.get(
  "/menu/items/:id",
  validateParams(GetMenuItemParams),
  asyncHandler(async (req, res) => {
    const { id } = getValidatedParams<{ id: number }>(req);
    const item = await menuService.getMenuItemById(id);
    res.json(GetMenuItemResponse.parse(item));
  }),
);

export default router;
