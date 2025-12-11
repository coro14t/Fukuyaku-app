import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "俺emini Works",
  description: "個人開発アプリとブログのサイト",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="font-sans bg-gray-50">{children}</body>
    </html>
  );
}
