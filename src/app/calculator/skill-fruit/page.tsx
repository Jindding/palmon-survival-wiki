import type { Metadata } from "next";
import { calcDict } from "@/lib/i18n/calculator";
import { SkillFruitView } from "./SkillFruitView";

export const metadata: Metadata = {
  title: calcDict.ko.skillFruit.title,
  description: calcDict.ko.skillFruit.metaDescription,
};

export default function SkillFruitPage() {
  return <SkillFruitView />;
}
