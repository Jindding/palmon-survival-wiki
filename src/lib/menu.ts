import type { LucideIcon } from "lucide-react";
import {
  Home,
  Info,
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
  BookOpen,
  Wind,
  ShieldAlert,
  Gem,
  Flame,
  Medal,
  Lightbulb,
  Library,
  Mail,
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
    items: [
      { href: "/", label: "메인", icon: Home },
      { href: "/overview", label: "게임 소개", icon: Info },
      { href: "/board", label: "자유게시판", icon: Users },
      { href: "/tips", label: "한줄팁 모음", icon: Lightbulb },
      { href: "/contact", label: "문의하기", icon: Mail },
    ],
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
      { href: "/palmon", label: "팰몬 도감", icon: BookOpen },
      { href: "/traits", label: "특성 가이드", icon: Sparkles },
      { href: "/traits-codex", label: "특성 도감", icon: Library },
      { href: "/achievements", label: "업적 가이드", icon: Trophy },
    ],
  },
  {
    section: "실전 조합",
    items: [{ href: "/team-comps", label: "속성별 조합", icon: Swords }],
  },
  {
    section: "길드전 · 경쟁",
    items: [
      { href: "/gvg", label: "GvG 주간 미션", icon: Castle },
      { href: "/mvm", label: "모험가 대회 (일일)", icon: Medal },
    ],
  },
  {
    section: "시즌 가이드",
    items: [{ href: "/season1", label: "시즌 1 · 얼음 시대", icon: Snowflake }],
  },
  {
    section: "정기 이벤트",
    items: [
      { href: "/events/sandstorm", label: "모래폭풍 전장 (주간)", icon: Wind },
      { href: "/events/hoofrit-rampage", label: "후피릿 폭주 (격주)", icon: ShieldAlert },
      { href: "/events/treasure-pot", label: "보물 항아리 (월간)", icon: Gem },
      { href: "/events/ember-wars", label: "불씨 쟁탈전 (시즌)", icon: Flame },
    ],
  },
  {
    section: "확장 예정",
    items: [{ href: "/events", label: "이벤트 일정", icon: Calendar, soon: true }],
  },
];
