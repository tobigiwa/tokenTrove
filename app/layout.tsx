import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Wallet } from "@/context/walletProvider";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
 });

 const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-roboto-mono',
 })


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="cupcake" className={`${inter.variable} ${robotoMono.variable}`} >
      <body className="min-h-screen min-w-max">
        <Wallet>
          {children}
        </Wallet>
      </body>
    </html>
  );
}
