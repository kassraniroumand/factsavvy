import { MetadataRoute } from "next";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const links = [
    {
      url: "https://factsavvy.ai/", // Replace with your homepage
      lastModified: new Date(),
    },
  ];

  return links;
}
