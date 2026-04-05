export default function ImageGallery() {
  return (
    <section aria-labelledby="gallery-heading">
      <h2 id="gallery-heading" className="text-xl font-semibold text-gray-900 md:text-2xl">
        Gallery
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/3] rounded-xl bg-gray-200/90"
            aria-hidden
          />
        ))}
      </div>
    </section>
  );
}
