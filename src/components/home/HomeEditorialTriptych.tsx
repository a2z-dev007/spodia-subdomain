import Image from "next/image";
import Link from "next/link";
import { Merriweather } from "next/font/google";
import { MapPin } from "lucide-react";
import { LINKS } from "@/utils/const";

/** Figma: section headings — Merriweather Bold 26/34, letter-spacing -2%, centered */
const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const sectionHeadingClass = `${merriweather.className} mb-6 text-center text-[26px] font-bold leading-[34px] tracking-[-0.02em] text-[#1a1a2e]`;

/** Matches marketing mock: #ff7a21 accent, peach featured panel */
const accent = "#ff7a21";
const accentText = "text-[#ff7a21]";
const accentBorder = "border-[#ff7a21]";
const peach = "bg-[#fdf1e8]";
const latestStays = [
  {
    name: "Glenesk Country Spa",
    price: "79.50",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&q=80",
  },
  {
    name: "The Alyth Hotel, Alyth",
    price: "92",
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop&q=80",
  },
  {
    name: "Glenesk Country Spa",
    price: "79.50",
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=400&fit=crop&q=80",
  },
  {
    name: "The Alyth Hotel, Alyth",
    price: "89",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop&q=80",
  },
];

const blogPosts = [
  {
    id: "1",
    variant: "gray" as const,
    title: "TOP 10 reasons why myhotelbreak make the perfect last-minute gift",
    date: "31st Jul 2024",
  },
  {
    id: "2",
    variant: "blog" as const,
    title: "How To Find The Best Hotel Deals",
    date: "3rd Jun 2024",
  },
  {
    id: "3",
    variant: "tan" as const,
    title: "Top 10 things to do for families in Glasgow this summer",
    date: "10th May 2024",
  },
  {
    id: "4",
    variant: "tan" as const,
    title: "Top 10 things to do for families in Glasgow this summer",
    date: "10th May 2024",
  },
  {
    id: "5",
    variant: "tan" as const,
    title: "Top 10 things to do for families in Glasgow this summer",
    date: "10th May 2024",
  },
];

function BlogThumb({ variant }: { variant: "gray" | "blog" | "tan" }) {
  if (variant === "blog") {
    return (
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg text-[10px] font-extrabold uppercase tracking-wide text-white sm:h-16 sm:w-16"
        style={{ backgroundColor: accent }}
      >
        BLOG
      </div>
    );
  }
  if (variant === "gray") {
    return <div className="h-14 w-14 shrink-0 rounded-lg bg-neutral-300 sm:h-16 sm:w-16" />;
  }
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#d4a574]/35 sm:h-16 sm:w-16">
      <MapPin className="h-6 w-6 text-[#8b6914]" strokeWidth={1.75} aria-hidden />
    </div>
  );
}

export default function HomeEditorialTriptych() {
  return (
    <section
      className="border-t border-neutral-200 bg-white"
      aria-label="Latest stays, featured offer, and travel tips"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-10 xl:gap-12">
          {/* —— Column 1: Latest Stays —— */}
          <div className="flex min-w-0 flex-col">
            <h2 className={sectionHeadingClass}>Latest Stays &amp; Exclusive Offers</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {latestStays.map((stay, i) => (
                <article key={`${stay.name}-${i}`} className="min-w-0">
                  <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded-xl">
                    <Image
                      src={stay.image}
                      alt={stay.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 45vw, 200px"
                    />
                  </div>
                  <h3 className="text-sm font-semibold leading-snug text-neutral-900 line-clamp-2">
                    {stay.name}
                  </h3>
                  <p className={`mt-1 text-sm font-medium ${accentText}`}>
                    From ₹{stay.price}
                    <span className="font-normal text-neutral-600">ppn</span>
                  </p>
                </article>
              ))}
            </div>
            <Link
              href={LINKS.SEARCH_RESULTS}
              className={`mt-8 block w-full rounded-xl border-2 ${accentBorder} py-3 text-center text-sm font-semibold uppercase tracking-wide text-[#ff7a21] transition-colors hover:bg-orange-50`}
            >
              View all new hotels
            </Link>
          </div>

          {/* —— Column 2: Featured Stay —— */}
          <div className="flex min-w-0 flex-col">
            <div className="flex h-full flex-col overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5">
              <div className="relative aspect-[16/11] min-h-[200px] w-full sm:aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=900&h=600&fit=crop&q=80"
                  alt="Luxury glamping pods in woodland"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority={false}
                />
                <div className="absolute inset-0 bg-black/25" aria-hidden />
                <p
                  className={`${merriweather.className} absolute left-1/2 top-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 text-center text-lg font-bold uppercase leading-tight tracking-[0.12em] text-white drop-shadow-md sm:text-xl`}
                >
                  Featured stay of the week
                </p>
              </div>
              <div className={`flex flex-1 flex-col px-5 pb-6 pt-5 sm:px-6 sm:pb-7 sm:pt-6 ${peach}`}>
                <h2 className="text-lg font-bold leading-snug text-neutral-900 sm:text-xl">
                  Luxury Pods at Murrayshall, Perthshire
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                  These stylish pods blend glamping charm with modern comfort. Each has a super-king
                  bed, ensuite wet room, and stunning views.
                </p>
                <p className={`mt-4 text-base font-bold sm:text-lg ${accentText}`}>
                  ONLY ₹159 PER LUXURY POD
                </p>
                <Link
                  href={LINKS.SEARCH_RESULTS}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-center text-sm font-bold uppercase tracking-wide text-white shadow-sm transition-opacity hover:opacity-95"
                  style={{ backgroundColor: accent }}
                >
                  View hotel offer
                </Link>
              </div>
            </div>
          </div>

          {/* —— Column 3: Travel Tips —— */}
          <div className="flex min-w-0 flex-col">
            <h2 className={sectionHeadingClass}>Travel Tips &amp; Inspiration</h2>
            <ul className="flex flex-col gap-5">
              {blogPosts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={LINKS.SEARCH_RESULTS}
                    className="group flex gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#ff7a21]/40 focus-visible:ring-offset-2"
                  >
                    <BlogThumb variant={post.variant} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-snug text-neutral-900 group-hover:underline line-clamp-3">
                        {post.title}
                      </p>
                      <p className="mt-1.5 text-xs text-neutral-500">{post.date}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={LINKS.SEARCH_RESULTS}
              className={`mt-8 block w-full rounded-xl border-2 ${accentBorder} py-3 text-center text-sm font-semibold uppercase tracking-wide text-[#ff7a21] transition-colors hover:bg-orange-50`}
            >
              View all blogs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
