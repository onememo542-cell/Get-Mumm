import { useMutation } from "@tanstack/react-query";
import { endpoints } from "../endpoints";
import type { ContactInput, OfficeInquiryInput } from "../types";

export const useSubmitContact = () => {
  return useMutation({
    mutationFn: (data: ContactInput) => endpoints.submitContact(data),
  });
};

export const useSubmitOfficeInquiry = () => {
  return useMutation({
    mutationFn: (data: OfficeInquiryInput) => endpoints.submitOfficeInquiry(data),
  });
};
