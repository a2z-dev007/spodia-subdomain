export default function DiningSpaEvents() {
  return (
    <section className="grid gap-6 md:grid-cols-3" aria-label="Dining, spa, and events">
      {[
        { title: "Dine", body: "Restaurants, bars, and in-room dining." },
        { title: "Spa & wellness", body: "Treatments and fitness." },
        { title: "Events", body: "Meetings, celebrations, and venues." },
      ].map((card) => (
        <div key={card.title} className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900">{card.title}</h3>
          <p className="mt-2 text-sm text-gray-600">{card.body}</p>
        </div>
      ))}
    </section>
  );
}
