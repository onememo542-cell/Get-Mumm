import { useQuery } from "@tanstack/react-query";
import { endpoints } from "../endpoints";
import type { ListBlogPostsParams } from "../types";

export const blogKeys = {
  all: ["blog"] as const,
  list: (params?: ListBlogPostsParams) => [...blogKeys.all, "list", params] as const,
  detail: (slug: string) => [...blogKeys.all, "detail", slug] as const,
};

export const useListBlogPosts = (params?: ListBlogPostsParams) => {
  return useQuery({
    queryKey: blogKeys.list(params),
    queryFn: () => endpoints.listBlogPosts(params),
  });
};

export const useGetBlogPost = (slug: string) => {
  return useQuery({
    queryKey: blogKeys.detail(slug),
    queryFn: () => endpoints.getBlogPost(slug),
    enabled: !!slug,
  });
};
