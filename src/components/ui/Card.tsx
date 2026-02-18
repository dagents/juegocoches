interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "purple" | "cyan" | "none";
}

export default function Card({
  children,
  className = "",
  glow = "none",
}: CardProps) {
  const glowStyles = {
    purple: "neon-border-purple neon-glow-purple",
    cyan: "neon-border-cyan neon-glow-cyan",
    none: "border border-surface-card",
  };

  return (
    <div
      className={`bg-surface-card rounded-xl p-4 md:p-6 ${glowStyles[glow]} ${className}`}
    >
      {children}
    </div>
  );
}
