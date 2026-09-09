import type { Metadata } from "next";
import { calcDict } from "@/lib/i18n/calculator";
import { EnergyBeadView } from "./EnergyBeadView";

export const metadata: Metadata = {
  title: calcDict.ko.energyBead.title,
  description: calcDict.ko.energyBead.metaDescription,
};

export default function EnergyBeadPage() {
  return <EnergyBeadView />;
}
