import { cn } from "@/lib/utils";

type BentoGridProps = {
  children: React.ReactNode;
  className?: string;
};

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoItem({
  children,
  className,
  span = "default",
}: {
  children: React.ReactNode;
  className?: string;
  span?: "default" | "wide" | "tall";
}) {
  return (
    <div
      className={cn(
        span === "wide" && "md:col-span-2",
        span === "tall" && "md:row-span-2",
        className
      )}
    >
      {children}
    </div>
  );
}
