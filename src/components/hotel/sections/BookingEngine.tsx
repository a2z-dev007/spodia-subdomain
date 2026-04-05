type Props = { heading?: string; entityKey: string };

export default function BookingEngine({ heading = "Book online", entityKey }: Props) {
  return (
    <section
      className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm md:p-8"
      aria-labelledby="booking-engine-heading"
    >
      <h2 id="booking-engine-heading" className="text-xl font-semibold text-gray-900 md:text-2xl">
        {heading}
      </h2>
      <p className="mt-2 text-sm text-gray-600 md:text-base">
        Booking flow for <span className="font-medium text-gray-800">{entityKey.replace(/-/g, " ")}</span>{" "}
        will plug in here (dates, rooms, guests).
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="h-12 rounded-xl bg-gray-100" aria-hidden />
        <div className="h-12 rounded-xl bg-gray-100" aria-hidden />
        <div className="h-12 rounded-xl bg-gray-100 sm:col-span-2" aria-hidden />
      </div>
    </section>
  );
}
