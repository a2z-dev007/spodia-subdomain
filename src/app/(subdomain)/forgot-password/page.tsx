import type { Metadata } from "next"
import Script from "next/script"
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm"
import Header from "@/components/layout/Header"

export const metadata: Metadata = {
  title: "Forgot Password - Spodia | Reset Your Account Password",
  description: "Reset your Spodia account password securely. Enter your email to receive a password recovery link and regain access to your account.",
  keywords: "forgot password, reset password, Spodia password recovery, account recovery, password reset link, recover account, Spodia login help",
  openGraph: {
    title: "Forgot Password - Spodia",
    description: "Reset your Spodia account password securely.",
    url: "https://spodia.com/forgot-password",
    siteName: "Spodia",
    images: [
      {
        url: "https://spodia.in/assets/spodia-cover.jpg",
        alt: "Spodia Forgot Password",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forgot Password - Spodia",
    description: "Reset your Spodia account password securely.",
    images: ["https://spodia.in/assets/spodia-cover.jpg"],
    site: "@Spodiaasia",
  },
  alternates: {
    canonical: "https://spodia.com/forgot-password",
  },
}

export default function ForgotPasswordPage() {
  return (
    <>
      <Header />
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
              <ForgotPasswordForm />
            </div>
          </div>
        </div>
      </main>
      
      <Script
        id="forgot-password-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Forgot Password - Spodia",
            url: "https://spodia.com/forgot-password",
            description: "Reset your Spodia account password securely.",
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