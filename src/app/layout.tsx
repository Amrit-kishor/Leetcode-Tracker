import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { CommandPalette } from "@/components/layout/command-palette";
import "./globals.css";
 
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
 
export const metadata: Metadata = {
  title: {
    default: "LeetCode Progress Explorer",
    template: "%s | LeetCode Progress Explorer",
  },
  description:
    "Analyze, compare, and visualize LeetCode coding progress with interactive charts and AI-powered insights.",
  keywords: [
    "LeetCode",
    "coding",
    "progress",
    "analytics",
    "comparison",
    "dashboard",
  ],
};
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <CommandPalette />
            <footer className="border-t border-border/40 py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-muted-foreground">
                  Built with ❤️ using Next.js, shadcn/ui &amp; Recharts.
                  Data from{" "}
                  <a
                    href="https://github.com/alfaarghya/alfa-leetcode-api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    alfa-leetcode-api
                  </a>
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
