import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-orange/10 to-white">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-brand-orange to-brand-blue bg-clip-text text-transparent">
            Spodia Hotel Subdomain
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Production-grade Next.js 16 hotel booking platform
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-20 border-stroke shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-brand-orange rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Multi-Tenant Architecture</h3>
              <p className="text-sm text-gray-600">Subdomain-based hotel websites with dynamic configuration</p>
            </div>

            <div className="bg-white p-6 rounded-20 border-stroke shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-brand-blue rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Performance Optimized</h3>
              <p className="text-sm text-gray-600">Next.js 16, React 19, and Tailwind CSS v4 for blazing speed</p>
            </div>

            <div className="bg-white p-6 rounded-20 border-stroke shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-brand-orange to-brand-blue rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Production Ready</h3>
              <p className="text-sm text-gray-600">TypeScript, Redux Toolkit, React Query, and comprehensive API</p>
            </div>
          </div>

          <div className="mt-12 bg-white p-8 rounded-20 border-stroke">
            <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
            <div className="text-left space-y-3">
              <div className="flex items-start gap-3">
                <span className="bg-brand-orange text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">1</span>
                <p className="text-gray-700">Configure your hotel subdomain in the middleware</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-brand-orange text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">2</span>
                <p className="text-gray-700">Add hotel-specific branding and assets</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-brand-orange text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">3</span>
                <p className="text-gray-700">Deploy to your preferred hosting platform</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/about"
              className="inline-block bg-btn-gradient text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Learn More
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-stroke mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2026 Spodia. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
