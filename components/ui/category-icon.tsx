import {
  Building2,
  Scale,
  Handshake,
  Landmark,
  Users,
  Receipt,
  KeyRound,
  Fingerprint,
  Gavel,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Building2,
  Scale,
  Handshake,
  Landmark,
  Users,
  Receipt,
  KeyRound,
  Fingerprint,
  Gavel,
  BookOpen,
};

export function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = map[name] ?? Gavel;
  return <Icon className={className} strokeWidth={1.4} />;
}