import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className = "", hover = true }: GlassCardProps) {
  return (
    <div className={`glass-panel ${hover ? "glass-panel-hover" : ""} p-6 ${className}`.trim()}>
      {children}
    </div>
  );
}
