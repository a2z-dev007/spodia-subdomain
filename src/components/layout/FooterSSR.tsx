import { Globe } from "lucide-react";
import Link from "next/link";
import FooterExpandable from "@/components/Footer/FooterExpandable";
import { LINKS } from "@/utils/const";
import { SOCIAL_LINKS } from "@/utils/helper";
import {
  FooterApiResponse,
  Record as FooterRecord,
  StateResortsRecord,
  generateHotelLink,
  generateHomestayLink,
  generateFiveStarLink,
  generateBudgetHotelLink,
  generateResortLink,
  generateStateResortLink,
} from "@/services/footerService";
import { fetchFooterDataServer } from "@/lib/serverDataFetching";

// Server Component - SSR with caching
async function getFooterDataSSR(): Promise<FooterApiResponse | null> {
  try {
    const data = await fetchFooterDataServer();
    return data as FooterApiResponse;
  } catch (error) {
    console.error("Error loading footer data:", error);
    return null;
  }
}

// Transform API data to link objects with href (including city_id)
const transformRecordsToLinkObjects = (
  records: FooterRecord[] | undefined,
  prefix: string,
  linkGenerator: (
    cityName: string | null | undefined,
    cityId?: number | null,
  ) => string,
) => {
  if (!Array.isArray(records)) {
    return [];
  }

  const seen = new Set<string>();
  return records
    .filter((record) => {
      if (!record?.city__name || record.city__name === "nan") return false;
      const key = record.city__name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((record) => ({
      text: `${prefix} in ${record.city__name}`,
      href: linkGenerator(record.city__name, record.city_id),
    }));
};

// Transform state records to link objects (including state_id)
const transformStateRecordsToLinkObjects = (
  records: StateResortsRecord[] | undefined,
  prefix: string,
  linkGenerator: (
    stateName: string | null | undefined,
    stateId?: number | null,
  ) => string,
) => {
  if (!Array.isArray(records)) {
    return [];
  }

  const seen = new Set<string>();
  return records
    .filter((record) => {
      if (!record?.state__name || record.state__name === "nan") return false;
      const key = record.state__name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((record) => ({
      text: `${prefix} in ${record.state__name}`,
      href: linkGenerator(record.state__name, record.state_id),
    }));
};

// Helper to transform and deduplicate bottom footer links (including city_id)
const transformToBottomLinks = (
  records: FooterRecord[] | any[] | undefined,
  prefix: string,
  linkGenerator: (
    cityName: string | null | undefined,
    cityId?: number | null,
  ) => string,
  limit = 12,
) => {
  if (!Array.isArray(records)) {
    return [];
  }

  const seen = new Set<string>();
  return records
    .filter((record) => {
      if (!record?.city__name || record.city__name === "nan") return false;
      const key = record.city__name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit)
    .map((record) => ({
      title: `${prefix} in ${record.city__name}`,
      href: linkGenerator(record.city__name, record.city_id),
    }));
};

// Static company section
const staticCompanySection = {
  title: "THE COMPANY",
  links: [
    { title: "About Us", href: LINKS.ABOUT },
    { title: "Terms & Conditions", href: LINKS.TERMS_CONDITIONS },
    { title: "How Spodia helps", href: LINKS.USER_AGREEMENT },
    { title: "Privacy", href: LINKS.PRIVACY_POLICY },
    { title: "Customer Support", href: LINKS.CUSTOMER_SUPPORT },
    { title: "Career", href: LINKS.CAREER },
    { title: "Corporate Social Responsibility", href: LINKS.CSR },
    { title: "Spodia on Mobile", href: LINKS.SPODIA_MOBILE },
    { title: "FAQs", href: LINKS.FAQS },
    { title: "Inverstor Relations", href: LINKS.INVESTOR_RELATIONS },
  ],
};

type FooterItem = string | { text: string; href: string };

const normalizeSection = (section: FooterItem[], visibleCount = 10) => {
  if (section.length < visibleCount) {
    return [...section, ...Array(visibleCount - section.length).fill("")];
  }
  return section;
};

const FooterSSR = async () => {
  const footerData = await getFooterDataSSR();
  
  // Prepare expandable sections data (top of footer)
  const expandableSections = footerData
    ? [
        [
          "Most Searched Hotels in India",
          ...transformRecordsToLinkObjects(
            footerData.data.cheap_records,
            "Hotels",
            generateHotelLink,
          ),
        ],
        [
          "States of India",
          ...transformRecordsToLinkObjects(
            footerData.data.near_city_records,
            "Hotels",
            generateHotelLink,
          ),
        ],
        [
          "Best Hotels in India",
          ...transformRecordsToLinkObjects(
            footerData.data.best_records,
            "Hotels",
            generateHotelLink,
          ),
        ],
        [
          "Top Hotels in India",
          ...transformRecordsToLinkObjects(
            footerData.data.deluxe_records,
            "Hotels",
            generateHotelLink,
          ),
        ],
        [
          "All Resorts in States",
          ...transformStateRecordsToLinkObjects(
            footerData.data.state_resorts_records,
            "Resorts",
            generateStateResortLink,
          ),
        ],
        [
          "Popular Hotels in India",
          ...transformRecordsToLinkObjects(
            footerData.data.popular_records,
            "Hotels",
            generateHotelLink,
          ),
        ],
      ]
    : [];

  // Generate bottom footer sections from API data
  const footerSections = footerData
    ? [
        staticCompanySection,
        {
          title: "TRENDING HOTELS",
          links: transformToBottomLinks(
            footerData.data.search_records,
            "Hotel",
            generateHotelLink,
          ),
        },
        {
          title: "INTERNATIONAL HOTELS",
          links: transformToBottomLinks(
            footerData.data.four_star_records,
            "Hotel",
            generateHotelLink,
          ),
        },
        {
          title: "TOP HOTELS IN INDIA",
          links: transformToBottomLinks(
            footerData.data.luxury_records,
            "Hotel",
            generateHotelLink,
          ),
        },
        {
          title: "HOMESTAYS IN CITIES",
          links:
            footerData.data.home_stay_records &&
            footerData.data.home_stay_records.length > 0
              ? transformToBottomLinks(
                  footerData.data.home_stay_records,
                  "Homestays",
                  generateHomestayLink,
                )
              : transformToBottomLinks(
                  footerData.data.family_records,
                  "Homestays",
                  generateHomestayLink,
                ),
        },
        {
          title: "RECOMMENDED HOTELS",
          links: transformToBottomLinks(
            footerData.data.five_star_records,
            "5 Star Hotels",
            generateFiveStarLink,
          ),
        },
        {
          title: "BUDGET HOTELS",
          links: transformToBottomLinks(
            footerData.data.budget_records,
            "Budget Hotels",
            generateBudgetHotelLink,
          ),
        },
      ]
    : [
        staticCompanySection,
        {
          title: "TRENDING HOTELS",
          links: [
            { title: "Hotel in Guwahati", href: LINKS.HOTELS_GUWAHATI },
            { title: "Hotel in Delhi", href: LINKS.HOTELS_DELHI },
            { title: "Hotel in Pune", href: LINKS.HOTELS_PUNE },
            { title: "Hotel in Agra", href: LINKS.HOTELS_AGRA },
            { title: "Hotel in Jaipur", href: LINKS.HOTELS_JAIPUR },
            { title: "Hotel in Mumbai", href: LINKS.HOTELS_MUMBAI },
            { title: "Hotel in Hyderabad", href: LINKS.HOTELS_HYDERABAD },
            { title: "Hotel in Mysore", href: LINKS.HOTELS_MYSORE },
            { title: "Hotel in Chennai", href: LINKS.HOTELS_CHENNAI },
            { title: "Hotel in Manali", href: LINKS.HOTELS_MANALI },
            { title: "Hotel in Bangalore", href: LINKS.HOTELS_BANGALORE },
            { title: "Hotel in Ahmedabad", href: LINKS.HOTELS_AHMEDABAD },
          ],
        },
        {
          title: "INTERNATIONAL HOTELS",
          links: [
            { title: "Hotel in Dubai", href: LINKS.HOTELS_DUBAI },
            { title: "Hotel in Singapore", href: LINKS.HOTELS_SINGAPORE },
            { title: "Hotel in Bangkok", href: LINKS.HOTELS_BANGKOK },
            { title: "Hotel in Paris", href: LINKS.HOTELS_PARIS },
            { title: "Hotel in Krabi", href: LINKS.HOTELS_KRABI },
            { title: "Hotel in Bali", href: LINKS.HOTELS_BALI },
            { title: "Hotel in Hong Kong", href: LINKS.HOTELS_HONG_KONG },
            { title: "Hotel in Abu Dhabi", href: LINKS.HOTELS_ABU_DHABI },
            { title: "Hotel in Moscow", href: LINKS.HOTELS_MOSCOW },
            { title: "Hotel in Dhaka", href: LINKS.HOTELS_DHAKA },
            { title: "Hotel in Kathmandu", href: LINKS.HOTELS_KATHMANDU },
            { title: "Hotel in London", href: LINKS.HOTELS_LONDON },
          ],
        },
        {
          title: "TOP HOTELS IN INDIA",
          links: [
            { title: "Hotel in Panchgani", href: LINKS.HOTELS_PANCHGANI },
            { title: "Hotel in Juhu", href: LINKS.HOTELS_JUHU },
            { title: "Hotel in Srisailam", href: LINKS.HOTELS_SRISAILAM },
            { title: "Hotel in Bandra", href: LINKS.HOTELS_BANDRA },
            { title: "Hotel in Goa Near Beach", href: LINKS.HOTELS_GOA_BEACH },
            { title: "Auli Hotels", href: LINKS.HOTELS_AULI },
            { title: "Ernakulam Hotel", href: LINKS.HOTELS_ERNAKULAM },
            { title: "Hotels in Fort Kochi", href: LINKS.HOTELS_FORT_KOCHI },
            { title: "Taki Hotels", href: LINKS.HOTELS_TAKI },
            { title: "Palolem Beach Hotels", href: LINKS.HOTELS_PALOLEM },
            { title: "Hotel in Powai", href: LINKS.HOTELS_POWAI },
            { title: "Hotel in Colaba", href: LINKS.HOTELS_COLABA },
          ],
        },
        {
          title: "HOMESTAYS IN CITIES",
          links: [
            { title: "Homestays in Coorg", href: LINKS.HOMESTAYS_COORG },
            { title: "Homestays in Ooty", href: LINKS.HOMESTAYS_OOTY },
            {
              title: "Homestays in Sakleshpur",
              href: LINKS.HOMESTAYS_SAKLESHPUR,
            },
            {
              title: "Homestays in Darjeeling",
              href: LINKS.HOMESTAYS_DARJEELING,
            },
            { title: "Homestays in Wayanad", href: LINKS.HOMESTAYS_WAYANAD },
            { title: "Homestays in Munnar", href: LINKS.HOMESTAYS_MUNNAR },
            {
              title: "Homestays in Kodaikanal",
              href: LINKS.HOMESTAYS_KODAIKANAL,
            },
            { title: "Villas in Lonavala", href: LINKS.VILLAS_LONAVALA },
            { title: "Villas in Goa", href: LINKS.VILLAS_GOA },
            { title: "Villas in Igatpuri", href: LINKS.VILLAS_IGATPURI },
            { title: "Villas in Karjat", href: LINKS.VILLAS_KARJAT },
            { title: "Villas in Alibaug", href: LINKS.VILLAS_ALIBAUG },
          ],
        },
        {
          title: "RECOMMENDED HOTELS",
          links: [
            {
              title: "5 Start Hotels in Dharamshala",
              href: LINKS.FIVE_STAR_DHARAMSHALA,
            },
            {
              title: "5 Start Hotels in Nainital",
              href: LINKS.FIVE_STAR_NAINITAL,
            },
            { title: "5 Start Hotels in Surat", href: LINKS.FIVE_STAR_SURAT },
            {
              title: "5 Start Hotels in Dalhousie",
              href: LINKS.FIVE_STAR_DALHOUSIE,
            },
            { title: "5 Start Hotels in Ranchi", href: LINKS.FIVE_STAR_RANCHI },
            {
              title: "5 Start Hotels in Mount Abu",
              href: LINKS.FIVE_STAR_MOUNT_ABU,
            },
            {
              title: "5 Start Hotels in Banglore",
              href: LINKS.FIVE_STAR_BANGALORE,
            },
            { title: "5 Start Hotels in Coorg", href: LINKS.FIVE_STAR_COORG },
            {
              title: "5 Start Hotels in Gangtok",
              href: LINKS.FIVE_STAR_GANGTOK,
            },
            {
              title: "5 Start Hotels in Madurai",
              href: LINKS.FIVE_STAR_MADURAI,
            },
            { title: "5 Start Hotels in Raipur", href: LINKS.FIVE_STAR_RAIPUR },
            {
              title: "5 Start Hotels in Shillong",
              href: LINKS.FIVE_STAR_SHILLONG,
            },
          ],
        },
        {
          title: "BUDGET HOTELS",
          links: [
            { title: "Budget Hotels in Goa", href: LINKS.BUDGET_HOTELS_GOA },
            {
              title: "Budget Hotels in Jaipur",
              href: LINKS.BUDGET_HOTELS_JAIPUR,
            },
            { title: "Budget Hotels in Ooty", href: LINKS.BUDGET_HOTELS_OOTY },
            {
              title: "Budget Hotels in Kerala",
              href: LINKS.BUDGET_HOTELS_KERALA,
            },
            {
              title: "Budget Hotels in Mumbai",
              href: LINKS.BUDGET_HOTELS_MUMBAI,
            },
            {
              title: "Budget Hotels in Nainital",
              href: LINKS.BUDGET_HOTELS_NAINITAL,
            },
            {
              title: "Budget Hotels in Chennai",
              href: LINKS.BUDGET_HOTELS_CHENNAI,
            },
            {
              title: "Budget Hotels in Chandigarh",
              href: LINKS.BUDGET_HOTELS_CHANDIGARH,
            },
            { title: "Budget Hotels in Pune", href: LINKS.BUDGET_HOTELS_PUNE },
            { title: "Budget Hotels in Agra", href: LINKS.BUDGET_HOTELS_AGRA },
            {
              title: "Budget Hotels in Ahmedabad",
              href: LINKS.BUDGET_HOTELS_AHMEDABAD,
            },
            {
              title: "Budget Hotels in Gangtok",
              href: LINKS.BUDGET_HOTELS_GANGTOK,
            },
          ],
        },
      ];

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 pt-4 sm:pt-6 pb-8 sm:pb-12">
        {/* Expandable Sections - Better spacing for mobile */}
        <div className="py-4 sm:py-6 md:py-8">
          <div className="max-w-7xl mx-auto space-y-2 sm:space-y-3">
            {expandableSections.map((section, idx) => (
              <FooterExpandable
                key={idx}
                data={normalizeSection(section, 10)}
                defaultVisible={10}
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2">
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-3 sm:space-y-4 mt-2 md:mt-0">
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm uppercase tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-1.5 sm:space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-text-color hover:text-[#FF9530] text-xs sm:text-sm transition-colors block"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer - Fully Responsive */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 justify-between items-center">
            {/* Copyright and Links - Stack on mobile, wrap on tablet */}
            <div className="flex flex-col sm:flex-row items-center w-full md:w-auto">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 md:gap-4 lg:gap-6 text-xs sm:text-sm footer-text-color-bold">
                <span className="whitespace-nowrap">© 2025 Spodia</span>
                <Link
                  href={LINKS.PRIVACY_POLICY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FF9530] transition-colors whitespace-nowrap"
                >
                  Privacy
                </Link>
                <Link
                  href={LINKS.TERMS_CONDITIONS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FF9530] transition-colors whitespace-nowrap"
                >
                  Terms
                </Link>
                <Link
                  href={LINKS.SITEMAP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FF9530] transition-colors whitespace-nowrap"
                >
                  Sitemap
                </Link>
                <Link
                  href={LINKS.COMPANY_DETAILS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FF9530] transition-colors whitespace-nowrap hidden sm:inline"
                >
                  Company Details
                </Link>
                <Link
                  href={LINKS.BOOKING_POLICY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FF9530] transition-colors whitespace-nowrap hidden sm:inline"
                >
                  Booking Policy
                </Link>
              </div>
            </div>

            {/* Language, Currency, and Social Links */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-6 w-full md:w-auto justify-center md:justify-end">
              {/* Language & Currency */}
              <div className="flex items-center gap-2 sm:gap-3">
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm footer-text-color-bold whitespace-nowrap">
                  English (IN)
                </span>
                <span className="text-xs sm:text-sm footer-text-color-bold whitespace-nowrap">
                  ₹ INR
                </span>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3 sm:gap-4">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-text-color-bold hover:text-[#FF9530] transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSSR;
