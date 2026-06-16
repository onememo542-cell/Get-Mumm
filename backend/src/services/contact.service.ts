/**
 * Contact Service
 * Business logic for contact submissions
 */

import { ContactRepository, ContactInput, OfficeInquiryInput } from "../repositories";

export class ContactService {
  private contactRepository: ContactRepository;

  constructor() {
    this.contactRepository = new ContactRepository();
  }

  /**
   * Submit a contact form
   */
  async submitContact(input: ContactInput) {
    return this.contactRepository.submitContact(input);
  }

  /**
   * Submit an office inquiry
   */
  async submitOfficeInquiry(input: OfficeInquiryInput) {
    return this.contactRepository.submitOfficeInquiry(input);
  }
}
