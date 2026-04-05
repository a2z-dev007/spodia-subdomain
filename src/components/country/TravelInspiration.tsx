import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TravelInspirationProps {
  blogs: Array<{
    id: string;
    title: string;
    slug: string;
    image: string;
    excerpt: string;
    readTime: string;
    publishedDate: string;
  }>;
}

export default function TravelInspiration({ blogs }: TravelInspirationProps) {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Travel Inspiration
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              Expert guides and insider tips for your next adventure
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden md:flex items-center gap-1 text-[#FF9530] hover:text-[#e8851c] font-semibold transition-colors"
          >
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Content */}
              <div className="p-4 md:p-5">
                <h3 className="font-bold text-gray-900 text-base md:text-lg mb-2 line-clamp-2 group-hover:text-[#FF9530] transition-colors">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {blog.excerpt}
                </p>
                
                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{blog.readTime}</span>
                  </div>
                  <span>
                    {new Date(blog.publishedDate).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-6 md:hidden">
          <Button
            asChild
            variant="outline"
            className="w-full border-[#FF9530] text-[#FF9530] hover:bg-[#FF9530] hover:text-white"
          >
            <Link href="/blog" className="flex items-center gap-2">
              View All Articles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
