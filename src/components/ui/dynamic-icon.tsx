import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { Circle } from "lucide-react";

type Props = {
  name: string;
  className?: string;
};

export function DynamicIcon({ name, className }: Props) {
  const iconMap = Icons as unknown as Record<string, LucideIcon>;
  const Icon = iconMap[name] ?? Circle;
  return <Icon className={className} aria-hidden />;
}
