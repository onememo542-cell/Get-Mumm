import { useQuery } from "@tanstack/react-query";
import { endpoints } from "../endpoints";

export const chefsKeys = {
  all: ["chefs"] as const,
  list: () => [...chefsKeys.all, "list"] as const,
  detail: (id: string | number) => [...chefsKeys.all, "detail", id] as const,
};

export const useListChefs = () => {
  return useQuery({
    queryKey: chefsKeys.list(),
    queryFn: () => endpoints.listChefs(),
  });
};

export const useGetChef = (id: string | number) => {
  return useQuery({
    queryKey: chefsKeys.detail(id),
    queryFn: () => endpoints.getChef(id),
    enabled: !!id,
  });
};
