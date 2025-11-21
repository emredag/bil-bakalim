/**
 * Simple Avatar Component - Displays user initials
 */
interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  // Get initials (first letter of each word, max 2)
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Size classes
  const sizeClasses = {
    sm: 'h-10 w-10 text-sm',
    md: 'h-14 w-14 text-base',
    lg: 'h-20 w-20 text-2xl',
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 font-bold text-white ${sizeClasses[size]} ${className}`}
    >
      {initials}
    </div>
  );
}
