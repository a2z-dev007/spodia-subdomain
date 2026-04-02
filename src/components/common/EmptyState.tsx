import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  secondaryActionLabel?: string
  secondaryActionHref?: string
  onSecondaryAction?: () => void
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryActionLabel,
  secondaryActionHref,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Icon */}
      {Icon && (
        <div className="mb-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <Icon className="w-10 h-10 text-gray-400" />
          </div>
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>

      {/* Description */}
      <p className="text-gray-600 mb-8 max-w-md">{description}</p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {actionLabel && (
          <>
            {actionHref ? (
              <Button asChild className="bg-[#FF9530] hover:bg-[#e8851c] text-white">
                <Link href={actionHref}>{actionLabel}</Link>
              </Button>
            ) : (
              <Button
                onClick={onAction}
                className="bg-[#FF9530] hover:bg-[#e8851c] text-white"
              >
                {actionLabel}
              </Button>
            )}
          </>
        )}

        {secondaryActionLabel && (
          <>
            {secondaryActionHref ? (
              <Button asChild variant="outline">
                <Link href={secondaryActionHref}>{secondaryActionLabel}</Link>
              </Button>
            ) : (
              <Button onClick={onSecondaryAction} variant="outline">
                {secondaryActionLabel}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Pre-built empty states for common scenarios
export function NoBookingsEmptyState() {
  return (
    <EmptyState
      title="No bookings yet"
      description="You haven't made any bookings yet. Start exploring amazing hotels and make your first reservation!"
      actionLabel="Browse Hotels"
      actionHref="/"
    />
  )
}

export function NoSearchResultsEmptyState({ onReset }: { onReset?: () => void }) {
  return (
    <EmptyState
      title="No results found"
      description="We couldn't find any hotels matching your search criteria. Try adjusting your filters or search terms."
      actionLabel="Clear Filters"
      onAction={onReset}
      secondaryActionLabel="Browse All Hotels"
      secondaryActionHref="/"
    />
  )
}

export function NoReviewsEmptyState() {
  return (
    <EmptyState
      title="No reviews yet"
      description="This property doesn't have any reviews yet. Be the first to share your experience!"
    />
  )
}
