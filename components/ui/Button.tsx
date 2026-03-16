import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "default" | "primary" | "link";

interface Props {
  variant?: Variant;
  href?: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer";

const variants: Record<Variant, string> = {
  default:
    "bg-[hsl(84_55%_45%)] text-white px-5 py-2.5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5",
  primary:
    "bg-[hsl(50_100%_50%)] text-[hsl(0_0%_21%)] px-5 py-2.5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5",
  link:
    "bg-transparent text-[hsl(84_55%_45%)] px-0 py-0 hover:underline underline-offset-4",
};

export default function Button({
  variant = "default",
  href,
  className = "",
  children,
  onClick,
  type = "button",
}: Props) {
  const classes = `${base} ${variants[variant]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
