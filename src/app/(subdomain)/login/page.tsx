import type { Metadata } from "next"
import Script from "next/script"
import LoginForm from "@/components/auth/LoginForm"
import Header from "@/components/layout/Header"
import RedirectIfAuthenticated from "@/components/auth/RedirectIfAuthenticated"

export const metadata: Metadata = {
  title: "Spodia Login | Secure Access for Hotels & Guests | Sign in to Your Account",
  description: "Log in securely to Spodia to manage bookings, inventory, payments, guest details, and hotel operations. Access your hotel dashboard or guest account with advanced protection and seamless login experience.",
  keywords: "Spodia login, hotel login portal, guest login, Spodia account access, sign in Spodia, hotel extranet login, booking portal login, secure login system, manage hotel bookings, hotel dashboard login, Spodia host login, hotel partner login, online travel portal login, secure account access, booking management login, Spodia user login, Spodia authentication, OTA login India, hotel PMS login, property login India, hospitality login portal, login page Spodia, hotel booking dashboard, hotel revenue dashboard login, digital hotel management login, travel portal login, booking engine login, hotel inventory portal, Spodia sign in page, hotel owner login, guest booking login, secure OTP login, hotel chain login, partner extranet login",
  openGraph: {
    title: "Spodia Login | Secure Access for Hotels & Guests",
    description: "Sign in securely to manage bookings, inventory, payments, and guest information on Spodia.",
    url: "https://spodia.com/login",
    siteName: "Spodia",
    images: [
      {
        url: "https://spodia.in/assets/spodia-cover.jpg",
        alt: "Spodia Login",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spodia Login | Secure Hotel & Guest Access",
    description: "Log in to access your Spodia dashboard and manage hotel operations seamlessly.",
    images: ["https://spodia.in/assets/spodia-cover.jpg"],
    site: "@Spodiaasia",
  },
  alternates: {
    canonical: "https://spodia.com/login",
  },
}

export default function LoginPage() {
  return (
    <>
      <RedirectIfAuthenticated>
        <Header/>
        <main className="relative min-h-screen flex items-center justify-center pt-24 pb-12">
          {/* Premium Photographic Background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920"
              alt="Luxury Resort Background"
              className="w-full h-full object-cover object-center scale-105"
              draggable="false"
            />
            {/* Sophisticated dark gradient & overlay blend */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/80 via-slate-900/60 to-slate-950/80" />
            <div className="absolute inset-0 bg-black/35 backdrop-blur-[6px]" />
          </div>

          <div className="relative z-10 w-full flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-700">
              <div className="backdrop-blur-2xl bg-white/85 border border-white/40 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.12)] rounded-xl md:rounded-[40px] p-6 sm:p-10 w-full transition-all duration-500">
                <LoginForm />
              </div>
            </div>
          </div>
        </main>
      </RedirectIfAuthenticated>
      <Script
        id="login-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Spodia Login",
            url: "https://spodia.com/login",
            description: "Secure login page for hotels and guests to access Spodia dashboard.",
            publisher: {
              "@type": "Organization",
              name: "Spodia",
              url: "https://www.spodia.in",
              logo: "https://spodia.in/assets/logo.png",
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  email: "support@spodia.in",
                  telephone: "+91-8800842084",
                  contactType: "Customer Support",
                },
              ],
              sameAs: [
                "https://www.facebook.com/spodiaasia",
                "https://www.instagram.com/spodiaasia",
                "https://www.youtube.com/@Spodiaasia",
                "https://x.com/Spodiaasia",
              ],
            },
          }),
        }}
      />
    </>
  )
}
