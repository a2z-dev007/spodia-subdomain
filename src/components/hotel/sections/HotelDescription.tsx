type Props = { entityKey: string };

export default function HotelDescription({ entityKey }: Props) {
  const label = entityKey.replace(/-/g, " ");
  return (
    <section className="space-y-3" aria-labelledby="hotel-description-heading">
      <h2 id="hotel-description-heading" className="text-xl font-semibold text-gray-900 md:text-2xl">
        Welcome
      </h2>
      <p className="text-pretty text-sm leading-relaxed text-gray-600 md:text-base">
        Discover <span className="font-medium text-gray-800">{label}</span> — premium stays, thoughtful
        service, and a seamless booking experience on Spodia. Full editorial copy and amenities will load
        from your CMS/API.
      </p>
    </section>
  );
}
