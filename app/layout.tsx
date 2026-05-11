// @ts-nocheck

import "./globals.css";
import type { Metadata } from "next";
import { getHeader } from "@/lib/api/header";
import { getFooter } from "@/lib/api/footer";
import { TEXT_SCALE_INIT_SCRIPT } from "@/lib/text-scale";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Школа",
    template: "%s | Школа",
  },
  description: "Офіційний сайт школи",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [header, footer] = await Promise.allSettled([getHeader(), getFooter()]);

  const headerData = header.status === "fulfilled" ? header.value : null;
  const footerData = footer.status === "fulfilled" ? footer.value : null;

  return (
    <html lang="uk" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: TEXT_SCALE_INIT_SCRIPT }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        {headerData && <Header data={headerData} />}
        <main className="flex-1">{children}</main>
        {footerData && <Footer data={footerData} />}
      </body>
    </html>
  );
}
