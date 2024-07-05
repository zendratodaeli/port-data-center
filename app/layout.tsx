import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToasterProvider } from "@/providers/toast-provider";
import { neobrutalism } from "@clerk/themes";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Port Data-Center",
  description: "Uploading data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: neobrutalism
      }}
    >
      <html lang="en">
        <body>
          <ToasterProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
