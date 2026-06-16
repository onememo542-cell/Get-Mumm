import { Router, type IRouter } from "express";
import { ContactService } from "../services";
import { asyncHandler } from "../middlewares/async-handler";
import { validateBody, getValidatedBody } from "../middlewares/validation";
import {
  SubmitContactBody,
  SubmitOfficeInquiryBody,
} from "../api-zod";

const router: IRouter = Router();
const contactService = new ContactService();

router.post(
  "/contact",
  validateBody(SubmitContactBody),
  asyncHandler(async (req, res) => {
    const body = getValidatedBody<{
      name: string;
      email: string;
      phone: string;
      message: string;
      subject?: string;
    }>(req);

    await contactService.submitContact({
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
      subject: body.subject ?? "General inquiry",
    });
    res.status(201).json({
      success: true,
      message: "Contact submission received",
    });
  }),
);

router.post(
  "/office-inquiry",
  validateBody(SubmitOfficeInquiryBody),
  asyncHandler(async (req, res) => {
    const body = getValidatedBody<{
      companyName: string;
      contactName: string;
      email: string;
      phone?: string;
      headCount: number;
      deliveryArea?: string;
      frequency?: string;
      message: string;
    }>(req);

    await contactService.submitOfficeInquiry({
      companyName: body.companyName,
      contactName: body.contactName,
      email: body.email,
      phone: body.phone ?? "",
      headCount: body.headCount,
      deliveryArea: body.deliveryArea ?? "",
      frequency: body.frequency ?? "one_time",
      message: body.message,
    });
    res.status(201).json({
      success: true,
      message: "Office inquiry received",
    });
  }),
);

export default router;
