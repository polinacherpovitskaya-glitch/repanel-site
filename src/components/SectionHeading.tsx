const D = "'Montserrat', var(--font-display), sans-serif";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}

export function SectionHeading({ title, subtitle, align = "left", light = false }: SectionHeadingProps) {
  return (
    <div className={`mb-10 ${align === "center" ? "text-center" : ""}`}>
      <h2
        className="font-bold leading-[0.92]"
        style={{
          fontFamily: D,
          fontSize: "clamp(32px, 3.6vw, 52px)",
          letterSpacing: "-1.5px",
          color: light ? "#fff" : "#171513",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-5 text-[16px] md:text-[18px] leading-[1.55] max-w-[640px] ${align === "center" ? "mx-auto" : ""}`}
          style={{ opacity: 0.55, color: light ? "#fff" : "#171513" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
