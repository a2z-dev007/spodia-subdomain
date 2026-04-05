export default function Reviews() {
  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white p-6 md:p-8" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="text-xl font-semibold text-gray-900 md:text-2xl">
        Guest reviews
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Aggregated ratings and reviews render here (ideal for client-side SWR once APIs are connected).
      </p>
      <ul className="mt-4 space-y-3">
        {[1, 2].map((i) => (
          <li key={i} className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
            Review placeholder {i}
          </li>
        ))}
      </ul>
    </section>
  );
}
