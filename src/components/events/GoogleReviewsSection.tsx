import SectionHeader from './SectionHeader'
import Stars from './Stars'
import { googleReviews } from './data'

export default function GoogleReviewsSection() {
  return (
    <section className="py-24 bg-gray-50/50 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none inter-grid" />

      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <SectionHeader
            eyebrow="Real Stories"
            title="Trusted by Event Hosts"
            subtitle="Read what our satisfied clients and professional planners have to say about their experience with Spodia."
          />
          
          {/* Google Global Rating Badge */}
          <div className="group bg-white rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)] px-8 py-6 flex items-center gap-6 shrink-0 lg:mb-4 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500">
            <div className="relative">
              <svg className="w-12 h-12" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            <div className="h-10 w-[1px] bg-gray-100" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-gray-900 tracking-tighter">4.8</span>
                <Stars count={5} />
              </div>
              <p className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] mt-1">1,240 Verified Reviews</p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {googleReviews.map((r, idx) => (
            <article
              key={r.name}
              className="group bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-sm font-black text-[#FF9530] group-hover:bg-[#FF9530] group-hover:text-white transition-all duration-500 shadow-sm">
                  {r.initials}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-extrabold text-gray-900 truncate tracking-tight">{r.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{r.role}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <Stars count={r.stars} />
              </div>

              <p className="text-gray-600 text-sm leading-relaxed font-medium mb-6 flex-grow">
                "{r.text}"
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{r.date}</span>
                <div className="w-4 h-4 text-gray-200">
                  <svg fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9.01701C7.91244 16 7.01701 16.8954 7.01701 18V21H5.01701V18C5.01701 15.7909 6.80787 14 9.01701 14H12.017C14.2261 14 16.017 15.7909 16.017 18V21H14.017Z" /><path d="M12.017 12C13.6739 12 15.017 10.6569 15.017 9C15.017 7.34315 13.6739 6 12.017 6C10.3602 6 9.01701 7.34315 9.01701 9C9.01701 10.6569 10.3602 12 12.017 12Z" /></svg>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .inter-grid {
          background-image: radial-gradient(#FF9530 0.5px, transparent 0.5px);
          background-size: 24px 24px;
        }
      `}</style>
    </section>
  )
}
