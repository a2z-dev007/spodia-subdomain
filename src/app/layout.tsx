import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'sonner';
import 'react-toastify/dist/ReactToastify.css';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Spodia Hotels – Book Your Perfect Stay',
  description: 'Experience luxury and comfort at Spodia Hotels. Best prices, instant confirmation, 24×7 support.',
  keywords: 'hotel booking, luxury hotels, budget stays, hotel reservations, accommodation',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.ico',
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
    <html lang="en" className={`${manrope.variable} ${manrope.className}`}>
      <head>
        {/* Google Analytics (gtag.js) - To be configured per hotel */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX', {
                page_title: document.title,
                page_location: window.location.href
              });
            `,
          }}
        />
      </head>
      <body className={`${manrope.className} antialiased`}>
        <Providers>
          {children}
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
      </body>
    </html>
  );
}
