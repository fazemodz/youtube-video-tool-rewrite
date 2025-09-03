import type { Metadata } from "next";
import "./globals.css";
import Header from "./Components/header";
export const metadata: Metadata = {
  title: "YouTube Video Explorer",
  description: "Explore YouTube videos with detailed information, statistics, and metadata. Get comprehensive insights about any YouTube video including views, likes, comments, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
