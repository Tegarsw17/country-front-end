// config/navigation.ts
export type NavItem = {
  href: string;
  label: string;
};

export const mainNav: NavItem[] = [
  { href: "/", label: "dashboard" },
  { href: "/markets", label: "Markets" },
  { href: "/strategies", label: "Strategies" },
  { href: "/my-position", label: "My Positions" },
  { href: "/docs", label: "Docs" },
];
