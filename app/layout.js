import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Academic AI ChatBot",
  description: "An AI assistant for astronomy and mathematics related queries.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased h-[100dvh] w-[100dvw] flex flex-col items-center justify-center overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
