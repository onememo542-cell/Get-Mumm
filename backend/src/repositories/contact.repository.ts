/**
 * Contact Repository
 * Data access for contact submissions
 */

import { db, contactsTable, officeInquiriesTable } from "../db";
import { supabase } from "../lib/supabase";
import { BaseRepository } from "./base.repository";

export interface ContactInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject: string;
}

export interface OfficeInquiryInput {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  headCount: number;
  deliveryArea: string;
  frequency: string;
  message: string;
}

export class ContactRepository extends BaseRepository {
  /**
   * Submit a contact form
   */
  async submitContact(input: ContactInput) {
    return this.execute(
      () =>
        db.insert(contactsTable).values({
          name: input.name,
          email: input.email,
          phone: input.phone,
          message: input.message,
          subject: input.subject,
        }),
      () =>
        supabase.from("contacts").insert({
          name: input.name,
          email: input.email,
          phone: input.phone,
          message: input.message,
          subject: input.subject,
        }),
    );
  }

  /**
   * Submit an office inquiry
   */
  async submitOfficeInquiry(input: OfficeInquiryInput) {
    return this.execute(
      () =>
        db.insert(officeInquiriesTable).values({
          companyName: input.companyName,
          contactName: input.contactName,
          email: input.email,
          phone: input.phone,
          headCount: input.headCount,
          deliveryArea: input.deliveryArea,
          frequency: input.frequency,
          message: input.message,
        }),
      () =>
        supabase.from("office_inquiries").insert({
          company_name: input.companyName,
          contact_name: input.contactName,
          email: input.email,
          phone: input.phone,
          head_count: input.headCount,
          delivery_area: input.deliveryArea,
          frequency: input.frequency,
          message: input.message,
        }),
    );
  }
}
