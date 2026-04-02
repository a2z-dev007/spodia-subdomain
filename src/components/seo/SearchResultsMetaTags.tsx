"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function SearchResultsMetaTags() {
  const searchParams = useSearchParams();
  const cityName = searchParams.get("cityName") || "India";
  const checkIn = searchParams.get("start_date");
  const checkOut = searchParams.get("end_date");

  useEffect(() => {
    const metaTitle = `Find the Best Hotels, Resorts & Homestays in ${cityName} | Book Now & Get the Best Discounts on ${cityName} Hotels`;
    
    const metaDescription = `Discover and book the best hotels, resorts, and homestays in ${cityName}. Get exclusive discounts and deals on ${cityName} accommodations. ${checkIn && checkOut ? `Check-in: ${checkIn}, Check-out: ${checkOut}` : "Book your perfect stay today!"}`;
    
    const metaKeywords = `${cityName} hotels, best hotels in ${cityName}, ${cityName} resorts, ${cityName} homestays, book hotels ${cityName}, ${cityName} hotel booking, cheap hotels ${cityName}, luxury hotels ${cityName}, hotel deals ${cityName}, ${cityName} accommodation`;

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
    updateMetaTag("twitter:card", "summary_large_image", true);
    updateMetaTag("twitter:title", metaTitle, true);
    updateMetaTag("twitter:description", metaDescription, true);
    updateMetaTag("robots", "index, follow");

    let canonicalLink = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = window.location.href.split("?")[0];

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SearchResultsPage",
      "name": `Hotel Search Results - ${cityName}`,
      "description": metaDescription,
      "url": window.location.href,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `https://spodia.com/search-results?cityName=${cityName}&start_date={start_date}&end_date={end_date}`
        },
        "query-input": "required name=start_date required name=end_date"
      }
    };

    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }, [cityName, checkIn, checkOut]);

  return null;
}
