import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

       export const getRatingLabel = (rating: number) => {
            if (rating >= 9) return 'Excellent';
            if (rating >= 8) return 'Very Good';
            if (rating >= 7) return 'Good';
            if (rating >= 6) return 'Pleasant';
            if (rating >= 5) return 'Average';
            if (rating > 0) return 'Below Average';
            return 'No Rating';
        }
export const generateBadgeColor = (label: string) => {
    const labels = [
        {
            label: "eco green hotels",
            color: "green"
        },
        {
            label: "resort",
            color: "blue"
        },

        {
            label: "deluxe hotels",
            color: "orange"
        },
        {
            label: "hotels",
            color: "pink"
        },
    ]
    const labelFound = labels.find((labelObj) => labelObj.label.toLowerCase() === label.toLowerCase())
    return labelFound?.color || "green"
}