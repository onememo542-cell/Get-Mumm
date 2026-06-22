import { useQuery } from "@tanstack/react-query";
import { endpoints } from "../endpoints";

export const siteKeys = {
  all: ["site"] as const,
  summary: () => [...siteKeys.all, "summary"] as const,
};

export const useGetSiteSummary = () => {
  return useQuery({
    queryKey: siteKeys.summary(),
    queryFn: () => endpoints.getSiteSummary(),
  });
};
