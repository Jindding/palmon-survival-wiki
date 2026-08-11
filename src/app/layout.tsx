import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: {
    default: "팰몬 허브 · 팰몬 서바이벌 가이드",
    template: "%s · 팰몬 허브",
  },
  description:
    "팰몬 서바이벌 비공식 팬 위키. 특성, 팰몬, 이벤트, 건물 정보를 한곳에서 확인하세요.",
  openGraph: {
    title: "팰몬 허브",
    description: "팰몬 서바이벌 비공식 팬 위키",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <main className="flex-1 p-4 md:p-8">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
