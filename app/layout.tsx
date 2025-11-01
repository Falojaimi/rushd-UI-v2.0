import type { Metadata } from "next";
import { Manrope, DM_Sans } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const dm_sans = DM_Sans({
  variable: "--font-dm_sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Rushd | You’re Academic Advisor",
  description: "You’re Academic Advisor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${dm_sans.variable} font-manrope antialiased`}>
        {children}
      </body>
    </html>
  );
}
