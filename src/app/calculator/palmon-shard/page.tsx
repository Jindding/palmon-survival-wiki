import type { Metadata } from "next";
import { calcDict } from "@/lib/i18n/calculator";
import { PalmonShardView } from "./PalmonShardView";

export const metadata: Metadata = {
  title: calcDict.ko.palmonShard.title,
  description: calcDict.ko.palmonShard.metaDescription,
};

export default function PalmonShardPage() {
  return <PalmonShardView />;
}
