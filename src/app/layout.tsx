import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "나 뭐하지? | 진로 탐색 테스트",
  description:
    "아이를 키운 후, 다시 시작하는 나를 위한 무료 진로 탐색 테스트. 24문항으로 나의 일하는 방식과 가능성을 알아보세요.",
  openGraph: {
    title: "나 뭐하지? | 진로 탐색 테스트",
    description:
      "아이를 키운 후, 다시 시작하는 나를 위한 무료 진로 탐색 테스트",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
