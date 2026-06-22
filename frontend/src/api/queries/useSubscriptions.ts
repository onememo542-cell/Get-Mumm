import { useQuery } from "@tanstack/react-query";
import { endpoints } from "../endpoints";

export const subscriptionsKeys = {
  all: ["subscriptions"] as const,
  list: () => [...subscriptionsKeys.all, "list"] as const,
};

export const useListSubscriptionPlans = () => {
  return useQuery({
    queryKey: subscriptionsKeys.list(),
    queryFn: () => endpoints.listSubscriptionPlans(),
  });
};
