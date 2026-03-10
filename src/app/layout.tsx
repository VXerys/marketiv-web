import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ChatbotFab } from "@/components/features/chatbot/ChatbotFab";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Marketiv",
  description: "Marketplace for UMKM and Creators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        {children}
        <ChatbotFab />
      </body>
    </html>
  );
}
