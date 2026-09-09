import type { Metadata } from "next";
import { calcDict } from "@/lib/i18n/calculator";
import { PalmonExpView } from "./PalmonExpView";

export const metadata: Metadata = {
  title: calcDict.ko.palmonExp.title,
  description: calcDict.ko.palmonExp.metaDescription,
};

export default function PalmonExpPage() {
  return <PalmonExpView />;
}
