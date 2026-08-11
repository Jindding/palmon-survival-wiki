import type { LucideIcon } from "lucide-react";
import {
  Home,
  Sparkles,
  Coins,
  Sword,
  Trophy,
  Swords,
  Users,
  Calendar,
  Building2,
  Castle,
  Snowflake,
} from "lucide-react";
import type { Dict } from "./i18n/dict";

type NavKey = keyof Dict["nav"];

export interface MenuItem {
  href: string;
  labelKey: NavKey;
  icon: LucideIcon;
  soon?: boolean;
}

export interface MenuSection {
  sectionKey: NavKey;
  items: MenuItem[];
}

export const menu: MenuSection[] = [
  {
    sectionKey: "home",
    items: [{ href: "/", labelKey: "main", icon: Home }],
  },
  {
    sectionKey: "beginner",
    items: [
      { href: "/economy", labelKey: "economy", icon: Coins },
      { href: "/equipment", labelKey: "equipment", icon: Sword },
    ],
  },
  {
    sectionKey: "growth",
    items: [
      { href: "/traits", labelKey: "traits", icon: Sparkles },
      { href: "/achievements", labelKey: "achievements", icon: Trophy },
    ],
  },
  {
    sectionKey: "battle",
    items: [{ href: "/team-comps", labelKey: "teamComps", icon: Swords }],
  },
  {
    sectionKey: "guild",
    items: [{ href: "/gvg", labelKey: "gvg", icon: Castle }],
  },
  {
    sectionKey: "season",
    items: [{ href: "/season1", labelKey: "season1", icon: Snowflake }],
  },
  {
    sectionKey: "soon",
    items: [
      { href: "/events", labelKey: "events", icon: Calendar, soon: true },
      { href: "/buildings", labelKey: "buildings", icon: Building2, soon: true },
      { href: "/community", labelKey: "community", icon: Users, soon: true },
    ],
  },
];
