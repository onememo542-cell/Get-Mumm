import { useQuery } from "@tanstack/react-query";
import { endpoints } from "../endpoints";
import type { ListTestimonialsParams } from "../types";

export const testimonialsKeys = {
  all: ["testimonials"] as const,
  list: (params?: ListTestimonialsParams) => [...testimonialsKeys.all, "list", params] as const,
};

export const useListTestimonials = (params?: ListTestimonialsParams) => {
  return useQuery({
    queryKey: testimonialsKeys.list(params),
    queryFn: () => endpoints.listTestimonials(params),
  });
};
