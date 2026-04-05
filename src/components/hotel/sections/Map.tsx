type Props = { label?: string };

export default function Map({ label = "Location" }: Props) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-slate-100" aria-labelledby="map-heading">
      <h2 id="map-heading" className="sr-only">
        {label}
      </h2>
      <div className="flex aspect-[21/9] min-h-[200px] items-center justify-center text-sm text-gray-500 md:aspect-[2/1]">
        Map embed (Google / Mapbox) — server-friendly static map first, interactive on client.
      </div>
    </section>
  );
}
