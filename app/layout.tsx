import type { Metadata } from "next"
import "./globals.css"
import { getHeader } from "@/lib/api/header"
import { getFooter } from "@/lib/api/footer"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: {
    default: "Школа",
    template: "%s | Школа",
  },
  description: "Офіційний сайт школи",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Fetch layout data on the server — errors are handled gracefully
  const [header, footer] = await Promise.allSettled([getHeader(), getFooter()])
  console.log(header, footer)
  const headerData = header.status === "fulfilled" ? header.value : null
  const footerData = footer.status === "fulfilled" ? footer.value : null

  return (
    <html lang="uk">
      <body className="antialiased min-h-screen flex flex-col">
        {headerData && <Header data={headerData} />}
        <main className="flex-1">{children}</main>
        {footerData && <Footer data={footerData} />}
      </body>
    </html>
  )
}
