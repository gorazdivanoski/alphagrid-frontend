// Reusable skeleton loading component with a pulse animation
// and customizable styling for content placeholders.

export default function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-white/10 rounded-md ${className}`} />;
}
