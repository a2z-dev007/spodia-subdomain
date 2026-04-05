type Props = {
  title: string;
  entityKey: string;
  intro: string;
  children?: React.ReactNode;
};

export default function HotelSegmentPageShell({ title, entityKey, intro, children }: Props) {
  const label = entityKey.replace(/-/g, " ");
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">{title}</h1>
      <p className="mt-4 text-pretty text-base leading-relaxed text-gray-600">
        {intro.replace("{hotel}", label)}
      </p>
      {children ? <div className="mt-8 space-y-4 text-gray-700">{children}</div> : null}
    </article>
  );
}
