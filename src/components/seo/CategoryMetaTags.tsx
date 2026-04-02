"use client";
import { useEffect } from "react";

interface CategoryMetaTagsProps {
  city: string;
  category: string;
  totalHotels?: number;
}

export function CategoryMetaTags({ city, category, totalHotels = 0 }: CategoryMetaTagsProps) {
  useEffect(() => {
    const cityFormatted = city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, " ");
    const categoryFormatted = category.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    
    const metaTitle = `${categoryFormatted} in ${cityFormatted} | Best ${categoryFormatted} in ${cityFormatted} | Book ${categoryFormatted} Online via Spodia.com with Great Discounts`;
    
    const metaDescription = `Find and book the best ${categoryFormatted.toLowerCase()} in ${cityFormatted}. ${totalHotels > 0 ? `Choose from ${totalHotels}+ ${categoryFormatted.toLowerCase()}` : `Discover top-rated ${categoryFormatted.toLowerCase()}`} in ${cityFormatted}. Get exclusive discounts and deals. Book now on Spodia.com!`;
    
    const metaKeywords = `${categoryFormatted} in ${cityFormatted}, Best ${categoryFormatted} in ${cityFormatted}, ${cityFormatted} ${categoryFormatted.toLowerCase()}, book ${categoryFormatted.toLowerCase()} ${cityFormatted}, ${cityFormatted} ${category}, ${categoryFormatted.toLowerCase()} near ${cityFormatted}, ${cityFormatted} accommodation, ${categoryFormatted.toLowerCase()} deals ${cityFormatted}`;

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
      "name": `${categoryFormatted} in ${cityFormatted}`,
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
          "item": `https://spodia.com/in/hotels/${city}`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": categoryFormatted,
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
  }, [city, category, totalHotels]);

  return null;
}
