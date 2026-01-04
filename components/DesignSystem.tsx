
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility for Tailwind merging */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  showDots?: boolean;
  variant?: 'glass' | 'solid' | 'featured';
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  icon, 
  children, 
  showDots = false, 
  variant = 'glass', 
  className 
}) => {
  const baseStyles = "rounded-2xl overflow-hidden transition-all duration-300";
  const variants = {
    glass: "glass-card",
    solid: "bg-white border border-zinc-200",
    featured: "bg-brand-gradient text-white border-none"
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)}>
      {(title || showDots) && (
        <div className="flex items-center justify-between px-5 py-4 border-bottom border-zinc-200/50 bg-white/30">
          <div className="flex items-center gap-3">
            {icon && <span className="text-indigo-500">{icon}</span>}
            <span className="heading-display font-semibold text-sm uppercase tracking-wider opacity-70">
              {title}
            </span>
          </div>
          {showDots && (
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 opacity-80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 opacity-80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 opacity-80" />
            </div>
          )}
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className, 
  children, 
  ...props 
}) => {
  const base = "inline-flex items-center justify-center gap-2 font-medium transition-all rounded-xl disabled:opacity-50 active:scale-95";
  const variants = {
    primary: "bg-brand-gradient text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300",
    secondary: "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50",
    ghost: "bg-transparent text-zinc-500 hover:bg-zinc-100",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3 text-base"
  };

  return (
    <button 
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : children}
    </button>
  );
};

export const Badge: React.FC<{ children: React.ReactNode, variant?: string }> = ({ children, variant = "neutral" }) => {
  const styles: Record<string, string> = {
    neutral: "bg-zinc-100 text-zinc-600",
    active: "bg-emerald-100 text-emerald-700",
    silenced: "bg-amber-100 text-amber-700",
    spam: "bg-red-100 text-red-700",
    indigo: "bg-indigo-100 text-indigo-700"
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-tight", styles[variant])}>
      {children}
    </span>
  );
};
