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

export interface MenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
  soon?: boolean;
}

export interface MenuSection {
  section: string;
  items: MenuItem[];
}

export const menu: MenuSection[] = [
  {
    section: "홈",
    items: [{ href: "/", label: "메인", icon: Home }],
  },
  {
    section: "초보자 가이드",
    items: [
      { href: "/economy", label: "재화 · 과금", icon: Coins },
      { href: "/equipment", label: "장비 업그레이드", icon: Sword },
      { href: "/buildings", label: "캠프 업그레이드", icon: Building2 },
    ],
  },
  {
    section: "팰몬 육성",
    items: [
      { href: "/traits", label: "특성 가이드", icon: Sparkles },
      { href: "/achievements", label: "업적 가이드", icon: Trophy },
    ],
  },
  {
    section: "실전 조합",
    items: [{ href: "/team-comps", label: "속성별 조합", icon: Swords }],
  },
  {
    section: "길드전",
    items: [{ href: "/gvg", label: "GvG 주간 미션", icon: Castle }],
  },
  {
    section: "시즌 가이드",
    items: [{ href: "/season1", label: "시즌 1 · 얼음 시대", icon: Snowflake }],
  },
  {
    section: "확장 예정",
    items: [
      { href: "/events", label: "이벤트 일정", icon: Calendar, soon: true },
      { href: "/community", label: "커뮤니티", icon: Users, soon: true },
    ],
  },
];
