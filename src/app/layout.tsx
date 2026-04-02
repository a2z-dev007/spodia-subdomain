import type { Metadata } from 'next';
import './globals.css';
import './globals-map.css';
import { Manrope } from 'next/font/google';
import { Providers } from './providers';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'sonner';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'swiper/css';
import 'swiper/css/pagination';
import BottomTab from '@/components/layout/BottomTab';
import FooterSSR from '@/components/layout/FooterSSR';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Spodia Hotels – Book Your Perfect Stay',
  description: 'Find and book verified hotels, homestays, and budget stays across India, Nepal & Bhutan with Spodia. Best prices, instant confirmation, 24×7 support, and 5000+ trusted properties.',
  keywords: 'hotel booking, luxury hotels, budget stays, hotel reservations, accommodation, spodia',
  robots: 'index, follow',
  icons: {
    icon: '/fav.png',
  },
  openGraph: {
    title: 'Spodia Hotels – Book Your Perfect Stay',
    description: 'Experience luxury and comfort with instant confirmation and 24×7 support.',
    url: 'https://spodia.com/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spodia Hotels – Book Your Perfect Stay',
    description: 'Experience luxury and comfort with instant confirmation and 24×7 support.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${manrope.className}`} suppressHydrationWarning>
      <body className={`${manrope.className} antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
          <BottomTab />
          <FooterSSR />
        </Providers>
        <ToastContainer />
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={4000}
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid #e5e7eb',
              color: '#374151',
            },
          }}
        />
        <div id="datepicker-portal" />
      </body>
    </html>
  );
}
