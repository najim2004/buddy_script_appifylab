import { env } from "@/lib/env";

export const siteConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  description: "Industry-grade Next.js application.",
  url: "https://example.com",
  links: {
    github: "https://github.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
