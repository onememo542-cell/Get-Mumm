// Central re-export of all locale namespaces.
// Import the namespace you need: import { nav, common } from "@/locales";

export { common } from "./common";
export { nav }    from "./nav";
export { home }   from "./home";
export { menu }   from "./menu";
export { auth }   from "./auth";
export { cart }   from "./cart";
export { checkout } from "./checkout";
export { offices }  from "./offices";
export { orders }   from "./orders";
export { errors }   from "./errors";

// Convenience type for a translation pair [en, ar].
export type I18nPair = readonly [string, string];
