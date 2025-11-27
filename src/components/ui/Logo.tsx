/**
 * Logo Component
 * Application logo - uses the current brand icon
 * Based on /public/icon.svg (converted from android-chrome-512x512.png)
 */

interface LogoProps {
  /** Size in pixels */
  size?: number;
  /** Optional className for additional styling */
  className?: string;
}

export function Logo({ size = 48, className = '' }: LogoProps) {
  return (
    <img
      src="/icon.svg"
      alt="Bil Bakalım Logo"
      width={size}
      height={size}
      className={`rounded-xl ${className}`}
    />
  );
}
