import type { Metadata } from "next";
import { calcDict } from "@/lib/i18n/calculator";
import { MasterworkBeadView } from "./MasterworkBeadView";

export const metadata: Metadata = {
  title: calcDict.ko.masterworkBead.title,
  description: calcDict.ko.masterworkBead.metaDescription,
};

export default function MasterworkBeadPage() {
  return <MasterworkBeadView />;
}
