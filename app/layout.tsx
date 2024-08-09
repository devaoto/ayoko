import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Toaster } from "sonner";

import { Providers } from "./providers";
import { JotaiProviders } from "./jotai-providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import ProgressBar from "@/components/progress";
import SideBar from "@/components/sidebar";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Toaster richColors />
        <JotaiProviders>
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <ProgressBar />
            <div className="relative mb-32 flex h-screen min-h-screen flex-col sm:mb-0">
              <SideBar />
              <main className="container mx-auto max-w-7xl flex-grow px-2">
                {children}
              </main>
            </div>
          </Providers>
        </JotaiProviders>
      </body>
    </html>
  );
}
