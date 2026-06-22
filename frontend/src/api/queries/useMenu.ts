import { useQuery } from "@tanstack/react-query";
import { endpoints } from "../endpoints";
import type { ListMenuItemsParams } from "../types";

export const menuKeys = {
  all: ["menu"] as const,
  categories: () => [...menuKeys.all, "categories"] as const,
  items: (params?: ListMenuItemsParams) => [...menuKeys.all, "items", params] as const,
  featured: () => [...menuKeys.all, "featured"] as const,
  item: (id: string | number) => [...menuKeys.all, "item", id] as const,
};

export const useListCategories = () => {
  return useQuery({
    queryKey: menuKeys.categories(),
    queryFn: () => endpoints.listCategories(),
  });
};

export const useListMenuItems = (params?: ListMenuItemsParams) => {
  return useQuery({
    queryKey: menuKeys.items(params),
    queryFn: () => endpoints.listMenuItems(params),
  });
};

export const useGetFeaturedItems = () => {
  return useQuery({
    queryKey: menuKeys.featured(),
    queryFn: () => endpoints.getFeaturedItems(),
  });
};

export const useGetMenuItem = (id: string | number) => {
  return useQuery({
    queryKey: menuKeys.item(id),
    queryFn: () => endpoints.getMenuItem(id),
    enabled: !!id,
  });
};
