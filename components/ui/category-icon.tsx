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
