import { cn } from "@/lib/utils";

/**
 * آرامسن logo mark — a protective ring with a gentle leaf inside,
 * drawn as a single SVG so it always feels custom, not an icon-pack default.
 */
export function AramsanMark({
  className,
  tone = "teal",
}: {
  className?: string;
  tone?: "teal" | "ivory";
}) {
  const stroke = tone === "ivory" ? "#FAF6EF" : "#1C3E3A";
  const leaf = tone === "ivory" ? "#DE9862" : "#C97845";
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="20"
        cy="20"
        r="17.5"
        stroke={stroke}
        strokeWidth="2"
        opacity="0.9"
      />
      {/* leaf / arc representing calm breath */}
      <path
        d="M12 24c0-6 4.5-10 11-10 0 6.5-4.5 10.5-11 10.5"
        stroke={leaf}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 23c1.6-2.4 4-4 7-4.6"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

export function AramsanWordmark({
  className,
  tone = "teal",
}: {
  className?: string;
  tone?: "teal" | "ivory";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 select-none",
        className
      )}
    >
      <AramsanMark className="h-7 w-7" tone={tone} />
      <span
        className={cn(
          "font-extrabold tracking-tight text-[1.35rem] leading-none",
          tone === "ivory" ? "text-ivory" : "text-teal"
        )}
        style={{ fontFamily: "var(--font-vazirmatn)" }}
      >
        آرامسن
      </span>
    </span>
  );
}
