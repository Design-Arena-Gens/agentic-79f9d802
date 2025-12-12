import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "المفتش - نظام إدارة التفتيش",
  description: "نظام إدارة شامل للمفتشيات التربوية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
