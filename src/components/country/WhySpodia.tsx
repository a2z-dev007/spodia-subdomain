import { Star, Shield, Sparkles, Award } from "lucide-react";

interface WhySpodiaProps {
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

const iconMap: Record<string, any> = {
  star: Star,
  shield: Shield,
  sparkles: Sparkles,
  award: Award,
};

export default function WhySpodia({ features }: WhySpodiaProps) {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Why Choose Spodia?
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Experience the difference with India's most trusted travel platform
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Star;
            
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 md:p-8 text-center hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-8 h-8 text-[#FF9530]" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
