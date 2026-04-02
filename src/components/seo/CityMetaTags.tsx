"use client";
import { useEffect } from "react";

interface CityMetaTagsProps {
  city: string;
  totalHotels?: number;
}

export function CityMetaTags({ city, totalHotels = 0 }: CityMetaTagsProps) {
  useEffect(() => {
    const cityFormatted = city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, " ");
    
    const metaTitle = `Hotels in ${cityFormatted} | Best Hotels & Resorts in ${cityFormatted} | Book the Best ${cityFormatted} Hotels Online via Spodia.com with Great Discounts`;
    
    const metaDescription = `Find and book the best hotels in ${cityFormatted}. ${totalHotels > 0 ? `Choose from ${totalHotels}+ hotels, resorts, and homestays` : "Discover luxury hotels, budget accommodations, and resorts"} in ${cityFormatted}. Get exclusive discounts and deals on ${cityFormatted} hotels. Book now on Spodia.com!`;
    
    const metaKeywords = `Hotels in ${cityFormatted}, Best Hotels in ${cityFormatted}, 5 Star Hotels in ${cityFormatted}, ${cityFormatted} hotels, ${cityFormatted} resorts, ${cityFormatted} homestays, book hotels ${cityFormatted}, ${cityFormatted} hotel booking, cheap hotels ${cityFormatted}, luxury hotels ${cityFormatted}, budget hotels ${cityFormatted}, ${cityFormatted} accommodation, hotels near ${cityFormatted}, ${cityFormatted} hotel deals`;

    document.title = metaTitle;

    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    };

    updateMetaTag("title", metaTitle);
    updateMetaTag("description", metaDescription);
    updateMetaTag("keywords", metaKeywords);
    updateMetaTag("og:type", "website", true);
    updateMetaTag("og:title", metaTitle, true);
    updateMetaTag("og:description", metaDescription, true);
    updateMetaTag("og:site_name", "Spodia", true);
    updateMetaTag("og:locale", "en_IN", true);
    updateMetaTag("twitter:card", "summary_large_image", true);
    updateMetaTag("twitter:title", metaTitle, true);
    updateMetaTag("twitter:description", metaDescription, true);
    updateMetaTag("robots", "index, follow");
    updateMetaTag("geo.region", "IN", true);
    updateMetaTag("geo.placename", cityFormatted, true);

    let canonicalLink = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = window.location.href.split("?")[0];

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `Hotels in ${cityFormatted}`,
      "description": metaDescription,
      "url": window.location.href.split("?")[0],
      "numberOfItems": totalHotels,
      "itemListElement": []
    };

    const breadcrumbData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://spodia.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Hotels",
          "item": "https://spodia.com/hotels"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": `Hotels in ${cityFormatted}`,
          "item": window.location.href.split("?")[0]
        }
      ]
    };

    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    const script1 = document.createElement("script");
    script1.type = "application/ld+json";
    script1.text = JSON.stringify(structuredData);
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.type = "application/ld+json";
    script2.text = JSON.stringify(breadcrumbData);
    document.head.appendChild(script2);
  }, [city, totalHotels]);

  return null;
}
