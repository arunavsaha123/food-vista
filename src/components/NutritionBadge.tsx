
import { cn } from "@/lib/utils";

interface NutritionBadgeProps {
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const NutritionBadge = ({ grade, className, size = 'md' }: NutritionBadgeProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };
  
  return (
    <div 
      className={cn(
        'nutrition-badge', 
        `nutrition-${grade.toLowerCase()}`,
        sizeClasses[size],
        className
      )}
    >
      {grade}
    </div>
  );
};

export default NutritionBadge;
