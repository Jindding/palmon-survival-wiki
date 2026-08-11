import raw from "./palmons.json";

export interface PalmonSkill {
  objectId: string;
  name: string;
  type: string;
  description: string;
  imageUrl: string;
}

export interface PalmonBasicInfo {
  name: string;
  description: string;
}

export interface Palmon {
  objectId: string;
  name: string;
  imageUrl: string;
  mobileBgColor?: string;
  basicInfos?: PalmonBasicInfo[];
  skills: PalmonSkill[];
}

export const palmons: Palmon[] = raw as Palmon[];

export function getPalmon(objectId: string): Palmon | undefined {
  return palmons.find((p) => p.objectId === objectId);
}

export function cleanDescription(desc: string): string[] {
  return desc
    .replace(/<BR\s*\/?>/gi, "\n")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export const palmonsMeta = {
  totalKnown: 43,
  collected: palmons.filter((p) => p.skills.length > 0).length,
  listed: palmons.length,
  source: "네이버 게임 라운지 · 팰몬 서바이벌 DB",
};
