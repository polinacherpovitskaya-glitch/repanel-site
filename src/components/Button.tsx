import Link from "next/link";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: ButtonProps) {
  const base = "inline-block font-bold tracking-[-0.01em] text-center";
  const sizeMap = {
    sm: "text-[13px] px-5 py-2",
    md: "text-[14px] px-6 py-[10px]",
    lg: "text-[15px] px-8 py-3",
  };

  const variantStyle: Record<string, React.CSSProperties> = {
    primary: {
      background: "#171513",
      color: "#fff",
      border: "2px solid #171513",
      fontFamily: "'Montserrat', var(--font-display), sans-serif",
    },
    outline: {
      background: "transparent",
      color: "#171513",
      border: "2px solid #171513",
      fontFamily: "'Montserrat', var(--font-display), sans-serif",
    },
    ghost: {
      background: "transparent",
      color: "#171513",
      border: "none",
      textDecoration: "underline",
      textUnderlineOffset: "4px",
      fontFamily: "'Montserrat', var(--font-display), sans-serif",
    },
  };

  return (
    <Link
      href={href}
      className={`${base} ${sizeMap[size]} ${variant !== "ghost" ? "rounded-pill" : ""} ${className}`}
      style={variantStyle[variant]}
    >
      {children}
    </Link>
  );
}
