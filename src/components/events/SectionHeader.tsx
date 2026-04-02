interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
}

export default function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="relative group">
      {eyebrow && (
        <div className="flex items-center gap-3 mb-4">
          <span className="h-[2px] w-8 bg-[#FF9530] rounded-full" />
          <p className="text-[11px] font-black text-[#FF9530] uppercase tracking-[0.2em]">
            {eyebrow}
          </p>
        </div>
      )}
      <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-4xl font-black text-gray-900 leading-[1.15] mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base sm:text-lg text-gray-500 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
