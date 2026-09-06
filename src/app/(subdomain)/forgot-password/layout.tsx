import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Spodia Forgot Password | Recover Your Account',
  description: 'Forgot your Spodia password? Use this page to securely reset your login credentials for guest or hotel partner account.',
  keywords: 'Spodia forgot password, reset password Spodia, account recovery Spodia, hotel partner password reset, guest password reset booking platform',
  robots: 'noindex, follow',
  openGraph: {
    title: 'Spodia Forgot Password | Account Recovery',
    description: 'Reset your Spodia account password securely for guests or hotel partners.',
    url: 'https://spodia.com/forgot-password',
    siteName: 'Spodia',
    images: [
      {
        url: 'https://spodia.com/assets/img/og-forgot-password.jpg',
        alt: 'Spodia Forgot Password',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spodia Forgot Password',
    description: 'Recover your Spodia account password safely and securely.',
    images: ['https://spodia.com/assets/img/og-forgot-password.jpg'],
    site: '@Spodiaasia',
  },
  alternates: {
    canonical: 'https://spodia.com/forgot-password',
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Script
        id="forgot-password-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Spodia Forgot Password',
            url: 'https://spodia.com/forgot-password',
            description: 'Secure account recovery page for Spodia where users can reset their password.',
          }),
        }}
      />
    </>
  );
}
