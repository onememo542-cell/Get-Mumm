import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
}

const SITE_NAME = "Get Mumm";
const DEFAULT_DESCRIPTION =
  "Experience the warmth of a grandmother's kitchen, delivered fresh to your door in Cairo and Giza. Support local women and enjoy authentic Egyptian flavors.";
const DEFAULT_IMAGE = "/opengraph.jpg";

function setMeta(name: string, content: string, property = false) {
  const attr = property ? "property" : "name";
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSEO({ title, description, ogImage, canonical, noIndex }: SEOProps = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Homemade Meals Delivered with Love`;
    const desc = description || DEFAULT_DESCRIPTION;
    const img = ogImage || DEFAULT_IMAGE;
    const url = canonical || window.location.href;

    document.title = fullTitle;

    setMeta("description", desc);
    setMeta("robots", noIndex ? "noindex, nofollow" : "index, follow");

    setMeta("og:title", fullTitle, true);
    setMeta("og:description", desc, true);
    setMeta("og:image", img, true);
    setMeta("og:url", url, true);
    setMeta("og:type", "website", true);
    setMeta("og:site_name", SITE_NAME, true);

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);
    setMeta("twitter:image", img);

    if (canonical) setLink("canonical", canonical);
  }, [title, description, ogImage, canonical, noIndex]);
}
