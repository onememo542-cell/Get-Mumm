import { Router, type IRouter } from "express";
import { TestimonialsService } from "../services";
import { asyncHandler } from "../middlewares/async-handler";
import { validateQuery, getValidatedQuery } from "../middlewares/validation";
import {
  ListTestimonialsResponse,
  ListTestimonialsQueryParams,
} from "../api-zod";

const router: IRouter = Router();
const testimonialsService = new TestimonialsService();

/**
 * List testimonials with optional filtering by type
 */
router.get(
  "/testimonials",
  validateQuery(ListTestimonialsQueryParams),
  asyncHandler(async (req, res) => {
    const testimonials = await testimonialsService.getTestimonials(
      getValidatedQuery(req),
    );
    res.json(ListTestimonialsResponse.parse(testimonials));
  }),
);

export default router;
