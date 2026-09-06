import type { Metadata } from "next"
import Script from "next/script"
import SignupForm from "@/components/auth/SignupForm"
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Spodia Signup | Create Your Account – Guest or Hotel Partner",
  description: "Register your Spodia account today — whether you're a guest booking hotels or a hotel partner listing your property. Start now and access exclusive benefits.",
  keywords: "Spodia signup, create account Spodia, guest account hotel booking, hotel partner registration Spodia, list property account, user registration Spodia, hotel owner signup, guest booking account",
  robots: "index, follow",
  openGraph: {
    title: "Spodia Signup | Create Your Account",
    description: "Sign up for Spodia as a guest or hotel partner and enjoy simplified bookings & listings.",
    url: "https://spodia.com/signup",
    siteName: "Spodia",
    images: [
      {
        url: "https://spodia.com/assets/img/og-signup.jpg",
        alt: "Spodia Signup",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spodia Signup | Guest & Partner Accounts",
    description: "Register with Spodia – for hotel bookings or listing your property.",
    images: ["https://spodia.com/assets/img/og-signup.jpg"],
    site: "@Spodiaasia",
  },
  alternates: {
    canonical: "https://spodia.com/signup",
  },
}

export default function SignupPage() {
  return (
      <>
      <Header/>
    <main className="min-h-screen relative flex items-center justify-center pt-24 pb-12">

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

      <div className="relative z-10 w-full flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-2xl animate-in zoom-in-95 duration-500">
          <SignupForm />
        </div>
      </div>
    </main>
      <Script
        id="signup-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Spodia Signup",
            url: "https://spodia.com/signup",
            description: "Page where guests and hotel partners can sign up for a Spodia account to access bookings or list properties.",
          }),
        }}
      />
      </>
  )
}
