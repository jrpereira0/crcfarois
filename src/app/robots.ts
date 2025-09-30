import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/b2b/", "/representante/", "/api/", "/login"],
    },
    sitemap: "https://crcfarois.ind.br/sitemap.xml",
  };
}
