import { Router, type IRouter } from "express";
import { db, contactsTable, officeInquiriesTable } from "@workspace/db";
import {
  SubmitContactBody,
  SubmitOfficeInquiryBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  await db.insert(contactsTable).values({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    message: parsed.data.message,
    subject: parsed.data.subject,
  });
  res.status(201).json({ success: true, message: "Your message has been received. We will get back to you soon!" });
});

router.post("/office-inquiry", async (req, res): Promise<void> => {
  const parsed = SubmitOfficeInquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  await db.insert(officeInquiriesTable).values({
    companyName: parsed.data.companyName,
    contactName: parsed.data.contactName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    headCount: parsed.data.headCount,
    deliveryArea: parsed.data.deliveryArea,
    frequency: parsed.data.frequency,
    message: parsed.data.message,
  });
  res.status(201).json({ success: true, message: "Thank you! Our corporate team will contact you within 24 hours." });
});

export default router;
