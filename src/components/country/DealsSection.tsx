"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DealsSectionProps {
  deals: Array<{
    id: string;
    title: string;
    discount: number;
    discountType: "percentage" | "fixed";
    currency?: string;
    validFrom: string;
    validTill: string;
    description: string;
    cta: string;
    imageUrl: string;
    terms: string;
  }>;
}

export default function DealsSection({ deals }: DealsSectionProps) {
  if (!deals || deals.length === 0) return null;

  const getDiscountText = (deal: typeof deals[0]) => {
    if (deal.discountType === "percentage") {
      return `${deal.discount}% OFF`;
    }
    return `₹${deal.discount} OFF`;
  };

  const getGradientClass = (index: number) => {
    const gradients = [
      "from-orange-500 to-red-500",
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Exclusive Deals & Offers
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            Limited-time offers on India's best stays
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {deals.map((deal, index) => {
            const isValid = new Date(deal.validTill) > new Date();
            
            return (
              <div
                key={deal.id}
                className={`relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${
                  isValid ? "cursor-pointer group" : "opacity-60"
                }`}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${getGradientClass(
                    index
                  )}`}
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 opacity-20">
                  <Image
                    src={deal.imageUrl}
                    alt={deal.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Content */}
                <div className="relative p-6 md:p-8 text-white">
                  {/* Discount Badge */}
                  <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                    <span className="text-2xl md:text-3xl font-extrabold">
                      {getDiscountText(deal)}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold mb-2">
                    {deal.title}
                  </h3>
                  <p className="text-white/90 text-sm mb-4 line-clamp-2">
                    {deal.description}
                  </p>

                  {/* Validity */}
                  <div className="flex items-center gap-2 text-sm mb-4">
                    <Clock className="w-4 h-4" />
                    <span>
                      Valid till{" "}
                      {new Date(deal.validTill).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* CTA */}
                  {isValid && (
                    <Link href={deal.cta}>
                      <Button
                        size="sm"
                        className="bg-white text-gray-900 hover:bg-gray-100 font-semibold rounded-full"
                      >
                        Claim Offer
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
