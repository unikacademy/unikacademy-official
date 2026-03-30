import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UNIK Academy - Empowering Communication. Transforming Personalities.",
  description:
    "UNIK Academy offers comprehensive courses in Communication Skills, Public Speaking, Spoken English, Grammar, and Personality Development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
