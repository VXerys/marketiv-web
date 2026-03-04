import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "soft" | "ghost";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-coral text-white border border-transparent hover:bg-brand-coral/90 shadow-lg shadow-brand-coral/20",
  outline:
    "bg-transparent text-white border-2 border-white hover:bg-white/10 backdrop-blur-sm",
  soft:
    "bg-pink-50 text-brand-coral border border-pink-200 hover:bg-pink-100",
  ghost:
    "bg-transparent text-white border border-transparent hover:bg-white/10",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3 text-base font-bold",
  xl: "px-6 py-3 sm:px-8 sm:py-3.5 min-w-[200px] sm:min-w-[220px] text-base sm:text-lg font-bold",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
