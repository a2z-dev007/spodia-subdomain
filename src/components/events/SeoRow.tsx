'use client'

import { useState } from 'react'
import Link from 'next/link'

interface SeoRowProps {
  title: string
  links: string[]
}

export default function SeoRow({ title, links }: SeoRowProps) {
  const [expanded, setExpanded] = useState(false)
  const visible = links.slice(0, 5)
  const hidden = links.slice(5)

  return (
    <div className="text-sm leading-relaxed text-gray-500">
      <span className="text-gray-800 font-bold mr-2 whitespace-nowrap">{title}:</span>

      {visible.map((l, i) => (
        <span key={i}>
          <Link href="#" className="text-gray-500 hover:text-[#FF9530] transition-colors">{l}</Link>
          {(i < visible.length - 1 || (hidden.length > 0 && expanded)) && (
            <span className="text-gray-300 mx-1.5">|</span>
          )}
        </span>
      ))}

      {hidden.length > 0 && (
        <>
          {expanded && hidden.map((l, i) => (
            <span key={i}>
              <Link href="#" className="text-gray-500 hover:text-[#FF9530] transition-colors">{l}</Link>
              {i < hidden.length - 1 && <span className="text-gray-300 mx-1.5">|</span>}
            </span>
          ))}
          <button
            onClick={() => setExpanded(e => !e)}
            className="ml-2 text-[#078ED8] hover:text-[#0679b8] text-xs font-semibold hover:underline"
          >
            {expanded ? 'See less' : 'See more'}
          </button>
        </>
      )}
    </div>
  )
}
