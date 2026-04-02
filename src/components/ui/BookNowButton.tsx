import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookNowButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "gradient" | "solid" | "outline";
  showIcon?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

const BookNowButton: React.FC<BookNowButtonProps> = ({
  onClick,
  className,
  size = "md",
  variant = "gradient",
  showIcon = false,
  disabled = false,
  children = "Book Now",
}) => {
  const sizeClasses = {
    sm: "px-3 py-1 text-xs",
    md: "px-5 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantClasses = {
    gradient: "gradient-btn hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg",
    solid: "bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg",
    outline: "border-2 border-orange-500 text-orange-500 hover:bg-orange-50",
  };

  return (
    <Button
      className={cn(
        "rounded-full h-8 font-semibold transition-all duration-300",
        sizeClasses[size],
        variantClasses[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="flex items-center gap-2">
        {children}
        {showIcon && <ArrowRight className="w-4 h-4" />}
      </span>
    </Button>
  );
};

export default BookNowButton;
