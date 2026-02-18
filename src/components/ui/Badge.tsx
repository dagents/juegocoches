interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "danger" | "warning" | "info";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variants = {
    default: "bg-surface-elevated text-gray-300 border-gray-600",
    success: "bg-green-900/30 text-green-400 border-green-700/50",
    danger: "bg-red-900/30 text-red-400 border-red-700/50",
    warning: "bg-yellow-900/30 text-yellow-400 border-yellow-700/50",
    info: "bg-cyan-900/30 text-cyan-400 border-cyan-700/50",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
