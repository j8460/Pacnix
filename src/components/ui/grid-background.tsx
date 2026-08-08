import { cn } from "@/lib/utils";

type GridBackgroundProps = {
  className?: string;
  variant?: "dots" | "grid";
};

export function GridBackground({ className, variant = "dots" }: GridBackgroundProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        variant === "dots" &&
          "bg-[radial-gradient(circle_at_1px_1px,rgba(11,92,173,0.12)_1px,transparent_0)] [background-size:28px_28px]",
        variant === "grid" &&
          "bg-[linear-gradient(rgba(11,92,173,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(11,92,173,0.06)_1px,transparent_1px)] [background-size:40px_40px]",
        className
      )}
    />
  );
}
