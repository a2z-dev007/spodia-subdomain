export default function RatesCalendar() {
  return (
    <section className="rounded-2xl border border-gray-200/80 bg-gradient-to-br from-slate-50 to-white p-6 md:p-8" aria-labelledby="rates-heading">
      <h2 id="rates-heading" className="text-xl font-semibold text-gray-900 md:text-2xl">
        Rates &amp; availability
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Calendar and dynamic pricing load here (SSR-friendly when wired to inventory APIs).
      </p>
      <div className="mt-6 h-40 rounded-xl border border-dashed border-gray-300 bg-white/60" aria-hidden />
    </section>
  );
}
