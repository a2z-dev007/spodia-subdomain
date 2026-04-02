"use client"

import {Star} from "lucide-react"

type RatingStarsProps = {
    rating: number
    max?: number
    filledColor?: string
    emptyColor?: string
    size?: string
}

const RatingStars = ({
                         rating,
                         max,
                         filledColor = "text-yellow-400",
                         emptyColor = "text-gray-300",
                         size = "w-5 h-5",
                     }: RatingStarsProps) => {
    const stars = []
    const displayMax = max || Math.ceil(rating || 0);

    if (rating === 0 && !max) return null;

    for (let i = 1; i <= displayMax; i++) {
        if (rating >= i) {
            // Full star
            stars.push(
                <Star key={i} className={`${size} ${filledColor} fill-current`}/>
            )
        } else if (rating > i - 1 && rating < i) {
            // Half star
            stars.push(
                <div key={i} className={`relative inline-block ${size}`}>
                    {/* Left half filled */}
                    <Star
                        className={`${size} ${filledColor} fill-current absolute top-0 left-0`}
                        style={{clipPath: "inset(0 50% 0 0)"}}
                    />
                    {/* Right half empty */}
                    <Star className={`${size} ${emptyColor}`}/>
                </div>
            )
        } else {
            // Empty star
            stars.push(
                <Star key={i} className={`${size} ${emptyColor}`}/>
            )
        }
    }

    return <div className="flex items-center gap-1">{stars}</div>
}

export default RatingStars
