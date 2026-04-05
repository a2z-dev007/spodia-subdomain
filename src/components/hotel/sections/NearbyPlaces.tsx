export default function NearbyPlaces() {
  return (
    <section aria-labelledby="nearby-heading">
      <h2 id="nearby-heading" className="text-xl font-semibold text-gray-900 md:text-2xl">
        Nearby
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {["Airport", "Transit", "Dining", "Attractions"].map((item) => (
          <li key={item} className="rounded-xl border border-gray-200/80 bg-white px-4 py-3 text-sm text-gray-700">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
